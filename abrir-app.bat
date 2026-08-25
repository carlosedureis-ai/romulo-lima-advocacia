@echo off
setlocal
cd /d "%~dp0"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0iniciar-app.ps1"

if errorlevel 1 (
  echo.
  echo Nao foi possivel iniciar a pagina.
  echo Consulte o arquivo README.md ou o log em work\vite-error.log.
  pause
)

endlocal
