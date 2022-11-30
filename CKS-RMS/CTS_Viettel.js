const fs = require('fs');
const fc = require('./Function.js');
const express = require('express');
const app = express();
app.use(express.json()); 

async function getToken(url, client_id, user_id, client_secret, profile_id){

    var data = JSON.stringify({
        "client_id": client_id,
        "user_id": user_id,
        "client_secret": client_secret,
        "profile_id": profile_id
    });
      
    return await fc.CallAPI(url,data,'post','');
}

async function getCredentials_list(url, token, user_id){
    var data = JSON.stringify({
        "userID": user_id
      });
      
    return await fc.CallAPI(url,data,'post',token);
}

async function getCredentials_info(url, token, credentialID){
    var data = JSON.stringify({
        "credentialID": credentialID,
        "certificates": "chain",
        "certInfo": true,
        "authInfo": true
      });
      
    return await fc.CallAPI(url,data,'post',token);
      
}

async function getSAD(url, token, credentialID, pageNum, documentName, docummentId, database64){
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
      
    return await fc.CallAPI(url,data,'post',token);
      
}

async function getSighHast(url, token, credentialID, SAD, documentName, documentId, database64){
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
      
    return await fc.CallAPI(url,data,'post',token);
    
}   

module.exports = {
    getToken,
    getCredentials_list,
    getCredentials_info,
    getSAD,
    getSighHast
} 