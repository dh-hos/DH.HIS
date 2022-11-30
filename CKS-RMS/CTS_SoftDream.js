const express = require('express');
const app = express();
const fc = require('./Function');
app.use(express.json()); 


async function getToken(url,username, password){
        var data = JSON.stringify({
                "username":username,
                "password":password,
                "rememberMe":"false"
            });
    
        return await fc.CallAPI(url,data,'post','');
        
}

async function getPDF_CKS(url, token, pdfbase64, documentName, X, Y, width, height, pageNum, image64, pin, serial){
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

    return await fc.CallAPI(url,data,'post',token); 
}
   
async function getChuKy(url, token, serial, pin){
    var data = JSON.stringify({});
    var urlg = url+'?serial='+serial+'&pin='+pin

    return await fc.CallAPI(urlg, data, 'get', token);
   
}

module.exports = {
    getPDF_CKS, 
    getChuKy,
    getToken,

} 