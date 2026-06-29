@echo off
setlocal
cd /d "%~dp0.."
set "RELEASE=%CD%\release"
set "UNPACKED=%RELEASE%\win-unpacked\Smash Drums Editor.exe"

for /f "delims=" %%E in ('dir /b /o-n "%RELEASE%\Smash-Drums-Editor-*-portable.exe" 2^>nul') do (
  start "" "%RELEASE%\%%E"
  exit /b 0
)
if exist "%UNPACKED%" (
  start "" "%UNPACKED%"
  exit /b 0
)

echo Smash Drums Editor EXE not found.
echo Run "Build Smash Drums Editor.bat" in the launchers folder to create it.
pause
exit /b 1