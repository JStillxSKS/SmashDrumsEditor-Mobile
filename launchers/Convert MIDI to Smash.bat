@echo off
setlocal EnableExtensions
title MIDI to Smash Drums Converter

set "SCRIPT_DIR=%~dp0"
set "REPO=%SCRIPT_DIR%.."
set "PY_SCRIPT=%REPO%\scripts\midi_to_smash.py"
set "REQ=%REPO%\scripts\requirements-midi-convert.txt"
set "OUT=%USERPROFILE%\Desktop\Smash Drums Editor\output"

where python >nul 2>&1
if errorlevel 1 (
  echo Python is not on PATH. Install Python 3 from https://www.python.org/downloads/
  echo Make sure "Add python.exe to PATH" is checked.
  pause
  exit /b 1
)

if not exist "%PY_SCRIPT%" (
  echo Converter not found:
  echo   %PY_SCRIPT%
  pause
  exit /b 1
)

REM Ensure deps once (quiet if already installed)
python -c "import mido,numpy,soundfile,PIL" >nul 2>&1
if errorlevel 1 (
  echo Installing converter dependencies...
  python -m pip install -r "%REQ%"
  if errorlevel 1 (
    echo Failed to install dependencies.
    pause
    exit /b 1
  )
)

if "%~1"=="" (
  echo.
  echo  MIDI to Smash Drums Converter
  echo  =============================
  echo.
  echo  Drag and drop one or more .mid files onto this bat,
  echo  or run from a terminal:
  echo.
  echo    Convert MIDI to Smash.bat path\to\drums.mid
  echo    Convert MIDI to Smash.bat drums.mid --audio song.ogg
  echo    Convert MIDI to Smash.bat drums.mid --artist "Band" --title "Song"
  echo.
  echo  Output folder:
  echo    %OUT%
  echo.
  echo  Options:
  set /p MIDI_PATH=MIDI file path: 
  if "%MIDI_PATH%"=="" (
    echo Cancelled.
    pause
    exit /b 0
  )
  python "%PY_SCRIPT%" "%MIDI_PATH%" --out "%OUT%" --open
) else (
  python "%PY_SCRIPT%" %* --out "%OUT%" --open
)

echo.
pause
endlocal
