var express = require("express");
var Producto = require("../modelos/productos").Producto;
var encontrar_producto = require("../middlewares/productos");
var router = express.Router();
var fs = require("fs");
var redis=require("redis");
var entradas=require("./entradas/entradas");
var salidas=require("./salidas/salidas");


var client=redis.createClient();


/* *******Ruta para direcciones que pasan por el middleware quedando en /HEMO/ ************** */
/* ******* solo accesible para usuarios logeados ************** */
router.get("/",function(req,res)
{
    res.render("HEMO/home");
});

/********************************************************************************* */
/* *******Ruta para desplegar el formulario para registrar productos************** */
router.get("/registro_producto",function(req,res)
{
    res.render("HEMO/productos/registro_producto");
})

/* *******Ruta para el CRUD del registro de productos (crear, mostrar)************** */
router.route("/productos")
/* *******Ruta para desplegar los productos actuales************** */
    .get(function(req,res){
        Producto.find({},function(err,doc){
            if(err){
                console.log(err);
                res.redirect("HEMO/home");
                return;
            }
            res.render("HEMO/productos/productos_actuales",{producto:doc});
        });    
    })


/* *******Ruta para registrar los prodcutctos capturados en el formulario************** */
    .post(function(req,res){
        var producto = new Producto({producto: req.fields.producto, fondofijo: req.fields.fondofijo});
        producto.save().then(function(pro)
        {
            var produJSON={
                "id":producto._id,
                "producto":producto.producto,
                "fondofijo":producto.fondofijo
            };
            client.publish("productos",JSON.stringify(produJSON));
            var resultado="se ingreso el producto con exito"
            res.render("HEMO/productos/registro_producto",{resultado:resultado});
        },
        function(err)
        {
            if(err){
            console.log(String(err));
            var resultado="error producto no guardado intente de nuevo"
            res.render("HEMO/registro_producto",{resultado:resultado});   
            }   
        });
    })

/** aplicamos el middleware para encontrar el producto en las rutas /home/imagen/:id **/
router.all("/productos/:id*",encontrar_producto);

/* *******Ruta para desplegar formulario de editar producto************** */
router.get("/productos/:id/edit",function(req,res){
    res.render("HEMO/productos/edit");
})

/* ********funciones para productos individuales******* */
router.route("/productos/:id")
    .get(function(req,res){
        res.render("hemo/productos/show");
    })
    .put(function(req,res){
        res.locals.producto.producto = req.fields.producto
        res.locals.producto.fondofijo = req.fields.fondofijo
        res.locals.producto.save(function(err){
            if(!err){
                res.render("HEMO/productos/show");
            }else{
                res.render("HEMO/productos/"+req.params.id+"edit"); 
            }
        })
    })
    .delete(function(req,res){
        Producto.findOneAndRemove({_id:req.params.id},function(err,doc){
            if(!err){
                console.log("se borro el producto "+doc.producto);
                res.redirect("/HEMO/productos/");
            }else{
                console.log(err);
                res.render("HEMO/productos/"+req.params.id); 
            }
        })
    })

/******************************************************************************************* */    
/* *******Ruta para desplegar el formulario para ingresar mercancia al almacen************** */
router.get("/Ingreso_Mercancia",function(req,res)
{
    entradas.registro(req,res);
})
/* *******Ruta para el CRUD del ingreso de mercancia a almacen (crear, mostrar)************** */
router.route("/ingreso_almacen")
/* *******Ruta para desplegar la entradas acuales a almacen ************** */
    .get(function(req,res){
        entradas.actuales(req,res);    
    })
/* *******Ruta para ingresar la mercancia capturada en el formulario a almacen************** */
    .post(function(req,res){
        entradas.nueva(req,res);
    })

/************************************************************************************ */
    /* *******Ruta para desplegar el formulario para sacar mercancia************** */
router.get("/Salida_Mercancia",function(req,res)
{
    salidas.registro(req,res);
})
/* *******Ruta para el CRUD de las salidas del almacen (crear, mostrar)************** */
router.route("/salida_almacen")
/* *******Ruta para desplegar las salidas de almacen actuales************** */
    .get(function(req,res){
        salidas.actuales(req,res);
    })
/* *******Ruta para ingresar la mercancia capturada en el formulario a Salidas_almacen************** */
    .post(function(req,res){
        salidas.nueva(req,res);
    })


module.exports = router;