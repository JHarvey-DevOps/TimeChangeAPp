@echo off
set "NODEJS=nodejs"
set "npm_path=C:\Users\NLSUser\AppData\Roaming\npm"
set "node_path=C:\Program Files\nodejs"
set "SERVICE_PATH=C:\Time Change App\TimeChangeApp\"

echo Installing Node.js...
winget install %NODEJS%
timeout 10

echo Checking if NPM is already in PATH...
set "path_exists="
for %%I in ("%path:;=" "%") do if /i "%%~I" == "%npm_path%" set "path_exists=1"
if defined path_exists (
    echo NPM is already in PATH.
) else (
    echo Adding NPM to PATH...
    setx /M path "%path%;%npm_path%"
    echo NPM added to PATH.
)
timeout 10

echo Checking if Node.js is already in PATH...
set "path_exists="
for %%I in ("%path:;=" "%") do if /i "%%~I" == "%node_path%" set "path_exists=1"
if defined path_exists (
    echo Node.js is already in PATH.
) else (
    echo Adding Node.js to PATH...
    setx /M path "%path%;%node_path%"
    echo Node.js added to PATH.
)
timeout 10

echo Installing packages...
cd "%~dp0"
call npm install
call npm link date
echo All packages installed successfully.
timeout 10

echo Installing TimeChangeApp service...
powershell.exe -Command "Set-Location '%SERVICE_PATH%'; node service.js"
echo Done.
pause
