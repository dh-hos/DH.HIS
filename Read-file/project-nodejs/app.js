const bodyParser = require('body-parser') 

const express = require('express')
const fs = require('fs');
const path = require('path');
const internal = require('stream');

const savefile = require('./base64')
const app = express()
const port = 3000

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(express.json());  


app.post('/files', (req, res) => {
    //kiem tra file
    var a = savefile.file('testt.pdf');

    // neu file da ton tai
    if(a == 1){
      console.log(savefile.EncodePDF('test.pdf'));
    }
    //neu file chua ton tai
    else if(a == 0){
        // get token
        var url = 'https://rms.efy.com.vn/clients/login';
        var agreementUUID = '5fce09a2-2b84-4f48-83ac-fdb8bac023c3';
        var authorizeCode = '221105';
        savefile.getTokenEfy(url,'rp_test','rp_test','RP_TEST',function(response){
          var token = response;
          //lay base64 file ky so
          var database64 = savefile.EncodePDF('test.pdf');
          savefile.getPDF_CKS(token, database64,agreementUUID,authorizeCode,function(response){
            var signedFileData = response;
            savefile.DecodePDF(signedFileData, 'C:/Users/Gibiop/Desktop/demo12daky.pdf');
            console.log('complete');

          });
        })
        

    }else{
        console.log('Error: ' + savefile.file('test.pdf'));
    }
    //savefile.DecodePDF(req.body.base64data, 'C:/Users/Gibiop/Desktop/demo12.pdf');
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})