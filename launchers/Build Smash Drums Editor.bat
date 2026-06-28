@echo off
setlocal
cd /d "%~dp0.."
set "RELEASE=%CD%\release"

echo Closing any running Smash Drums Editor / Electron...
taskkill /F /IM "Smash Drums Editor.exe" /T >nul 2>&1
taskkill /F /IM electron.exe /T >nul 2>&1
timeout /t 1 /nobreak >nul

echo Building Smash Drums Editor...
call npm run desktop:build
if errorlevel 1 (
  echo.
  echo Build failed.
  echo If you see EPERM, close Smash Drums Editor, pause OneDrive sync, then run this again.
  pause
  exit /b 1
)

if exist "%RELEASE%\Smash-Drums-Editor-0.1.0-portable.exe" (
  echo.
  echo Done:
  echo %RELEASE%\Smash-Drums-Editor-0.1.0-portable.exe
) else (
  echo.
  echo Build finished but portable EXE was not found in:
  echo %RELEASE%
)
pause