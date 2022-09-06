
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


function file(path){
    try {
        if (fs.existsSync(path)) {
            return 1;
        }else{
            return 0;
        }
    } 
    catch(err) { 
        return err;       
    }
}

function handleResults(results){
    //do something with the results
}


function getTokenEfy(path,username, password, rpCode,callback){
        var axios = require('axios');
        var data = JSON.stringify({
            "username": username,
            "password": password,
            "rpCode": rpCode
            });
    
        var config = {
            method: 'post',
            url: path,
            headers: { 
                'Content-Type': 'application/json'
            },
            data : data
        };
    
        axios(config)
        .then(function (response) {
            token = response.data.token;
            callback(token);

            //WriteFile('token.txt',token);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    //ReadFile('token.txt');
   

function WriteFile(filename, text){
    fs.writeFile(paths.join(__dirname,filename),text,(err)=>{
        if(err) throw err;
            console.log('complete');
    })
}

function ReadFile(filename){
    fs.readFile(paths.join(__dirname,filename),'utf8',(err,data)=>{
        if(err) throw err;
            console.log(data);
    })
}

module.exports.EncodePDF = EncodePDF;

module.exports.DecodePDF = DecodePDF;

module.exports.file = file;

module.exports.getTokenEfy = getTokenEfy;

