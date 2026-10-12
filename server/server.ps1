# ============================================================
# PADUK SHOP - localhost server (zero-install, Windows)
# Receives data from Roblox script (paduk_bridge.luau):
#   POST /api/ingest
# Serves the web template + JSON API:
#   GET  /api/data     (latest packet for the web app)
#   GET  /api/health
#
# Run:
#   powershell -ExecutionPolicy Bypass -File server.ps1
# Then open http://127.0.0.1:3000 in your browser.
# ============================================================

$ErrorActionPreference = "Stop"
try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch { }
$Port = 3000
$RootDir = (Split-Path -Parent $MyInvocation.MyCommand.Path)
$WebRoot = Join-Path $RootDir ".."
$DataDir = Join-Path $RootDir "data"
$DataFile = Join-Path $DataDir "latest.json"

New-Item -ItemType Directory -Force -Path $DataDir | Out-Null

$Mime = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
}

$Listener = [System.Net.HttpListener]::new()
$Listener.Prefixes.Add("http://127.0.0.1:$Port/")
$Listener.Prefixes.Add("http://localhost:$Port/")
$Listener.Start()

Write-Host ""
Write-Host "  PADUK SHOP · LOCALHOST SERVER"
Write-Host "  Web : http://127.0.0.1:$Port/"
Write-Host "  API : POST /api/ingest  (from Roblox script)"
Write-Host "        GET  /api/data    (for the web app)"
Write-Host "  Ctrl+C to stop"
Write-Host ""

