@echo off
setlocal
cd /d "%~dp0.."
set "RELEASE=%CD%\release"

for /f "delims=" %%V in ('node -p "require('./package.json').version"') do set "VERSION=%%V"
set "EXE=%RELEASE%\Smash-Drums-Editor-%VERSION%-portable.exe"
set "UNPACKED=%RELEASE%\win-unpacked\Smash Drums Editor.exe"

if exist "%EXE%" (
  start "" "%EXE%"
  exit /b 0
)
if exist "%UNPACKED%" (
  start "" "%UNPACKED%"
  exit /b 0
)

echo Smash Drums Editor v%VERSION% not found.
echo Expected: %EXE%
echo.
echo Run "Build Smash Drums Editor.bat" in the launchers folder to create it.
pause
exit /b 1