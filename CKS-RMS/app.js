const bodyParser = require('body-parser') 

const express = require('express')
const fs = require('fs');
const path = require('path');
const internal = require('stream');
const fc = require('./functions');



const app = express();
const port = 3000;

var token = "";

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(express.json());  


app.post('/kyso/softdream', async (req, res) => {
  var url_gettoken = 'http://demosign.easyca.vn:8080/api/authenticate';
  var url_getchuky = 'http://demosign.easyca.vn:8080/api/certificate/getImage';
  var url_kyso = 'http://demosign.easyca.vn:8080/api/sign/pdf';

    var username = req.body.username;
    var filename = "./users/"+username+".txt";

    try {
      if (fs.existsSync(filename)) {
          var users = await fc.readFile(filename);
          var password = users.password;
          var serial = users.serial;
          var pin = users.pin;

          var documentName = req.body.documentName;
          var size = await fc.readFile('./size/size.txt');
          var X = size.toadoX;// ngang
          var Y = size.toadoY;// độ cao
          var width = size.width;
          var height = size.height;
    
          var filebase64 = req.body.filebase64;

          var pageNum = await fc.getNumpagePDF(filebase64);
          token = await fc.getToken_softdream(url_gettoken,username,password);
          var image64 = await fc.getChuKy_softdream(url_getchuky, token.id_token, serial, pin);
          var database64_filedaky = await fc.getPDF_CKS_softdream(url_kyso, token.id_token, filebase64, documentName, X, Y, width, height, pageNum, image64.data, pin, serial);
          
          res.send(JSON.stringify({
            success:true,
            database64:database64_filedaky.data
          }))
          console.log('complete'); 
          res.end();

      }else{
        
          res.send(JSON.stringify({
            success:false,
            text:'tài khoản '+username+' chưa được tạo'
          }))
          res.end();
      }
    } catch(err) {
  
    }
   

   
   
      
})


app.post('/kyso/viettel', async(req, res) => {
    var url_gettoken = "https://remotesigning.viettel.vn/adss/service/ras/v1/login";
    var url_getCredentials_list = "https://remotesigning.viettel.vn/adss/service/ras/csc/v1/credentials/list";
    var url_getCredentials_info = "https://remotesigning.viettel.vn/adss/service/ras/csc/v1/credentials/info";
    var url_getSAD = "https://remotesigning.viettel.vn/adss/service/ras/csc/v1/credentials/authorize";
    var url_sighhash = "https://remotesigning.viettel.vn/adss/service/ras/csc/v1/signatures/signHash";

    var client_id = req.body.client_id;
    var user_id = req.body.user_id;
    var client_secret = req.body.client_secret;
    var profile_id = req.body.profile_id;
    var pageNum = req.body.pageNum;
    var documentName = req.body.documentName;
    var documentId = req.body.documentId;
    var database64 = req.body.filebase64;

    token = await fc.getToken_viettel(url_gettoken, client_id, user_id, client_secret, profile_id);
    
    var credentialIDs = await fc.getCredentials_list_viettel(url_getCredentials_list, token, user_id);
    
    var cert = await fc.getCredentials_info_viettel(url_getCredentials_info, token, credentialIDs[0]);

    var SAD = await fc.getSAD_viettel(url_getSAD, token, credentialIDs[0], pageNum, documentName, documentId, database64)

    var signhash = await fc.getSighHast_viettel(url_sighhash, token, credentialIDs[0], SAD, documentName, documentId, database64);

    res.send(JSON.stringify({
      success:true,
      database64:signhash[0],
      credentialID:credentialIDs,
      cert:cert
    }))
    console.log('complete');   
})


app.get('/demo', async(req, res) => {
  res.send(JSON.stringify({
    success:true,
    text:'hello'
 }))
 console.log('complete');    
})

// tạo file chưa thông tin user
app.post('/create_user', async(req, res) => {
  var user = req.body.username;
  var password = req.body.password;
  var serial = req.body.serial;
  var pin = req.body.pin;

  var filename = "./users/"+user+".txt";
  let obj = {
         username:user,
         password:password,
         serial:serial,
         pin:pin
  }

  try {
    if (fs.existsSync(filename)) {
      res.send(JSON.stringify({
        success:false,
        text:'tệp '+user+'.txt'+' đã tồn tại'
      }))
      res.end(); 

    }else{
      fc.createNewFile(obj,filename);
      res.send(JSON.stringify({
        success:true,
        text:'tệp '+user+'.txt'+' đã tạo thành công'
      }))
      res.end();
    }
  } catch(err) {

  }

  
  //fc.readFile(filename);
 //var users = await fc.readFile(filename);
  

})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})