function Send-Response($ctx, $status, $body, $contentType) {
    $ctx.Response.StatusCode = $status
    $ctx.Response.ContentType = $contentType
    if ($null -ne $body) {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($body)
        $ctx.Response.ContentLength64 = $bytes.Length
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    $ctx.Response.Close()
}

$script:LiveData = $null
$script:ThumbCache = @{}   # assetId → cdn url (cache ตลอดอายุ server)

# ---- โฟลเดอร์เก็บรูปไอคอนที่ bridge export จากในเกม ----
Add-Type -AssemblyName System.Drawing
$IconDir = Join-Path $WebRoot "assets\icons"
New-Item -ItemType Directory -Force -Path $IconDir | Out-Null

# เขียนไฟล์ PNG จาก base64 RGBA (bridge อ่านพิกเซลจากในเกมมาให้)
function Save-RgbaPng {
    param([string]$id, [string]$b64)
    try {
        if ([string]::IsNullOrWhiteSpace($b64)) { return $false }
        if ($b64.Length -lt 1000) { return $false }
        $rgba = [Convert]::FromBase64String($b64)
        if ($rgba.Length -ne (128 * 128 * 4)) { return $false }
        # System.Drawing ต้องการ BGRA — สลับ R/B
        $bgra = New-Object byte[] $rgba.Length
        for ($i = 0; $i -lt $rgba.Length; $i += 4) {
            $bgra[$i] = $rgba[$i + 2]
            $bgra[$i + 1] = $rgba[$i + 1]
            $bgra[$i + 2] = $rgba[$i]
            $bgra[$i + 3] = $rgba[$i + 3]
        }
        $bmp = New-Object System.Drawing.Bitmap(128, 128)
        $rect = New-Object System.Drawing.Rectangle(0, 0, 128, 128)
        $bd = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        [System.Runtime.InteropServices.Marshal]::Copy($bgra, 0, $bd.Scan0, $bgra.Length)
        $bmp.UnlockBits($bd)
        $out = Join-Path $IconDir ($id + ".png")
        $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        return $true
    } catch {
        Write-Host ("[ICON] save failed: " + $_.Exception.Message)
        return $false
    }
}

function Save-DataFile {
    param($json)
    $script:LiveData = $json
    [System.IO.File]::WriteAllText($DataFile, $json, [System.Text.Encoding]::UTF8)
}

if (Test-Path $DataFile) {
    try { $script:LiveData = [System.IO.File]::ReadAllText($DataFile) } catch { $script:LiveData = $null }
}

while ($Listener.IsListening) {
    try {
        $ctx = $Listener.GetContext()
        $req = $ctx.Request
        $resp = $ctx.Response
        $path = $req.Url.AbsolutePath

        $resp.Headers.Add("Access-Control-Allow-Origin", "*")
        $resp.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $resp.Headers.Add("Access-Control-Allow-Headers", "Content-Type")

        if ($req.HttpMethod -eq "OPTIONS") {
            $resp.StatusCode = 204
            $resp.Close()
            continue
        }

        if ($req.HttpMethod -eq "POST" -and $path -eq "/api/ingest") {
            $reader = [System.IO.StreamReader]::new($req.InputStream, [System.Text.Encoding]::UTF8)
            $body = $reader.ReadToEnd()
            $reader.Dispose()

            try {
                $null = $body | ConvertFrom-Json -ErrorAction Stop
                $p = $body | ConvertFrom-Json
                # merge: ถ้า payload ใหม่ไม่มี items/rarityColors แต่ข้อมูลเดิมมี → คงไว้
                # (กันสคริปต์เวอร์ชันเก่าในเกมยังรันอยู่แล้วเขียนทับทิ้ง)
                try {
                    $prev = $null
                    if ($null -ne $script:LiveData) { $prev = $script:LiveData | ConvertFrom-Json }
                    if ($null -ne $prev -and $null -ne $prev.payload -and $null -ne $prev.payload.live) {
                        $prevLive = $prev.payload.live
                        if ($null -eq $p.live) { $p | Add-Member -NotePropertyName live -NotePropertyValue (New-Object PSObject) }
                        $hasItems = $p.live.PSObject.Properties.Name -contains 'items'
                        $newItemCount = 0
                        if ($hasItems) { $newItemCount = @($p.live.items).Count }
                        if (($hasItems -eq $false -or $newItemCount -eq 0) -and ($prevLive.PSObject.Properties.Name -contains 'items') -and @($prevLive.items).Count -gt 0) {
                            if ($hasItems) { $p.live.items = $prevLive.items }
                            else { $p.live | Add-Member -NotePropertyName items -NotePropertyValue $prevLive.items }
                        }
                        # เติม tier รายชิ้น: ถ้าไอเทมใหม่ไม่มี tier แต่ของเดิมมี (ตาม id) → คง tier เดิมไว้
                        if (($p.live.PSObject.Properties.Name -contains 'items') -and ($prevLive.PSObject.Properties.Name -contains 'items')) {
                            $prevMap = @{}
                            foreach ($pi in $prevLive.items) { $prevMap[[string]$pi.id] = $pi }
                            foreach ($ni in $p.live.items) {
                                $niId = [string]$ni.id
                                if ((-not ($ni.PSObject.Properties.Name -contains 'tier')) -and $prevMap.ContainsKey($niId)) {
                                    $pt = $prevMap[$niId].PSObject.Properties.Name -contains 'tier'
                                    if ($pt) { $ni | Add-Member -NotePropertyName tier -NotePropertyValue $prevMap[$niId].tier }
                                }
                            }
                        }
                        if ((($p.live.PSObject.Properties.Name -contains 'rarityColors') -eq $false) -and ($prevLive.PSObject.Properties.Name -contains 'rarityColors')) {
                            $p.live | Add-Member -NotePropertyName rarityColors -NotePropertyValue $prevLive.rarityColors
                        }
                        # ถ้า rarityColors ที่ส่งมาเป็น object ว่าง {} → ถือว่าไม่มี ใช้ของเดิมแทน
                        if (($p.live.PSObject.Properties.Name -contains 'rarityColors')) {
                            $rcCount = 0
                            try { $rcCount = @($p.live.rarityColors.PSObject.Properties).Count } catch { $rcCount = 0 }
                            if ($rcCount -eq 0 -and ($prevLive.PSObject.Properties.Name -contains 'rarityColors') -and $prevLive.rarityColors -and @($prevLive.rarityColors.PSObject.Properties).Count -gt 0) {
                                $p.live.rarityColors = $prevLive.rarityColors
                            }
                        }
                        # runHistory: append-only — รวมรอบใหม่เข้ากับของเดิมตาม id (เก็บล่าสุด 20 รอบ ไม่ลบของเก่า)
                        try {
                            $prevHist = @()
                            if (($prevLive.PSObject.Properties.Name -contains 'runHistory') -and ($null -ne $prevLive.runHistory)) { $prevHist = @($prevLive.runHistory) }
                            $newHist = @()
                            if (($p.live.PSObject.Properties.Name -contains 'runHistory') -and ($null -ne $p.live.runHistory)) { $newHist = @($p.live.runHistory) }
                            $seenIds = @{}
                            foreach ($pe in $prevHist) { $seenIds[[string]$pe.id] = $true }
                            $fresh = @()
                            foreach ($ne in $newHist) {
                                $nid = [string]$ne.id
                                if ([string]::IsNullOrWhiteSpace($nid)) { continue }
                                if ($seenIds.ContainsKey($nid)) { continue }
                                $seenIds[$nid] = $true
                                $fresh += $ne
                            }
                            $mergedHist = @($fresh) + @($prevHist)
                            $merged = @($mergedHist | Select-Object -First 20)
                            if ($p.live.PSObject.Properties.Name -contains 'runHistory') { $p.live.runHistory = $merged }
                            else { $p.live | Add-Member -NotePropertyName runHistory -NotePropertyValue $merged }
                        } catch { }
                    }
                } catch { }
                # ---- บันทึกรูปไอคอนที่ bridge export มา (field .png = base64 RGBA) ----
                try {
                    if ($null -ne $p.live -and ($p.live.PSObject.Properties.Name -contains 'items')) {
                        foreach ($it in @($p.live.items)) {
                            $pngProp = $it.PSObject.Properties['png']
                            if ($null -ne $pngProp -and -not [string]::IsNullOrWhiteSpace([string]$pngProp.Value)) {
                                $okSave = Save-RgbaPng -id ([string]$it.id) -b64 ([string]$pngProp.Value)
                                if ($okSave) {
                                    # ลบ base64 ทิ้ง ไม่ให้ latest.json ใหญ่
                                    $it.PSObject.Properties.Remove('png')
                                }
                            }
                            # ถ้าไฟล์รูปมีอยู่แล้ว → ชี้ image ไปที่ local เสมอ
                            $iconFile = Join-Path $IconDir (([string]$it.id) + ".png")
                            if ((Test-Path $iconFile) -and -not ($it.PSObject.Properties.Name -contains 'image')) {
                                $it | Add-Member -NotePropertyName image -NotePropertyValue ("assets/icons/" + $it.id + ".png")
                            }
                        }
                    }
                } catch { }
                $packet = @{
                    ok = $true
                    receivedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssK")
                    payload = $p
                } | ConvertTo-Json -Depth 20
                Save-DataFile $packet
                Send-Response $ctx 200 '{"ok":true}' "application/json; charset=utf-8"
                $now = (Get-Date).ToString("HH:mm:ss")
                Write-Host ("[INGEST] " + $now + " received " + $body.Length + " bytes")
            } catch {
                Send-Response $ctx 400 '{"ok":false,"error":"invalid json"}' "application/json; charset=utf-8"
                Write-Host ("[INGEST] bad json: " + $_.Exception.Message)
            }
            continue
        }

        if ($req.HttpMethod -eq "GET" -and $path -eq "/api/data") {
            if ($null -ne $script:LiveData) {
                Send-Response $ctx 200 $script:LiveData "application/json; charset=utf-8"
            } else {
                Send-Response $ctx 404 '{"ok":false,"error":"no data yet"}' "application/json; charset=utf-8"
            }
            continue
        }
        if ($req.HttpMethod -eq "GET" -and $path -eq "/api/thumb") {
            # Proxy รูปจาก thumbnails.roblox.com ให้หน้าเว็บ (กัน CORS — browser ยิงตรงไม่ได้)
            # ใช้: /api/thumb?ids=101,102&size=420x420  →  { "102816679609155": "https://tr.rbxcdn.com/..." }
            try {
                $qs = $req.QueryString
                $ids = ""
                if ($null -ne $qs["assetIds"]) { $ids = $qs["assetIds"] } elseif ($null -ne $qs["ids"]) { $ids = $qs["ids"] }
                $size = "420x420"
                if ($null -ne $qs["size"] -and $qs["size"] -match '^\d+x\d+$') { $size = $qs["size"] }
                $idList = @()
                if ($ids) {
                    foreach ($x in ($ids -split ',')) {
                        $d = ($x -replace '\D','')
                        if ($d.Length -ge 4 -and $idList -notcontains $d) { $idList += $d }
                    }
                    $idList = @($idList | Select-Object -First 50)
                }
                if (-not $idList -or $idList.Count -eq 0) {
                    Send-Response $ctx 200 '{"ok":false,"error":"no ids"}' "application/json; charset=utf-8"
                    continue
                }
                $out = @{}
                $need = @()
                foreach ($i in $idList) {
                    if ($script:ThumbCache.ContainsKey($i)) { $out[$i] = $script:ThumbCache[$i] }
                    else { $need += $i }
                }
                if ($need.Count -gt 0) {
                    $idParam = [string]::Join(",", $need)
                    $tUrl = "https://thumbnails.roblox.com/v1/assets?assetIds=$idParam&size=$size&format=Png&isCircular=false"
                    try {
                        $tResp = Invoke-RestMethod -Uri $tUrl -TimeoutSec 10
                        foreach ($t in $tResp.data) {
                            $u = ""
                            if ($t.state -eq "Completed" -and $t.imageUrl) { $u = $t.imageUrl }
                            $script:ThumbCache[[string]$t.targetId] = $u
                            $out[[string]$t.targetId] = $u
                        }
                    } catch { Write-Host ("[THUMB] failed: " + $_.Exception.Message) }
                }
                $json = @{ ok = $true; data = $out } | ConvertTo-Json -Depth 5 -Compress
                Send-Response $ctx 200 $json "application/json; charset=utf-8"
            } catch {
                Send-Response $ctx 200 '{"ok":false,"error":"thumb failed"}' "application/json; charset=utf-8"
            }
            continue
        }

        if ($req.HttpMethod -eq "GET" -and $path -eq "/api/health") {
            Send-Response $ctx 200 '{"ok":true,"port":3000,"service":"paduk-shop"}' "application/json; charset=utf-8"
            continue
        }

        if ($req.HttpMethod -eq "GET") {
            $rel = $path
            if ($rel -eq "/") { $rel = "/index.html" }
            $full = [System.IO.Path]::GetFullPath((Join-Path $WebRoot ($rel.TrimStart('/'))))
            $rootFull = [System.IO.Path]::GetFullPath($WebRoot)
            if (-not $full.StartsWith($rootFull)) {
                Send-Response $ctx 403 "forbidden" "text/plain"
                continue
            }
            if (Test-Path $full -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($full).ToLower()
                $ct = "application/octet-stream"
                if ($Mime.ContainsKey($ext)) { $ct = $Mime[$ext] }
                $data = [System.IO.File]::ReadAllBytes($full)
                $resp.StatusCode = 200
                $resp.ContentType = $ct
                $resp.ContentLength64 = $data.Length
                $resp.OutputStream.Write($data, 0, $data.Length)
                $resp.Close()
            } else {
                Send-Response $ctx 404 "not found" "text/plain"
            }
            continue
        }

        Send-Response $ctx 405 "method not allowed" "text/plain"
    }
    catch {
        Write-Host ("[ERROR] " + $_.Exception.Message)
    }
}
