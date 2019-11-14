var Producto = require("../modelos/productos").Producto;
module.exports = function(req,res,netx){
    Producto.findById(req.params.id,function(err,doc){
                    if(doc != null){
                        console.log("encontre el producto"+doc.producto);
                        res.locals.producto = doc;
                        netx();
                    }else{
                        res.redirect("/hemo")
                    }
                })
}