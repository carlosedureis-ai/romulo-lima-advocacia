param(
  [switch]$NoOpen
)

$ErrorActionPreference = "Stop"

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$appUrl = "http://127.0.0.1:5173/"
$workPath = Join-Path $projectPath "work"
$bundledNodePath = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$bundledPnpmPath = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd"

New-Item -ItemType Directory -Force -Path $workPath | Out-Null

$nodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
if ($nodeCommand) {
  $nodePath = $nodeCommand.Source
}
elseif (Test-Path -LiteralPath $bundledNodePath) {
  $nodePath = $bundledNodePath
}
else {
  throw "Node.js nao foi encontrado. Instale o Node.js 20 ou superior e tente novamente."
}

$pnpmCommand = Get-Command pnpm.cmd -ErrorAction SilentlyContinue
if ($pnpmCommand) {
  $pnpmPath = $pnpmCommand.Source
}
elseif (Test-Path -LiteralPath $bundledPnpmPath) {
  $pnpmPath = $bundledPnpmPath
}
else {
  throw "pnpm nao foi encontrado. Instale com npm install -g pnpm e tente novamente."
}

$nodeDirectory = Split-Path -Parent $nodePath
$env:Path = "$nodeDirectory;$env:Path"

if (-not (Test-Path -LiteralPath (Join-Path $projectPath "node_modules"))) {
  Push-Location $projectPath
  try {
    & $pnpmPath install
    if ($LASTEXITCODE -ne 0) {
      throw "A instalacao das dependencias falhou."
    }
  }
  finally {
    Pop-Location
  }
}

$serverReady = $false
try {
  $response = Invoke-WebRequest -Uri $appUrl -UseBasicParsing -TimeoutSec 1
  $serverReady = $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
}
catch {
  $serverReady = $false
}

if (-not $serverReady) {
  $stdoutLog = Join-Path $workPath "vite-output.log"
  $stderrLog = Join-Path $workPath "vite-error.log"

  Start-Process `
    -FilePath $pnpmPath `
    -ArgumentList @("dev", "--", "--host", "127.0.0.1") `
    -WorkingDirectory $projectPath `
    -WindowStyle Hidden `
    -RedirectStandardOutput $stdoutLog `
    -RedirectStandardError $stderrLog | Out-Null

  for ($attempt = 0; $attempt -lt 40; $attempt++) {
    Start-Sleep -Milliseconds 250
    try {
      $response = Invoke-WebRequest -Uri $appUrl -UseBasicParsing -TimeoutSec 1
      if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
        $serverReady = $true
        break
      }
    }
    catch {
      $serverReady = $false
    }
  }
}

if (-not $serverReady) {
  throw "O servidor local nao respondeu em $appUrl"
}

if (-not $NoOpen) {
  Start-Process $appUrl
}
