const {Client} = require('pg');
//connect pg
function Connect_pg(host, user, port, password, database){
    client = new Client({
        host : host,
        user : user,
        port : port,
        password : password,
        database : database
    })
    client.connect();
}

function DisConnect_pg(host, user, port, password, database){
    client.end();
}

function Insert(sql){
    client.query(sql, (err,res)=>{
        if(!err){
            if(res.rowCount == 1){
                console.log('complete');
            }
        }else{
            console.log(err.message);
        }
    })
}

function Select(sql){
    client.query(sql, (err,res)=>{
        if(!err){
            console.log(res.rows);
        }else{
            console.log(err.message);
        }
    })
}

function Delete(sql){
    client.query(sql, (err,res)=>{
        if(!err){
            if(res.rowCount == 0){
                console.log(res);
            }else{
                console.log('complete');
            }
        }else{
            console.log(err.message);
        }
    })
}


function Update(sql){
    client.query(sql, (err,res)=>{
        if(!err){
            if(res.rowCount == 1){
                console.log('complete');
            }
        }else{
            console.log(err.message);
        }
    })
}


module.exports.Connect_pg = Connect_pg;
module.exports.DisConnect_pg = DisConnect_pg;
module.exports.Insert = Insert;
module.exports.Select = Select;
module.exports.Delete = Delete;
module.exports.Update = Update;