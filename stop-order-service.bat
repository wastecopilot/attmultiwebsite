@echo off
rem Stops order-service, the Cloudflare quick tunnel and the keep-awake helper started by start-order-service.bat.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0order-service\local\stop.ps1"
echo.
pause
