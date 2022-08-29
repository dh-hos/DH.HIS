const express = require('express')
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser') 
const savefile = require('./base64')
const app = express()
const port = 3000

app.use(express.json());    
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));


app.post('/files', (req, res) => {
    //data.push(req.body.base64data);
    
    savefile.DecodePDF(savefile.EncodePDF('test.pdf'), 'C:/Users/Gibiop/Desktop/demo.pdf');
})

  // fs.writeFile(path.join(__dirname,'data.txt'),req.body.base64data,(err)=>{
  //   if(err) throw err;
  //   console.log('complete');
  // })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})