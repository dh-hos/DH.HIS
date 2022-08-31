const { response } = require('express');
const fs = require('fs');
const pdf2base64 = require('pdf-to-base64');


function EncodePDF(path){
    let encodedPdf = base64.base64Encode(path);
    return encodedPdf;
}

function DecodePDF(enc, path){
    let decodedBase64 = base64.base64Decode(enc, path);
}


function file(path){
    try {
        if (fs.existsSync(path)) {
            return 1;
        }else{
            return 0;
        }
    } 
    catch(err) {
            
    }
}


function getTokenEfy(path,username, password, rpCode){
    var request = require('request');
    var options = {
        'method': 'POST',
        'url': path,
        'headers': {
            'Content-Type': 'application/json'
    },
        body: JSON.stringify({
            "username": username,
            "password": password,
            "rpCode": rpCode
        })
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });
}




module.exports.EncodePDF = EncodePDF;

module.exports.DecodePDF = DecodePDF;

module.exports.file = file;

module.exports.getTokenEfy = getTokenEfy;