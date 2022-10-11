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


app.post('/gettoken', async (req, res) => {
    var username = 'login_demo';
    var password = 'login_demo';

    var serial = '540110006cc1e2d9565001ad4462187b';
    var pin = '123456789';
    var url_gettoken = 'http://demosign.easyca.vn:8080/api/authenticate';
    var url_getchuky = 'http://demosign.easyca.vn:8080/api/certificate/getImage';
    var url_kyso = 'http://demosign.easyca.vn:8080/api/sign/pdf';

    var documentName = 'fileky.pdf';
    var X = 190;// ngang
    var Y = 55;// độ cao
    var width = 166;
    var height = 98;
    var pageNum = 1;

    var token = await fc.getToken(url_gettoken,username,password);
    console.log(token);
    //console.log(token.id_token);
   
    
    //lay token
    // fc.getToken(url_gettoken,username,password,function(response){
    //     var token = response;

    //     //lay chu ky
    //     fc.getChuKy(url_getchuky, token, serial, pin, function(response){
    //         var imagebase64 = response;

    //         //lay file ky dạng base64;
    //         var database64 = fc.EncodePDF('fileky.pdf');

    //         //tien hanh ky so
    //         fc.getPDF_CKS(url_kyso, token, database64, documentName, X, Y, width, height, pageNum, imagebase64, pin, serial, function(response){
    //          var data = response;
    //          fc.DecodePDF(data, 'C:/Users/Gibiop/Desktop/filedaky_demo.pdf');
    //          console.log('complete');

    //        });
    //     })
    // })
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})