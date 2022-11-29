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
var axios = require('axios');
const pdf = require('pdf-page-counter');
const { json } = require('express');


//-----------------------------Softdream-----------------------------------//
//ma hoa PDF -> base64
function EncodePDF(path){
    let encodedPdf = base64.base64Encode(path);
    return encodedPdf;
}

// base64 -> PDF
function DecodePDF(enc, path){
    let decodedBase64 = base64.base64Decode(enc, path);
}


async function getToken_softdream(url,username, password){
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

async function getPDF_CKS_softdream(url, token, pdfbase64, documentName, X, Y, width, height, pageNum, image64, pin, serial){
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
   
async function getChuKy_softdream(url, token, serial, pin){
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


//-------------------------------------Viettel-------------------------------------//

async function getToken_viettel(url, client_id, user_id, client_secret, profile_id){

    var data = JSON.stringify({
        "client_id": client_id,
        "user_id": user_id,
        "client_secret": client_secret,
        "profile_id": profile_id
      });
      
      var config = {
        method: 'post',
        url: 'https://remotesigning.viettel.vn/adss/service/ras/v1/login',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      return axios(config).then(res=>res.data.access_token);
}

async function getCredentials_list_viettel(url, token, user_id){
    var data = JSON.stringify({
        "userID": user_id
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
      
      return axios(config).then(res=>res.data.credentialIDs);
}

async function getCredentials_info_viettel(url, token, credentialID){
    var data = JSON.stringify({
        "credentialID": credentialID,
        "certificates": "chain",
        "certInfo": true,
        "authInfo": true
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
      
      return axios(config).then(res=>res.data.cert);
      
}

async function getSAD_viettel(url, token, credentialID, pageNum, documentName, docummentId, database64){
    var data = JSON.stringify({
        "credentialID": credentialID,
        "numSignatures": pageNum,
        "documents": [
          {
            "document_id": docummentId,
            "document_name": documentName
          }
        ],
        "hash": [
          database64
        ]
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
      
      return axios(config).then(res=>res.data.SAD);
      
}

async function getSighHast_viettel(url, token, credentialID, SAD, documentName, documentId, database64){
    var data = JSON.stringify({
        "credentialID": credentialID,
        "SAD": SAD,
        "documents": [
          {
            "document_id": documentId,
            "document_name": documentName
          }
        ],
        "hash": [
          database64
        ],
        "hashAlgo": "2.16.840.1.101.3.4.2.1",
        "signAlgo": "1.2.840.113549.1.1.1"
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
      
      return axios(config).then(res=>res.data.signatures);
    
}

async function getNumpagePDF(filebase64){
  let dataBuffer = new Buffer.from(filebase64, 'base64');
     return (await pdf(dataBuffer)).numpages;
}

async function createNewFile(obj,filename){
  const fd = fs.openSync(filename,'w');

  const jsonString = JSON.stringify(obj);
  fs.writeFile(filename, jsonString, 'utf-8', (err, data) => {
    if(err) throw err;
  })

}

async function readFile(filename) {
  const fsPromises = require('fs').promises;
  const data = await fsPromises.readFile(filename)
                     .catch((err) => console.error('Failed to read file', err));

  return JSON.parse(data.toString());
}


module.exports.getPDF_CKS_softdream  = getPDF_CKS_softdream;

module.exports.EncodePDF = EncodePDF;

module.exports.DecodePDF = DecodePDF;

module.exports.getChuKy_softdream  = getChuKy_softdream;

module.exports.getToken_softdream  = getToken_softdream;

module.exports.getToken_viettel = getToken_viettel;

module.exports.getCredentials_list_viettel = getCredentials_list_viettel;

module.exports.getCredentials_info_viettel = getCredentials_info_viettel;

module.exports.getSAD_viettel = getSAD_viettel;

module.exports.getSighHast_viettel = getSighHast_viettel;

module.exports.getNumpagePDF = getNumpagePDF;

module.exports.createNewFile = createNewFile;

module.exports.readFile = readFile;