const fs = require('fs');
const https = require('https');
const express = require('express');
const request = express.request;
const app = express();
const path = require('path');
const base64 = require('base64topdf');
const { url } = require('inspector');
app.use(express.json()); 
var token = '';


//ma hoa PDF -> base64
function EncodePDF(path){
    let encodedPdf = base64.base64Encode(path);
    return encodedPdf;
}


// base64 -> PDF
function DecodePDF(enc, path){
    let decodedBase64 = base64.base64Decode(enc, path);
}

function getToken(url,username, password,callback){
        var axios = require('axios');
        var data = JSON.stringify({
                "username":"login_demo",
                "password":"login_demo",
                "rememberMe":"false"
            });
    
        var config = {
            method: 'post',
            url: url,
            headers: { 
                'Content-Type': 'application/json'
            },
            data : data
        };
    
        axios(config)
        .then(function (response) {
            token = response.data.id_token;
            callback(token);

            //WriteFile('token.txt',token);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function getPDF_CKS(url, token, pdfbase64, documentName, X, Y, width, height, pageNum, image64, pin, serial, callback){
    var axios = require('axios');
    var data = JSON.stringify({
            "signingRequestContents": [
            {
            "data": pdfbase64,
            "documentName": documentName,
            "location": {
                "visibleX": X,
                "visibleY": Y,
                "visibleWidth": width,
                "visibleHeight": height
            },
            "extraInfo": {
                "pageNum": pageNum
            },
            "imageSignature": image64
            }
            ],
            "tokenInfo": {
                "pin": pin,
                "serial": serial
            },
            "optional": {
                "otpCode": "0101414145"
            }
});

            var config = {
            method: 'post',
            url: 'http://demosign.easyca.vn:8080/api/sign/pdf',
            headers: { 
                'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsb2dpbl9kZW1vIiwiYXV0aCI6IlJPTEVfQURNSU4sUk9MRV9TSUdOLFJPTEVfU1VQRVJfVVNFUixST0xFX1VTRVIsUk9MRV9WRVJJRlkiLCJleHAiOjE2NjU1NTk5NDZ9.ZbGmwpjkmfF6EfbuRg300Znv4A1mS5G3GSBuc7se0tvFogbMTckmK6T6V2549AZTdra9Ca9liflDMNv7YQMkpw', 
                'Content-Type': 'application/json'
            },
                data : data
            };

            axios(config)
            .then(function (response) {
                var data = response.data.data;
                callback(data);
            })
            .catch(function (error) {
                console.log(error);
            });

}
   
function getChuKy(url, token, serial, pin, callback){
    var axios = require('axios');

    var config = {
    method: 'get',
    url: url+'?serial='+serial+'&pin='+pin,
    headers: { 
        'Authorization': 'Bearer '+token,
    }
    };

    axios(config)
    .then(function (response) {
        var image64 = response.data.data;
        callback(image64);
    })
    .catch(function (error) {
        console.log(error);
    });
}

module.exports.getPDF_CKS = getPDF_CKS;

module.exports.EncodePDF = EncodePDF;

module.exports.DecodePDF = DecodePDF;

module.exports.getChuKy = getChuKy;

module.exports.getToken = getToken;