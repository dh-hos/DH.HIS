const bodyParser = require('body-parser') 

const express = require('express')
const fs = require('fs');
const path = require('path');
const internal = require('stream');
const fc = require('./functions');

const app = express();
const port = 3000;

var tk = "";

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

    // var token = await fc.getToken(url_gettoken,username,password);
    // console.log(token.id_token);
    
    //lay token
    fc.getToken(url_gettoken,username,password,function(response){
        var token = response;

        //lay chu ky
        fc.getChuKy(url_getchuky, token, serial, pin, function(response){
            var imagebase64 = response;

            //lay file ky dạng base64;
            var database64 = fc.EncodePDF(path_fileky);

            //tien hanh ky so
            fc.getPDF_CKS(url_kyso, token, database64, documentName, X, Y, width, height, pageNum, imagebase64, pin, serial, function(response){
             var data = response;
             fc.DecodePDF(data, path_luufile);
             res.send(JSON.stringify({
                success:true,
                database64:data
             }))
             console.log('complete');

           });
        })
    })
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})