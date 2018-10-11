var mongoose=require('mongoose')
var Schema=mongoose.Schema;


var userSchema = new Schema({
  uId:  {type:String,unique:true,required:true},
  password: {type:String,required:true},
  name:   {type:String,required:true},
  friends: [{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
  date: { type: Date, default: Date.now },
  role:{type:String,default:"user"},
  aStatus:{type:String,default:"pending"},//pending,active,lock
  attempt:{type:Number,default:0}
});
let User=mongoose.model('User',userSchema) ;
module.exports=User;