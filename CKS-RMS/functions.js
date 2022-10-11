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

async function getToken(url,username, password){
        var axios = require('axios');
        var data = JSON.stringify({
                "username":username,
                "password":password,
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
    
        return axios(config).then(res=>res.data);
        
}

async function getPDF_CKS(url, token, pdfbase64, documentName, X, Y, width, height, pageNum, image64, pin, serial){
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
            url: url,
            headers: { 
                'Authorization': 'Bearer '+token, 
                'Content-Type': 'application/json'
            },
                data : data
            };

        return axios(config).then(res=>res.data);
       

}
   
async function getChuKy(url, token, serial, pin){
    var axios = require('axios');
    var data = JSON.stringify({});

    var config = {
    method: 'get',
    url: url+'?serial='+serial+'&pin='+pin,
    headers: { 
        'Authorization': 'Bearer '+token,
    },
    data : data
    };

    return axios(config).then(res=>res.data);
   
}

module.exports.getPDF_CKS = getPDF_CKS;

module.exports.EncodePDF = EncodePDF;

module.exports.DecodePDF = DecodePDF;

module.exports.getChuKy = getChuKy;

module.exports.getToken = getToken;