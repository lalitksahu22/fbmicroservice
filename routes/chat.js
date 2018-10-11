var express=require('express');
var router=express.Router();
var chatdb=require("../db/chatdb")

router.get("/getChat",(req,res,next)=>{
    chatdb.getChat(uid)
})
router.post("/addChat",(req,res,next)=>{

    var p1=chatdb.addChat({uid:req.body.sender,msg:req.body.msg,other:req.body.receiver},true);
    var p2=chatdb.addChat({uid:req.body.receiver,msg:req.body.msg,other:req.body.sender},false)
     Promise.all([p2,p1])
    .then((data)=>{
        if(data==null){
            throw new Error("Not able to update user")
          }
          else {
            res.send({success:"chat updated successfully"})
          }
               
    })
    .catch((err)=>{
        next(err)
    })
})
module.exports=router;
