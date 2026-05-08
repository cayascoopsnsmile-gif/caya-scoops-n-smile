@echo off
cd /d "%~dp0"
start "" cmd /c "node preview-server.js"
timeout /t 2 /nobreak >nul
start "" http://localhost:8091
