@echo off
rem Starts order-service and a Cloudflare quick tunnel for the website's Order Now demo, keeps this laptop
rem awake while they run, and prints the tunnel address to paste into Vercel. Stop with stop-order-service.bat.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0order-service\local\start.ps1"
echo.
pause
