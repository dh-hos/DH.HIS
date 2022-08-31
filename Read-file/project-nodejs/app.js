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
    //luu file
    var a = savefile.file('testt.pdf');
    if(a == 1){
        
    }else{
        // gettoken
        var url = 'https://rms.efy.com.vn/clients/login';
        savefile.getTokenEfy(url,'rp_test','rp_test','RP_TEST');
        
    }
    
       
    //savefile.DecodePDF(req.body.base64data, 'C:/Users/Gibiop/Desktop/demo1.pdf');
})

  // fs.writeFile(path.join(__dirname,'data.txt'),req.body.base64data,(err)=>{
  //   if(err) throw err;
  //   console.log('complete');
  // })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})