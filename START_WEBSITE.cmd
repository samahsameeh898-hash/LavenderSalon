@echo off
title Lavender Women's Salon - Website
cd /d "%~dp0"

echo.
echo ==========================================
echo    LAVENDER WOMEN'S SALON
echo    Starting local website...
echo ==========================================
echo.

where node >nul 2>nul
if %errorlevel%==0 (
    start "" http://localhost:8000
    node server.js
    goto :end
)

where py >nul 2>nul
if %errorlevel%==0 (
    start "" http://localhost:8000
    py -m http.server 8000
    goto :end
)

where python >nul 2>nul
if %errorlevel%==0 (
    start "" http://localhost:8000
    python -m http.server 8000
    goto :end
)

echo Neither Node.js nor Python was found.
echo Opening index.html directly in your default browser...
start "" "%~dp0index.html"

:end
