const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const fc = require('./Function.js');
const fcs = require('./CTS_SoftDream');
const fcv = require('./CTS_Viettel');
const url = require('./url.js')

const app = express();
const port = 3000;

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(express.json());  


app.post('/kyso/softdream', async (req, res) => {

    var username = req.body.username;
    var filebase64 = req.body.filebase64;
    var filename = "./users/"+username+".txt";

    //mã hóa filebase64 -> sha256
    var crypto = require('crypto');
    const hash = crypto.createHash('SHA256').update(filebase64).digest('hex');
    var file256 = "./file/"+hash+".txt";
 
    try{
      if(fs.existsSync(file256)){
        var database64 = await fc.readFile(file256);
        
        res.send(JSON.stringify({
          success:true,
          database64:database64.database64
        }))

        console.log('complete'); 
        res.end();
      }else{
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
                var pageNum = await fc.getNumpagePDF(filebase64);
                var token = await fcs.getToken(url.gettoken_sd ,username,password);
                var image64 = await fcs.getChuKy(url.getchuky_sd, token.id_token, serial, pin);
                var database64_filedaky = await fcs.getPDF_CKS(url.kyso_sd, token.id_token, filebase64, documentName, X, Y, width, height, pageNum, image64.data, pin, serial);
                
                //creat file 
                let obj = {
                      database64:database64_filedaky.data
                }
                fc.createNewFile(obj,file256);

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
          console.log(err);
        }
      }
    }catch(err){
        console.log(err)
    }     
})


app.post('/kyso/viettel', async(req, res) => {

    var client_id = req.body.client_id;
    var user_id = req.body.user_id;
    var client_secret = req.body.client_secret;
    var profile_id = req.body.profile_id;
    var pageNum = req.body.pageNum;
    var documentName = req.body.documentName;
    var documentId = req.body.documentId;
    var database64 = req.body.filebase64;

    var token = await fcv.getToken(url.gettoken_vt, client_id, user_id, client_secret, profile_id);
   
    var credentialIDs = await fcv.getCredentials_list(url.getCredentials_list_vt, token.access_token, user_id);
    
    var cert = await fcv.getCredentials_info(url.getCredentials_info_vt, token.access_token, credentialIDs.credentialIDs[0]);

    var SAD = await fcv.getSAD(url.getSAD_vt, token.access_token, credentialIDs.credentialIDs[0], pageNum, documentName, documentId, database64)

    var signhash = await fcv.getSighHast(url.sighhash_vt, token.access_token, credentialIDs.credentialIDs[0], SAD.SAD, documentName, documentId, database64);

    res.send(JSON.stringify({
      success:true,
      database64:signhash.signatures[0],
      credentialID:credentialIDs.credentialIDs,
      cert:cert.cert
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