const Service = require('node-windows').Service

const svc = new Service({
    name: "nodeBasicServer",
    description: "this is our description",
    script: "D:\\DataDH\\CodeNodejs\\DH.HIS\\CKS-RMS\\app.js"
})

svc.on('install', function(){
    svc.start();
})

svc.install()