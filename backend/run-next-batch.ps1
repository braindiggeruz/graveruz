param(
  [string]$ApiBase = "http://127.0.0.1:3000",
  [int]$BatchSize = 10,
  [switch]$ShowStatus
)

$ErrorActionPreference = 'Stop'

$endpoint = "$ApiBase/api/indexing/submit-next-batch?batch_size=$BatchSize"
Write-Host ">>> Calling $endpoint"

$response = Invoke-RestMethod -Method Get -Uri $endpoint
$response | ConvertTo-Json -Depth 10

if ($ShowStatus) {
  $statusEndpoint = "$ApiBase/api/indexing/batch-status?batch_size=$BatchSize"
  Write-Host ">>> Calling $statusEndpoint"
  $status = Invoke-RestMethod -Method Get -Uri $statusEndpoint
  $status | ConvertTo-Json -Depth 10
}
