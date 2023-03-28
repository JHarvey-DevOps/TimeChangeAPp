const { exec } = require('child_process');
exec('function Set-Time( [DateTime]$Time){set-date -adjust $Time}', {'shell':'powershell.exe'}, (error, stdout, stderr)=> {
    // do whatever with stdout
})