$ErrorActionPreference = 'Stop'
$RootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$DistDir = Join-Path $RootDir 'dist'
$PackageName = if ($args.Count -gt 0) { "youtune-$($args[0])" } else { 'youtune-dev' }
$PackageDir = Join-Path $DistDir $PackageName
$ZipPath = Join-Path $DistDir "$PackageName.zip"

if (Test-Path $DistDir) { Remove-Item $DistDir -Recurse -Force }
New-Item $PackageDir -ItemType Directory -Force | Out-Null

node --check (Join-Path $RootDir 'prototype\background.js')
node --check (Join-Path $RootDir 'prototype\content.js')
node --check (Join-Path $RootDir 'prototype\popup.js')
node --check (Join-Path $RootDir 'prototype\options.js')
node (Join-Path $RootDir 'prototype\validate-extension.mjs')
node (Join-Path $RootDir 'lab\test-dsp.mjs')

Copy-Item (Join-Path $RootDir 'prototype\manifest.json') $PackageDir -Force
Copy-Item (Join-Path $RootDir 'prototype\background.js') $PackageDir -Force
Copy-Item (Join-Path $RootDir 'prototype\content.js') $PackageDir -Force
Copy-Item (Join-Path $RootDir 'prototype\popup.html') $PackageDir -Force
Copy-Item (Join-Path $RootDir 'prototype\popup.js') $PackageDir -Force
Copy-Item (Join-Path $RootDir 'prototype\presets.js') $PackageDir -Force
Copy-Item (Join-Path $RootDir 'prototype\options.html') $PackageDir -Force
Copy-Item (Join-Path $RootDir 'prototype\options.js') $PackageDir -Force
Copy-Item (Join-Path $RootDir 'prototype\icons') $PackageDir -Recurse -Force
Compress-Archive -Path (Join-Path $PackageDir '*') -DestinationPath $ZipPath -Force
Remove-Item $PackageDir -Recurse -Force
Write-Output "Built $ZipPath"
