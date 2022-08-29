const { response } = require('express');
const pdf2base64 = require('pdf-to-base64');
const base64 = require('base64topdf');

function EncodePDF(path){
    let encodedPdf = base64.base64Encode(path);
    return encodedPdf;
}

function DecodePDF(enc, path){
    let decodedBase64 = base64.base64Decode(enc, path);
}


module.exports.EncodePDF = EncodePDF;

module.exports.DecodePDF = DecodePDF;