# ================================================================
# PowerShell 7 Profile for Kids Comic Creator + GitHub Copilot
# Location: $PROFILE (PowerShell 7)
# Optimized for React/TypeScript/Vite/Tailwind development
# ================================================================

# === PowerShell 7 Performance Optimizations ===
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$PSStyle.OutputRendering = 'ANSI'
$PSStyle.Progress.View = 'Minimal'

# === Enhanced PSReadLine with Copilot-friendly features ===
Import-Module PSReadLine
Set-PSReadLineOption -PredictionSource HistoryAndPlugin
Set-PSReadLineOption -PredictionViewStyle ListView
Set-PSReadLineOption -EditMode Windows
Set-PSReadLineOption -BellStyle None
Set-PSReadLineOption -HistorySearchCursorMovesToEnd
Set-PSReadLineOption -ShowToolTips

# === Copilot-optimized colors for better code context ===
Set-PSReadLineOption -Colors @{
    Command            = 'Cyan'
    Parameter          = 'Gray'
    Operator           = 'DarkGray'
    Variable           = 'Green'
    String             = 'Yellow'
    Number             = 'Red'
    Type               = 'DarkCyan'
    Comment            = 'DarkGreen'
    Keyword            = 'Blue'
    Member             = 'DarkCyan'
    Emphasis           = 'Magenta'
    Error              = 'Red'
    Selection          = 'DarkGray'
    InlinePrediction   = 'DarkGray'
    ListPrediction     = 'Yellow'
    ListPredictionSelected = 'DarkBlue'
}

# === Advanced Keyboard Shortcuts ===
Set-PSReadLineKeyHandler -Key Tab -Function MenuComplete
Set-PSReadLineKeyHandler -Key 'Ctrl+d' -Function DeleteChar
Set-PSReadLineKeyHandler -Key 'Ctrl+w' -Function BackwardDeleteWord
Set-PSReadLineKeyHandler -Key 'Ctrl+LeftArrow' -Function BackwardWord
Set-PSReadLineKeyHandler -Key 'Ctrl+RightArrow' -Function ForwardWord
Set-PSReadLineKeyHandler -Key UpArrow -Function HistorySearchBackward
Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward
Set-PSReadLineKeyHandler -Key 'Ctrl+r' -Function ReverseSearchHistory
Set-PSReadLineKeyHandler -Key 'Ctrl+s' -Function ForwardSearchHistory

# === VS Code + GitHub Copilot Integration ===
function Open-VSCode {
    <#
    .SYNOPSIS
    Opens current directory in VS Code with optimized Copilot settings
    .DESCRIPTION
    Launches VS Code with GitHub Copilot enabled and development extensions loaded
    #>
    code . --enable-extension github.copilot --enable-extension github.copilot-chat
}
Set-Alias -Name c -Value Open-VSCode

function Open-File-VSCode {
    <#
    .SYNOPSIS
    Opens specific file in VS Code at a specific line for Copilot context
    #>
    param(
        [Parameter(Mandatory)]
        [string]$File,
        [int]$Line = 1
    )
    if (Test-Path $File) {
        code --goto "$($File):$($Line):1"
    } else {
        Write-Host "❌ File not found: $File" -ForegroundColor Red
    }
}
Set-Alias -Name cf -Value Open-File-VSCode

function Open-Workspace {
    <#
    .SYNOPSIS
    Opens VS Code workspace with all project extensions
    #>
    $workspace = Get-ChildItem "*.code-workspace" | Select-Object -First 1
    if ($workspace) {
        code $workspace.Name
    } else {
        code .
    }
}
Set-Alias -Name cw -Value Open-Workspace

# === Enhanced Git Integration for Copilot Context ===
function Git-Status-Detailed {
    <#
    .SYNOPSIS
    Shows detailed git status with context for Copilot
    #>
    Write-Host "📊 Git Repository Status" -ForegroundColor Cyan
    git status --short --branch --ahead-behind
    Write-Host ""
    $stash = git stash list --oneline 2>$null
    if ($stash) {
        Write-Host "💾 Stashes:" -ForegroundColor Yellow
        $stash | ForEach-Object { Write-Host "   $_" }
    }
}
Set-Alias -Name gs -Value Git-Status-Detailed

