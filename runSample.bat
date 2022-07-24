@echo off
setlocal
cd /D %~dp0

start "" "http://127.0.0.1:1376/freeRTOSMain.html"
start "" CommonWebSvr.exe appSample.txt

appTest.exe appSample.txt
