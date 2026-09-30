@echo off
REM ============================================================================
REM  COM30 · Entorno de la sala · Node.js, npm y Angular CLI en esta ventana
REM ----------------------------------------------------------------------------
REM  En los equipos de la sala Node.js está instalado, pero su carpeta no está
REM  en la variable PATH. Este archivo la agrega SOLO a la ventana de cmd donde
REM  se ejecuta: no modifica la configuración de Windows y no pide administrador.
REM
REM  Uso, desde una ventana de cmd abierta en la carpeta del proyecto:
REM      entorno-sala.cmd
REM  Cada ventana nueva de cmd lo necesita otra vez. La terminal de VS Code no:
REM  la configura .vscode/settings.json.
REM
REM  Si Node.js está en otra carpeta, cambie la línea NODEDIR. Para buscarlo:
REM      where /r "C:\Program Files" node.exe
REM ============================================================================

set "NODEDIR=C:\Program Files\nodejs"

if not exist "%NODEDIR%\node.exe" (
  echo No se encontro node.exe en "%NODEDIR%".
  echo Busquelo con:  where /r "C:\Program Files" node.exe
  echo y corrija la linea NODEDIR de este archivo.
  exit /b 1
)

REM Node primero; luego la carpeta donde npm instala los comandos globales (ng).
set "PATH=%NODEDIR%;%APPDATA%\npm;%PATH%"

echo.
echo Entorno listo en esta ventana:
echo   node  :
node -v
echo   npm   :
call npm -v
echo   git   :
git --version
echo.
echo Siguiente paso dentro del proyecto:  npm install   y luego   npx ng serve
