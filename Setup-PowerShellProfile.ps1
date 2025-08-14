# PowerShell Profile Setup Script for Kids Comic Creator
# This script backs up your current profile and installs the optimized version

Write-Host "🔧 Setting up optimized PowerShell profile for Kids Comic Creator..." -ForegroundColor Cyan

# Check if current profile exists and back it up
if (Test-Path $PROFILE) {
    $backupPath = "$PROFILE.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item $PROFILE $backupPath
    Write-Host "✅ Current profile backed up to: $backupPath" -ForegroundColor Green
}

# Ensure profile directory exists
$profileDir = Split-Path $PROFILE -Parent
if (!(Test-Path $profileDir)) {
    New-Item -Type Directory -Path $profileDir -Force | Out-Null
    Write-Host "✅ Profile directory created: $profileDir" -ForegroundColor Green
}

# Copy the optimized profile
$optimizedProfile = "PowerShell_Profile_KidsComicCreator.ps1"
if (Test-Path $optimizedProfile) {
    Copy-Item $optimizedProfile $PROFILE -Force
    Write-Host "✅ Optimized profile installed to: $PROFILE" -ForegroundColor Green
} else {
    Write-Host "❌ Optimized profile not found: $optimizedProfile" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Profile setup complete!" -ForegroundColor Green
Write-Host "💡 Restart PowerShell or run '. `$PROFILE' to reload" -ForegroundColor Yellow
Write-Host ""
Write-Host "New features include:" -ForegroundColor Cyan
Write-Host "  • Enhanced Copilot integration" -ForegroundColor Gray
Write-Host "  • Project-specific shortcuts" -ForegroundColor Gray
Write-Host "  • Better Git visualization" -ForegroundColor Gray
Write-Host "  • Context copying for Copilot Chat" -ForegroundColor Gray
Write-Host "  • Optimized React/TypeScript workflow" -ForegroundColor Gray
