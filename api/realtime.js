module.exports=function(server,sessionmiddleware){
    var io = require("socket.io")(server);
    var redis=require("redis");
    var client=redis.createClient();

    client.subscribe("productos");


    io.use(function(socket,next){
        sessionmiddleware(socket.request,socket.request.res,next);
    });

    client.on("message",function(channel,message){
        if(channel=="productos"){
            io.emit("new producto",message);
        }
    });

    io.sockets.on("connection",function(socket){
        console.log(socket.request.session.user_id);
    });
}