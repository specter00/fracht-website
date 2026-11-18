@echo off
rem Starts the local preview of the website and opens it in the browser.
rem Double-click this file. Close the window to stop the preview.
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install it from https://nodejs.org and start this file again.
  pause
  exit /b 1
)
title Website-Vorschau
echo Website-Vorschau: http://localhost:4173
echo Close this window to stop the preview.
echo.
node tools\dev-server.js --open
pause
