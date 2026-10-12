@echo off
title PADUK SHOP - Local Server
cd /d "%~dp0"

echo ============================================
echo   PADUK SHOP - Local Server
echo   - Wait a few seconds, the web page opens automatically
echo   - Close this window or press Ctrl+C to stop the server
echo ============================================
echo.

REM ---------- If server is already running on port 3000, just open the page ----------
netstat -ano | findstr /c:":3000" | findstr /c:"LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo [OK] Server already running on port 3000
    echo [..] Opening browser...
    start "" http://127.0.0.1:3000
    timeout /t 2 /nobreak >nul
    exit /b 0
)

REM ---------- Open the web page automatically a few seconds after startup ----------
start "" powershell -NoProfile -Command "Start-Sleep -Seconds 3; Start-Process 'http://127.0.0.1:3000'"

REM ---------- Start the server (this window stays open and shows request logs) ----------
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server\server.ps1"

echo.
echo Server stopped. Press any key to close...
pause >nul
