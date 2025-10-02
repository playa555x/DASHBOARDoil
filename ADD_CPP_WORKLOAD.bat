@echo off
echo.
echo ========================================
echo   C++ Workload zu Visual Studio hinzufuegen
echo ========================================
echo.
echo Visual Studio Installer wird geoeffnet...
echo.

REM Try to find VS Installer
if exist "C:\Program Files (x86)\Microsoft Visual Studio\Installer\setup.exe" (
    start "" "C:\Program Files (x86)\Microsoft Visual Studio\Installer\setup.exe"
) else if exist "C:\Program Files\Microsoft Visual Studio\Installer\setup.exe" (
    start "" "C:\Program Files\Microsoft Visual Studio\Installer\setup.exe"
) else (
    echo Visual Studio Installer nicht gefunden!
    echo Oeffne Download-Seite...
    start https://visualstudio.microsoft.com/downloads/
)

echo.
echo ========================================
echo   ANLEITUNG:
echo ========================================
echo.
echo 1. Im Visual Studio Installer:
echo    - Klicken Sie auf "Modify" (Aendern)
echo.
echo 2. Workloads Tab:
echo    - Haekchen setzen bei:
echo      [X] Desktop development with C++
echo.
echo 3. Klicken Sie auf "Modify" (rechts unten)
echo.
echo 4. Installation abwarten (ca. 2-5 GB)
echo.
echo 5. Danach dieses Fenster schliessen
echo    und START.bat ausfuehren
echo.
echo ========================================
pause
