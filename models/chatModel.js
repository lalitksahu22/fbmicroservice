var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var chatSchema=new Schema({
    u_id:{type:mongoose.SchemaTypes.ObjectId,ref:"User",required:true,unique:true},
    chat:[{msg:String,other:{type:mongoose.SchemaTypes.ObjectId,ref:"User"},self:{type:Boolean,default:true},date:{type:Date,default:Date.now}}]
})

var Chat=mongoose.model("Chat",chatSchema);
module.exports=Chat;