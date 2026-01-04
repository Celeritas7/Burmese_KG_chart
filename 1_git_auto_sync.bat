@echo off
cd /d "%~dp0"

if not exist ".git" (
  echo ERROR: Not a git repository
  pause
  exit /b
)

git add -A

git diff --cached --quiet
if errorlevel 1 (
  git commit -m "Auto sync: update files"
  git push origin main
) else (
  echo No changes to commit.
)

pause