var ChatModel=require('../models/chatModel');
var userdb=require("../db/userdb");

exports.addChat=function(value,sFlag){

    var uid=userdb.findUserByUid(value.uid);

    var other=userdb.findUserByUid(value.other);
    var ridarray;
    return Promise.all([uid,other])
            .then((user)=>([user[0]._id,user[1]._id]))
            .then((rid)=>{
                ridarray=rid;
                //return ChatModel.update({receiver_id:rid[0]},{$push:{chat:{msg:value.msg,sender:rid[1]}}});
                return ChatModel.findOne({ u_id:rid[0]})
                        
            })
            .then((c)=>{
                if(c!=null){
                    c.chat.push({msg:value.msg,other:ridarray[1]})
                   return c.save();
                }else{
                    var a={ u_id:ridarray[0],chat:[{msg:value.msg,other:ridarray[1],self:sFlag}]}
                    console.log(JSON.stringify(a))
                    c=new ChatModel({ u_id:ridarray[0],chat:[{msg:value.msg,other:ridarray[1],self:sFlag}]})
                    return c.save()
                }
            })
   
}

exports.getChat=function(query){
    return ChatModel.update(query);
}