@echo off
echo.
echo ========================================
echo   Installing C++ Build Tools
echo ========================================
echo.
echo This will install the required tools for better-sqlite3
echo.
echo Opening Visual Studio Build Tools installer...
echo.
pause

start https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools

echo.
echo ========================================
echo   WICHTIGE SCHRITTE:
echo ========================================
echo.
echo 1. Download startet automatisch
echo 2. Installer ausführen
echo 3. Wählen Sie: "Desktop development with C++"
echo 4. Installation starten (ca. 3-5 GB)
echo 5. Nach Installation: Neu starten
echo 6. Dann: START.bat erneut ausführen
echo.
echo ========================================
pause
