const { Service } = require('node-windows');


var service = require('node-windows').Service;


// Create a new service object
var svc = new Service({
    name:"NLSTimeChange",
    description: "Used to change the time on the machine",
    script: "C:\\Time Change App\\TimeChangeApp\\test.js",
});


// Listen for the "install" event so we know when it's done.
svc.on('install',function(){
    svc.start();
    console.log('Install complete.');
    console.log('The service exists: ', svc.exists);
});


// install the service.
svc.install();