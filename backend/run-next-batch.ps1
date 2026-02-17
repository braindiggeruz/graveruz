param(
  [string]$ApiBase = "http://127.0.0.1:8001",
  [int]$BatchSize = 5,
  [int]$TimeoutSec = 60,
  [int]$CooldownOnQuotaSec = 1800,
  [string]$StateFile = ".\.batch_runner_state.json",
  [switch]$ShowStatus
)

$ErrorActionPreference = 'Stop'

function Get-State {
  if (-not (Test-Path $StateFile)) {
    return [pscustomobject]@{
      cooldownUntilUtc = $null
      lastRunUtc = $null
      lastResult = $null
    }
  }

  try {
    return (Get-Content $StateFile -Raw | ConvertFrom-Json)
  } catch {
    return [pscustomobject]@{
      cooldownUntilUtc = $null
      lastRunUtc = $null
      lastResult = "state_corrupted"
    }
  }
}

function Save-State([object]$State) {
  $State | ConvertTo-Json -Depth 8 | Set-Content -Path $StateFile -Encoding UTF8
}

$lockFile = "$StateFile.lock"
if (Test-Path $lockFile) {
  Write-Host "SKIP: previous runner instance still active (lock file found)."
  exit 0
}

Set-Content -Path $lockFile -Value "$(Get-Date -Format s)" -Encoding UTF8

try {
  $state = Get-State
  $nowUtc = [DateTime]::UtcNow

  if ($state.cooldownUntilUtc) {
    $cooldownUntil = [DateTime]::Parse($state.cooldownUntilUtc)
    if ($cooldownUntil -gt $nowUtc) {
      Write-Host ("COOLDOWN: skipping run until " + $cooldownUntil.ToString("u"))
      exit 0
    }
  }

  $endpoint = "$ApiBase/api/indexing/submit-next-batch?batch_size=$BatchSize"
  Write-Host ">>> Calling $endpoint"

  $response = Invoke-RestMethod -Method Get -Uri $endpoint -TimeoutSec $TimeoutSec

  $googleSuccess = [int]($response.google.success)
  $googleFailed = [int]($response.google.failed)
  $googleQuotaExceeded = [bool]($response.google.quotaExceeded)
  $bingStatus = $response.bing.statusCode

  $newState = [pscustomobject]@{
    cooldownUntilUtc = $null
    lastRunUtc = [DateTime]::UtcNow.ToString("o")
    lastResult = "ok"
  }

  if ($googleQuotaExceeded -or ($googleSuccess -eq 0 -and $googleFailed -gt 0)) {
    $cooldownUntil = [DateTime]::UtcNow.AddSeconds([Math]::Max(60, $CooldownOnQuotaSec))
    $newState.cooldownUntilUtc = $cooldownUntil.ToString("o")
    $newState.lastResult = "quota_or_rate_limited"
    Write-Host ("RATE_LIMIT: cooldown enabled until " + $cooldownUntil.ToString("u"))
  }

  Save-State $newState

  [pscustomobject]@{
    googleSuccess = $googleSuccess
    googleFailed = $googleFailed
    googleQuotaExceeded = $googleQuotaExceeded
    bingStatus = $bingStatus
    cycleCompleted = $response.cycleCompleted
    cursorEnd = $response.cursorEnd
    cycles = $response.cycles
  } | ConvertTo-Json -Depth 10

  if ($ShowStatus) {
    $statusEndpoint = "$ApiBase/api/indexing/batch-status?batch_size=$BatchSize"
    Write-Host ">>> Calling $statusEndpoint"
    $status = Invoke-RestMethod -Method Get -Uri $statusEndpoint -TimeoutSec $TimeoutSec
    $status | ConvertTo-Json -Depth 10
  }
}
catch {
  $errorState = [pscustomobject]@{
    cooldownUntilUtc = $null
    lastRunUtc = [DateTime]::UtcNow.ToString("o")
    lastResult = "error: $($_.Exception.Message)"
  }
  Save-State $errorState
  Write-Host ("ERROR: " + $_.Exception.Message)
  exit 1
}
finally {
  if (Test-Path $lockFile) {
    Remove-Item $lockFile -Force -ErrorAction SilentlyContinue
  }
}
