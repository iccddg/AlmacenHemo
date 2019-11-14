var express=require("express");
var fs= require("fs");
var User=require("../modelos/usuarios").User;
var session=require("express-session");
var router_app=require("./rutas");
var session_middleware=require("../middlewares/session");
var methodOverride = require("method-override");
var formidable = require("express-formidable");
var RedisStore = require("connect-redis")(session);
var http = require("http");
var realtime = require("./realtime");


var sessionMiddleware = session({
    store: new RedisStore({}),
    secret: "5a4df51f3sa5dfs135asd1f",
    resave:false,
    saveUninitialized:false
});


var app = express();


app.set('view engine', 'pug');


app.use(sessionMiddleware);
app.use("/recursos",express.static('public'));
app.use(methodOverride("_method"));
app.use(formidable({ keepExtensions: true,uploadDir:"temp" }));
app.use("/HEMO",session_middleware);
app.use("/HEMO",router_app);

var server = http.Server(app);


realtime(server,sessionMiddleware);


/**Ruta principal del sitio**/
app.get("/",function(req,res)
{
    console.log(req.session.user_id);
    res.render("index");
});


/**Ruta para cerrar cesion **/
app.post("/",function(req,res)
{
    req.session.destroy(function(err) {
        if(err){console.log(err)};
        console.log("sesion destruida")
        res.redirect("/");
    })
})


/**Ruta para desplegar el formulario que registra un nuevo usuario**/
app.get("/Registro",function(req,res)
{
    res.render("registro");
});


/**Ruta para registrar al usuario con los datos del formulario de registro**/
app.post("/Registro_confirmado",function(req,res)
{
    var user = new User({usuario: req.fields.usuario, 
                        contraseña: req.fields.contraseña,
                        password_confirmation: req.fields.confirmacion_contraseña,
                        correo: req.fields.correo});
    console.log(user.password_confirmation);
    user.save().then(function(us)
    {
        res.render("index",{estado:"Usuario Registrado"});  
    },
    function(err)
    {
        if(err){
            console.log(String(err));
            res.send("Usuario no registrado");   
        }
    });    
});


/*ruta para cargar el formulario de inicio de secion */
app.get("/Login",function(req,res)
{
    res.render("login");
});


/*Ruta para validar el inicio de secion, si es valido se va a /home sino se va a index */
app.post("/Login_confirmado",function(req,res)
{
    User.findOne({usuario:req.fields.usuario,contraseña:req.fields.contraseña},function(err,doc){
        if(err){        
            console.log(String(err));
        }
        if(doc!=null){
            console.log(String(doc._id));
            req.session.user_id=doc._id;
            res.redirect("/hemo");
        }else{
            res.render("index",{estado:"Usuario o contraseña equivocado"});
        }
        res.end();
        })    
});

server.listen(3000);