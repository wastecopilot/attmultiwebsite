# Keeps this computer from going to sleep while order-service runs, without changing any power setting:
# the same request a video player makes. It ends by itself when the service stops. The screen may still turn
# off, and closing the laptop lid can still put it to sleep (see HANDOVER.md, "Demo setup").
param([Parameter(Mandatory = $true)][int]$ServicePid)

Add-Type -Namespace OrderService -Name Power -MemberDefinition '[DllImport("kernel32.dll")] public static extern uint SetThreadExecutionState(uint esFlags);'
$ES_CONTINUOUS_SYSTEM_REQUIRED = [uint32]2147483649  # ES_CONTINUOUS (0x80000000) | ES_SYSTEM_REQUIRED (0x1)
[void][OrderService.Power]::SetThreadExecutionState($ES_CONTINUOUS_SYSTEM_REQUIRED)
while (Get-Process -Id $ServicePid -ErrorAction SilentlyContinue) { Start-Sleep -Seconds 30 }
