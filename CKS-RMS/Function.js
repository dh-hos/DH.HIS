const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.json()); 
const pdf = require('pdf-page-counter');
var axios = require('axios');


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

async function CallAPI(url, data, method,token){
      
    var config = {
        method: method,
        url: url,
        headers: { 
            'Authorization': 'Bearer '+token, 
            'Content-Type': 'application/json'
        },
            data : data
        };
      
    return axios(config).then(res=>res.data);
}

  module.exports = {
    getNumpagePDF,
    createNewFile,
    readFile,
    CallAPI

} 