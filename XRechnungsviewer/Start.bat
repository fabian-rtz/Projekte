@echo off
title XRechnungs-Viewer
echo =========================================
echo     Starte XRechnungs-Viewer...
echo =========================================

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Fehler: Node.js ist nicht installiert!
    echo Bitte installieren Sie Node.js von: https://nodejs.org
    pause
    exit
)else (
    echo Node.js ist installiert.
)

cd /d %~dp0

start chrome http://localhost:3000

node server.js



pause
