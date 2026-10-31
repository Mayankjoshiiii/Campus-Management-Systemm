@echo off
TITLE Campus Cloud - University Management System Launcher
COLOR 0B

echo =====================================================================
echo          CAMPUS CLOUD - UNIVERSITY MANAGEMENT SYSTEM (DBMS-PBL)
echo =====================================================================
echo.

set "BACKEND_DIR=%~dp0backend"
set "FRONTEND_DIR=%~dp0frontend"
if not exist "%BACKEND_DIR%" (
    set "BACKEND_DIR=%~dp0DBMS-PBL-main\backend"
    set "FRONTEND_DIR=%~dp0DBMS-PBL-main\frontend"
)

echo [1/4] Checking MySQL Service...
sc query mysql | find "RUNNING" >nul
if errorlevel 1 (
    echo Starting MySQL service...
    net start mysql >nul 2>&1
) else (
    echo MySQL service is running.
)
echo.

echo [2/4] Ensuring Database is Ready...
cd /d "%BACKEND_DIR%"
node seed_database.js >nul 2>&1
echo Database tables and sample data verified.
echo.

echo [3/4] Launching Backend Server on Port 5000...
start "Campus Cloud Backend (Port 5000)" cmd /k "cd /d \"%BACKEND_DIR%\" && npm start"
timeout /t 2 >nul
echo Backend server launched.
echo.

echo [4/4] Launching Frontend UI on Port 5173...
start "Campus Cloud Frontend (Port 5173)" cmd /k "cd /d \"%FRONTEND_DIR%\" && npm run dev"
timeout /t 3 >nul
echo Frontend dev server launched.
echo.

echo =====================================================================
echo                      PROJECT RUNNING SUCCESSFULLY!
echo =====================================================================
echo.
echo  Frontend URL: http://localhost:5173
echo  Backend API:  http://localhost:5000
echo.
echo  Default Logins (or use 1-Click Demo buttons on Login page):
echo  -------------------------------------------------------------
echo  * Admin:   admin@university.edu    / admin123
echo  * Teacher: faculty@university.edu  / faculty123
echo  * Student: student@university.edu  / student123
echo.
echo Opening browser...
start http://localhost:5173
echo.
pause
