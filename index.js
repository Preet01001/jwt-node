const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

require("./dbconn");
const usersc = require("./usersc");
const jwtkey = "jwtkey";

const app = express();
app.use(cors());
app.use(express.json());

function verifyToken(req,resp,next){
    let token = req.headers['authorization'];
    if(token){
       jwt.verify(token,jwtkey,(err,valid)=>{
        if(err){
            resp.send({result:"error"})
        }else{
            next();
        }
       })
    }else{
        resp.send({result:"no token found"});
    }
}


app.get("/",verifyToken,async(req,resp)=>{
    let data = await usersc.find();
    resp.send(data);
})

app.post("/signup",async(req,resp)=>{
     let data = req.body;
     let result = await usersc.findOne({username:data.username});
     if(result){
        resp.send({sttus:"userhai"})
     }else{
        jwt.sign({data},jwtkey,{expiresIn:"2h"},(err,token)=>{
            if(err){

            }else{
                let user = new usersc(data);
                  user.save();
                 resp.send({data,auth:token})  
            }
        })
  
     }
})

app.post("/login",async(req,resp)=>{
    let data = req.body;
    let result = await usersc.findOne(data);
    if(result){
        jwt.sign({data},jwtkey,{expiresIn:"2h"},(err,token)=>{
            if(err){

            }else{
                 resp.send({data,auth:token})  
            }
        })

    }else{
        resp.send({sttus:"user nhi hai"})
    }
})


app.listen(4100,()=>{
    console.log("server started")
})