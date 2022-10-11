const bodyParser = require('body-parser') 

const express = require('express')
const fs = require('fs');
const path = require('path');
const internal = require('stream');
const fc = require('./functions');

const app = express();
const port = 3000;

var token = "";

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(express.json());  


app.post('/kyso', async (req, res) => {
    var username = req.body.username;
    var password = req.body.username;
    var serial = req.body.serial;
    var pin = req.body.pin;
    var url_gettoken = 'http://demosign.easyca.vn:8080/api/authenticate';
    var url_getchuky = 'http://demosign.easyca.vn:8080/api/certificate/getImage';
    var url_kyso = 'http://demosign.easyca.vn:8080/api/sign/pdf';

    var documentName = req.body.documentName;
    var X = req.body.toadoX;// ngang
    var Y = req.body.toadoY;// độ cao
    var width = req.body.width;
    var height = req.body.height;
    var pageNum = req.body.pageNum;
    var path_fileky = req.body.path_fileky;
    var path_luufile = req.body.path_luufile;

    token = await fc.getToken(url_gettoken,username,password);
    var image64 = await fc.getChuKy(url_getchuky, token.id_token, serial, pin);

    var database64 = fc.EncodePDF(path_fileky);

    var database64_filedaky = await fc.getPDF_CKS(url_kyso, token.id_token, database64, documentName, X, Y, width, height, pageNum, image64.data, pin, serial);
    
    fc.DecodePDF(database64_filedaky.data, path_luufile);
    res.send(JSON.stringify({
       success:true,
       database64:database64_filedaky.data
    }))
    console.log('complete');      
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})