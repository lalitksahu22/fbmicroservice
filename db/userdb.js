var User=require("../models/userModel")

exports.createUser=function(user){
    var user=new User(user);
    return user.save()
    .then((user)=>{
        return user;
    })
}
exports.authenticate=function(username,password){
    var u;
    return User.findOne({uId:username})
    .then((user)=>{
        //username not exist
        if(user==null){
            var e=new Error("userame doesn't match");
            e.statusCode=403
            throw e
        }
        u=user;
        return User.findOne({uId:username,password:password})
    })
    .then((user)=>{
        var msg,e;
        //password no match
        if(user==null){
            //wite logic to lock
            if(u.attempt<3){
                u.attempt=u.attempt+1;
                if(u.attempt==3){
                    u.aStatus="lock";
                }
                u.save();
                msg=u.aStatus=="lock"?" ACCOUNT LOCKED,Please contact admin":""
                e=new Error("Wrong password attempt:"+u.attempt+msg);
            }
            else{
                e=new Error("Account locked");
            }

           
           
            e.statusCode=403
            throw e
        }
        //authenticated
        else {
             if(u.aStatus=="pending" || u.aStatus=="lock"){
                        var e=new Error("user status is "+u.aStatus+" .Please contact admin");
                        e.statusCode=403
                        throw e
                      }
            }
        if(u.attempt!=0){
            u.attempt=0;
            u.save();
        }
        
        return user
    })
    // return User.findOne({uId:username,password:password})
    // .then((user)=>{
    //     if(user==null){
    //         var e=new Error("userame/password doesn't match");
    //         e.statusCode=403
    //         throw e
    //       }
    //       else if(user.aStatus=="pending" || user.aStatus=="lock"){
    //         var e=new Error("user status is "+user.aStatus);
    //         e.statusCode=403
    //         throw e
    //       }
    //       return user
    // })
}
exports.changeStatus=function(uid,lock){
    var statusstring=lock=="true"?"lock":"active"
    return User.updateOne({uId:uid},{aStatus:statusstring,attempt:0})
    .then((data)=>data)
}
exports.getUser=function(obj){
    return User.find(obj,{_id:0,password:0})
    .populate("friends","uId name -_id","User")
    .then((data)=>data)
}

exports.changePassword=function(uid,password){
    return User.updateOne({uId:uid},{password:password})
    .then((data)=>data)
}
exports.deleteUser=function(uid){
   return User.deleteOne({uId:uid})
   .then((res)=>{return res})
}

exports.addFriend=function(uid,frnds=[]){
    var promiseList=[];
    frnds.forEach((f)=>{
        
        var p=findUserByUid(f)
              .then((user)=>{
                if(user){
                    return user._id
                }
                else{
                    throw new Error("friend id not exist");
                }  
            });
        promiseList.push(p);
    })

    return Promise.all(promiseList)
    
    .then((frndsUid)=>{
       return User.update({uId:uid},{ $addToSet:{friends:{$each:frndsUid}}});
    })
 }

 exports.removeFriend=function(uid,frnds=[]){
    var promiseList=[];
    frnds.forEach((f)=>{
        
        var p=findUserByUid(f)
              .then((user)=>{
                if(user){
                    return user._id
                }
                else{
                    throw new Error("friend id not exist");
                }  
            });
            
        promiseList.push(p);
    })
    
    return Promise.all(promiseList)
    
    .then((frndsUid)=>{
        console.log(frndsUid)
       return User.update({uId:uid},{ $pullAll:{friends:frndsUid}});
    })
 }

 exports.getAllFriend=function(uid){

       return User.find({uId:uid},{uId:1,name:1,_id:0})
                .populate("friends","uId name -_id","User")
                .then((data)=>data)
    
 }
 exports.initialise=function(sjson){

    return User.insertMany(sjson)
             .then((data)=>data)
 
}

var findUserByUid=function(uid){

    return User.findOne({uId:uid})
             .then((data)=>{
                if(data){
                    return data
                }
                else{
                    throw new Error("user not exists");
                }
             })
 
}
exports.findUserByUid=findUserByUid;



