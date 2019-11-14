var socket = io();
socket.on("new producto",function(data){
    data=JSON.parse(data);

    var container = document.querySelector("#productos");

    var source=document.querySelector("#producto-template").innerHTML;

    var template = Handlebars.compile(source);

    container.innerHTML += template(data);

})