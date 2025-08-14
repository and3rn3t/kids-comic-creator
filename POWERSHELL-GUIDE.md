# PowerShell + Copilot Optimization Guide

## Quick Reference for Kids Comic Creator Development

### 🚀 **Development Commands**

```powershell
dev         # Start Vite development server
build       # Build for production with type checking
preview     # Preview production build
tc          # TypeScript type check
lint        # Run ESLint
fix         # Run ESLint with auto-fix
clean       # Clean install dependencies
```

### 🤖 **Copilot Integration**

```powershell
c           # Open project in VS Code with Copilot
chat        # Open VS Code focused on Copilot Chat
ctx         # Copy project context to clipboard for Copilot
cf file.tsx # Open specific file in VS Code
```

### 📊 **Git Commands**

```powershell
gs          # Detailed git status with context
gl          # Git log with visual graph
gds         # Show staged changes
gctx        # Show git context for Copilot
qc feat "add new feature"  # Quick conventional commit
```

### 📁 **Project Information**

```powershell
info        # Show complete project information
tree        # Show project file structure
tasks       # Show TODO comments and tasks
```

### 🎨 **Enhanced Features**

#### **Smart Prompt**

- Shows timestamp, path, git status, and Node.js version
- Color-coded git status (🟢 clean, 🔴 changes)
- Package.json indicator

#### **Auto-completion**

- Enhanced tab completion with preview
- History-based suggestions
- Context-aware predictions

#### **Copilot Context Helper**

The `ctx` command copies comprehensive project context including:

- Project type and technologies
- Current git branch and recent commits
- Modified files
- Available npm scripts
- Recent development activity

### 💡 **Best Practices for Copilot**

1. **Use descriptive commit messages:**

   ```powershell
   qc feat "implement comic panel drag and drop"
   qc fix "resolve TypeScript errors in image upload"
   ```

2. **Copy context before asking Copilot:**

   ```powershell
   ctx  # Copies context to clipboard
   chat # Opens Copilot Chat to paste context
   ```

3. **Show project structure to Copilot:**

   ```powershell
   tree # Show file structure
   info # Show project details
   ```

### ⚡ **Keyboard Shortcuts**

- `Ctrl+R` - Reverse search command history
- `Ctrl+W` - Delete word backward
- `Ctrl+←/→` - Move by word
- `Tab` - Menu completion with preview
- `↑/↓` - Search history with current input

### 🔧 **Setup Instructions**

1. **Install the optimized profile:**

   ```powershell
   .\Setup-PowerShellProfile.ps1
   ```

2. **Reload profile:**

   ```powershell
   . $PROFILE
   ```

3. **Install missing modules (if needed):**

   ```powershell
   Install-Module posh-git, Terminal-Icons -Scope CurrentUser
   ```

### 🎯 **Typical Workflow**

```powershell
# Start development session
cd C:\git\kids-comic-creator
info        # Check project status
gs          # Check git status
dev         # Start development server

# During development
tc          # Type check after changes
lint        # Check code style
gs          # Check git status
cf src/App.tsx 25  # Open file at specific line

# Before committing
ctx         # Copy context for Copilot review
chat        # Ask Copilot to review changes
fix         # Auto-fix any linting issues
qc feat "implement new comic feature"

# Build and deploy
build       # Build for production
preview     # Test production build
```

### 🔍 **Troubleshooting**

- **Command not found**: Restart PowerShell or run `. $PROFILE`
- **Git commands fail**: Ensure you're in a git repository
- **Module errors**: Run `Install-Module <ModuleName> -Scope CurrentUser`
- **Copilot not working**: Check GitHub Copilot extension in VS Code

### 📚 **Additional Resources**

- Use `Get-Help <command>` for detailed help on any function
- Check `.vscode/settings.json` for VS Code Copilot configuration
- Review `package.json` scripts for available npm commands
