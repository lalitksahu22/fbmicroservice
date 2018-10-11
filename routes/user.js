var express = require('express');
var router = express.Router();
var userdb=require('../db/userdb')

/* GET home page. */
router.post('/createUser', function(req, res, next) {
  userdb.createUser(req.body)
  .then((data)=>{
    res.send({success:"User added successfully"})
  })
  .catch((err)=>{next(err);})
});

router.post('/authenticate', function(req, res, next) {
  userdb.authenticate(req.body.uid,req.body.password)
  .then((data)=>{
    res.send({success:"true",role:data.role})
  })
  .catch((err)=>{next(err);})
});

router.get('/getUser', function(req, res, next) {
  var temp={};
  skipnull(temp,"uId",req.query.uid);
  skipnull(temp,"name",req.query.name);
  skipnull(temp,"aStatus",req.query.status);
  console.log(temp)
  userdb.getUser(temp)
  .then((data)=>{
    res.send(data)
  })
  .catch((err)=>{next(err);})
});

router.put('/changeStatus/:uid', function(req, res, next) {
  userdb.changeStatus(req.params.uid,req.query.lock)
  .then((data)=>{
    res.send({success:"true"})
  })
  .catch((err)=>{next(err);})
});

router.put('/changePassword', function(req, res, next) {
  userdb.changePassword(req.body.uid,req.body.password)
  .then((data)=>{
    if(data.ok==1 && data.nModified>0){
      result={success:"user password updated successfuly"}
    }
    else  if(data.ok==1 && data.nModified==0){
      result={success:"user not exist or password is same"}
    }
    else{
      throw new Error("Not able to update user")
    }
    res.send(result)
  })
  .catch((err)=>{next(err);})
});

router.delete('/deleteUser/:uid', function(req, res, next) {
  var result;
  userdb.deleteUser(req.params.uid)
  .then((data)=>{
    if(data.ok==1 && data.n>0){
      result={success:"user deleted successfuly"}
    }
    else  if(data.ok==1 && data.n==0){
      result={success:"user not exist"}
    }
    else{
      throw new Error("Not able to delete user")
    }
    res.send(result)
  })
  .catch((err)=>{next(err);})
});

router.put('/addFriend/:uid', function(req, res, next) {
  var result;
  userdb.addFriend(req.params.uid,req.body.friend)
  .then((data)=>{

    if(data.ok==1 && data.nModified>0){
      result={success:"user friendlist updated successfuly"}
    }
    else  if(data.ok==1 && data.nModified==0){
      result={success:"user not exist or friend already added"}
    }
    else{
      throw new Error("Not able to update user")
    }
    res.send(result)
  })
  .catch((err)=>{next(err);})
});

router.put('/removeFriend/:uid', function(req, res, next) {
  var result;
  userdb.removeFriend(req.params.uid,req.body.friend)
  .then((data)=>{
    
    if(data.ok==1 && data.nModified>0){
      result={success:"user friendlist deleted successfuly"}
    }
    else  if(data.ok==1 && data.nModified==0){
      result={success:"user not exist or friend already deleted"}
    }
    else{
      throw new Error("Not able to delete user's friend")
    }
    res.send(result)
  })
  .catch((err)=>{next(err);})
});
router.get("/getAllfriend",(req,res,next)=>{
  userdb.getAllFriend(req.query.uid)
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>{next(err);})
})

router.post("/initialise",(req,res,next)=>{
  var sjson=[
    {
        "role" : "admin",
        "aStatus" : "active",
        "uId" : "admin",
        "password" : "123",
        "name" : "admin"
    }
 ,
    {
        
        
        "uId" : "lalitksahu22",
        "password" : "123",
        "name" : "lalit",
    }
  ,
    {
        
        "uId" : "pankajksahu10",
        "password" : "123",
        "name" : "pankaj"
    }
,
    {
       
        "uId" : "mnshankar",
        "password" : "123",
        "name" : "mani"
    }]
    userdb.initialise(sjson)
    .then((data)=>res.send(data))
    .catch(err=>next(err))
})

var skipnull=function(obj,key,value){
  if(value){
    var pattern=".*"+value+".*";
    obj[key]={$regex:pattern,$options:"i"}
  }
  return obj
}

module.exports = router;