function Git-Log-Graph {
    <#
    .SYNOPSIS
    Shows git log with visual graph for better understanding
    #>
    git log --oneline --graph --decorate --all --max-count=15
}
Set-Alias -Name gl -Value Git-Log-Graph

function Git-Diff-Staged {
    <#
    .SYNOPSIS
    Shows staged changes for commit review
    #>
    git diff --cached --stat
    Write-Host ""
    git diff --cached
}
Set-Alias -Name gds -Value Git-Diff-Staged

function Git-Quick-Commit {
    <#
    .SYNOPSIS
    Quick commit with conventional commit format
    #>
    param(
        [Parameter(Mandatory)]
        [ValidateSet('feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore')]
        [string]$Type,
        [Parameter(Mandatory)]
        [string]$Message
    )
    git add .
    git commit -m "${Type}: ${Message}"
}
Set-Alias -Name qc -Value Git-Quick-Commit

# === React/TypeScript/Vite Development Shortcuts ===
function Start-Dev {
    <#
    .SYNOPSIS
    Starts the Vite development server with optimizations
    #>
    Write-Host "🚀 Starting Kids Comic Creator development server..." -ForegroundColor Green
    npm run dev
}
Set-Alias -Name dev -Value Start-Dev

function Build-Project {
    <#
    .SYNOPSIS
    Builds the project with type checking and optimization
    #>
    Write-Host "🔨 Building Kids Comic Creator for production..." -ForegroundColor Blue
    npm run build:check
}
Set-Alias -Name build -Value Build-Project

function Preview-Build {
    <#
    .SYNOPSIS
    Previews the production build locally
    #>
    Write-Host "👀 Previewing production build..." -ForegroundColor Magenta
    npm run preview
}
Set-Alias -Name preview -Value Preview-Build

function Type-Check {
    <#
    .SYNOPSIS
    Runs TypeScript type checking
    #>
    Write-Host "🔍 Running TypeScript type check..." -ForegroundColor Cyan
    npm run type-check
}
Set-Alias -Name tc -Value Type-Check

function Lint-Code {
    <#
    .SYNOPSIS
    Runs ESLint on the codebase
    #>
    Write-Host "📋 Running ESLint..." -ForegroundColor Yellow
    npm run lint
}
Set-Alias -Name lint -Value Lint-Code

function Fix-Lint {
    <#
    .SYNOPSIS
    Runs ESLint with auto-fix
    #>
    Write-Host "🔧 Running ESLint with auto-fix..." -ForegroundColor Green
    npm run lint:fix
}
Set-Alias -Name fix -Value Fix-Lint

function Clean-Install {
    <#
    .SYNOPSIS
    Clean install of dependencies
    #>
    Write-Host "🧹 Cleaning and reinstalling dependencies..." -ForegroundColor Red
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Remove-Item package-lock.json -ErrorAction SilentlyContinue
    npm install
}
Set-Alias -Name clean -Value Clean-Install

# === Copilot-Friendly Project Context Functions ===
function Show-Project-Info {
    <#
    .SYNOPSIS
    Shows comprehensive project information for Copilot context
    #>
    Write-Host "🎨 Kids Comic Creator - React/TypeScript Project" -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor DarkGray
    
    if (Test-Path "package.json") {
        $pkg = Get-Content "package.json" | ConvertFrom-Json
        Write-Host "📦 Package: $($pkg.name) v$($pkg.version)" -ForegroundColor Green
        
        Write-Host "🛠️  Available Scripts:" -ForegroundColor Yellow
        $pkg.scripts.PSObject.Properties | ForEach-Object {
            Write-Host "   $($_.Name): $($_.Value)" -ForegroundColor White
        }
        
        Write-Host "📚 Key Dependencies:" -ForegroundColor Blue
        @('react', 'typescript', 'vite', 'tailwindcss', '@radix-ui/react-dialog') | ForEach-Object {
            if ($pkg.dependencies.$_) {
                Write-Host "   ${_}: $($pkg.dependencies.$_)" -ForegroundColor Gray
            }
        }
    }
    Write-Host ""
}
Set-Alias -Name info -Value Show-Project-Info

