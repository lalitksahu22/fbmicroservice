var userlist=['bot','room']
module.exports=function(server){
    var io=require('socket.io')(server);
    console.log("socket initialise")
    io.on("connection",(socket)=>{

        userlist.push(socket.id);
        
        socket.join("room",()=>{
            socket.to("room").emit('sMessage','room',"hello frnds chai pee lo")
        })

        io.emit('welcome',"a new user is online",userlist);

        socket.on('disconnect',(msg)=>{
            let i=userlist.indexOf(socket.id);
            userlist.splice(i,1);
            io.emit("exit","a user diconnected:",userlist)
        })

        socket.on('cMessage',(rcv,msg)=>{
            if(rcv==="bot"){
                socket.emit("sMessage",'bot',"messagefromchatbot:Echo: "+msg)
            }
            socket.to(rcv).emit("sMessage",socket.id,msg)
        })
    })     
}