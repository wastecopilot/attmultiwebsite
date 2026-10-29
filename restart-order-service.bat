@echo off
rem Restarts only order-service (e.g. after the automation was updated). The tunnel and its address stay the same.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0order-service\local\restart-service.ps1"
echo.
pause