function Show-File-Structure {
    <#
    .SYNOPSIS
    Shows project structure optimized for Copilot understanding
    #>
    Write-Host "📁 Kids Comic Creator Structure" -ForegroundColor Cyan
    if (Get-Command tree -ErrorAction SilentlyContinue) {
        tree /F /A src | Select-Object -First 20
    } else {
        Get-ChildItem -Recurse src | Where-Object { !$_.PSIsContainer } | 
        Select-Object -First 20 | ForEach-Object { 
            $relativePath = $_.FullName.Replace($PWD.Path, "").TrimStart('\')
            Write-Host "   $relativePath" -ForegroundColor Gray
        }
    }
}
Set-Alias -Name tree -Value Show-File-Structure

function Show-Current-Tasks {
    <#
    .SYNOPSIS
    Shows TODO comments and current development tasks
    #>
    Write-Host "📋 Current Development Tasks" -ForegroundColor Cyan
    
    # Check for TODO comments in source files
    $todos = Get-ChildItem -Recurse src -Include "*.tsx", "*.ts", "*.js", "*.jsx" | 
             Select-String -Pattern "TODO|FIXME|HACK|NOTE" | 
             Select-Object -First 10
    
    if ($todos) {
        Write-Host "🔍 Found TODOs in code:" -ForegroundColor Yellow
        $todos | ForEach-Object {
            $file = Split-Path $_.Filename -Leaf
            Write-Host "   ${file}:$($_.LineNumber): $($_.Line.Trim())" -ForegroundColor Gray
        }
    }
    
    # Check for README or TODO files
    @('TODO.md', 'TASKS.md', 'README.md') | ForEach-Object {
        if (Test-Path $_) {
            Write-Host "📄 ${_}:" -ForegroundColor Green
            Get-Content $_ | Select-Object -First 5 | ForEach-Object {
                Write-Host "   $_" -ForegroundColor Gray
            }
        }
    }
}
Set-Alias -Name tasks -Value Show-Current-Tasks

function Show-Git-Context {
    <#
    .SYNOPSIS
    Shows git context helpful for Copilot
    #>
    try {
        $branch = git rev-parse --abbrev-ref HEAD 2>$null
        $lastCommit = git log -1 --pretty=format:"%h %s" 2>$null
        $modified = git diff --name-only 2>$null
        
        Write-Host "🌿 Git Context" -ForegroundColor Cyan
        Write-Host "Branch: $branch" -ForegroundColor Green
        Write-Host "Last commit: $lastCommit" -ForegroundColor Gray
        
        if ($modified) {
            Write-Host "Modified files:" -ForegroundColor Yellow
            $modified | ForEach-Object { Write-Host "   $_" -ForegroundColor Red }
        }
    }
    catch {
        Write-Host "Not a git repository" -ForegroundColor Red
    }
}
Set-Alias -Name gctx -Value Show-Git-Context

# === Enhanced Prompt with Development Context ===
function prompt {
    $currentPath = $PWD.Path
    $shortPath = if ($currentPath.Length -gt 50) {
        "..." + $currentPath.Substring($currentPath.Length - 47)
    } else {
        $currentPath
    }

    # Git status
    $gitInfo = ""
    try {
        $branch = git rev-parse --abbrev-ref HEAD 2>$null
        if ($branch) {
            $status = git status --porcelain 2>$null
            $statusIcon = if ($status) { "🔴" } else { "🟢" }
            $gitInfo = " [$statusIcon $branch]"
        }
    } catch { }

    # Node.js version
    $nodeInfo = ""
    if (Get-Command node -ErrorAction SilentlyContinue) {
        $nodeInfo = " [node:$(node --version)]"
    }

    # Package.json script indicator
    $scriptInfo = ""
    if (Test-Path "package.json") {
        $scriptInfo = " [📦]"
    }

    $timeStamp = Get-Date -Format "HH:mm:ss"

    Write-Host "┌─[" -NoNewline -ForegroundColor DarkGray
    Write-Host $timeStamp -NoNewline -ForegroundColor DarkCyan
    Write-Host "]─[" -NoNewline -ForegroundColor DarkGray
    Write-Host $shortPath -NoNewline -ForegroundColor Cyan
    Write-Host "]" -NoNewline -ForegroundColor DarkGray
    Write-Host $gitInfo -NoNewline -ForegroundColor Yellow
    Write-Host $nodeInfo -NoNewline -ForegroundColor DarkGreen
    Write-Host $scriptInfo -ForegroundColor Magenta
    Write-Host "└─❯ " -NoNewline -ForegroundColor DarkGray
    return " "
}

# === Module Loading with Error Handling ===
$modules = @('posh-git', 'Terminal-Icons')
foreach ($module in $modules) {
    try {
        if (Get-Module -ListAvailable -Name $module) {
            Import-Module $module -ErrorAction SilentlyContinue
            Write-Host "✅ $module loaded" -ForegroundColor DarkGreen
        }
    }
    catch {
        Write-Host "⚠️  Failed to load $module" -ForegroundColor DarkYellow
    }
}

# === Copilot Integration Helpers ===
function Copy-Context {
    <#
    .SYNOPSIS
    Copies project context to clipboard for Copilot Chat
    #>
    $context = @"
Kids Comic Creator Project Context:
- React 19 + TypeScript
- Vite build tool
- Tailwind CSS + shadcn/ui components
- Current directory: $(Get-Location)
- Git branch: $(git rev-parse --abbrev-ref HEAD 2>$null)
- Modified files: $(git diff --name-only 2>$null | Join-String -Separator ', ')

Recent commits:
$(git log --oneline -5 2>$null)

Package.json scripts:
$(if (Test-Path 'package.json') { (Get-Content 'package.json' | ConvertFrom-Json).scripts | Out-String })
"@
    
    $context | Set-Clipboard
    Write-Host "📋 Project context copied to clipboard for Copilot Chat!" -ForegroundColor Green
}
Set-Alias -Name ctx -Value Copy-Context

function Open-Copilot-Chat {
    <#
    .SYNOPSIS
    Opens VS Code with focus on Copilot Chat
    #>
    code . --command "workbench.panel.chat.view.copilot.focus"
}
Set-Alias -Name chat -Value Open-Copilot-Chat

# === Welcome Message ===
Clear-Host
Write-Host "🎨 Kids Comic Creator - Development Environment Ready!" -ForegroundColor Green
Write-Host "🤖 GitHub Copilot optimized PowerShell profile loaded" -ForegroundColor Cyan
Write-Host ""
Write-Host "Quick Commands:" -ForegroundColor Yellow
Write-Host "  dev    - Start development server" -ForegroundColor Gray
Write-Host "  build  - Build for production" -ForegroundColor Gray
Write-Host "  tc     - TypeScript type check" -ForegroundColor Gray
Write-Host "  lint   - Run ESLint" -ForegroundColor Gray
Write-Host "  c      - Open in VS Code" -ForegroundColor Gray
Write-Host "  gs     - Git status" -ForegroundColor Gray
Write-Host "  info   - Project information" -ForegroundColor Gray
Write-Host "  ctx    - Copy context for Copilot" -ForegroundColor Gray
Write-Host "  chat   - Open Copilot Chat" -ForegroundColor Gray
Write-Host ""

# Show current project context on startup
if (Test-Path "package.json") {
    Show-Project-Info
}
