@echo off
echo.
echo ========================================
echo   NCNDA IP-Tracking System
echo ========================================
echo.

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [1/2] Installing dependencies...
    call npm install
    echo.
) else (
    echo [✓] Dependencies already installed
    echo.
)

echo [2/2] Starting server...
echo.
echo ========================================
echo   Server running!
echo ========================================
echo.
echo   Admin Panel: http://localhost:3000/admin.html
echo   API Health:  http://localhost:3000/api/health
echo.
echo   Login: admin / admin123
echo.
echo   Press Ctrl+C to stop
echo.
echo ========================================
echo.

call npm start
