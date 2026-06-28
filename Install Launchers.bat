@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\create-shortcuts.ps1"
if errorlevel 1 (
  echo Failed to create icon shortcuts.
  pause
  exit /b 1
)
echo.
echo Done. Use the .lnk shortcuts in this folder — they have the Smash Drums Editor icon.
echo Batch files are in the launchers\ folder.
echo If the icon still looks wrong, press F5 in this folder or sign out and back in.
pause