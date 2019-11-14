var Sal_Produc = require("../../modelos/salidamercancia").Sal_Produc;
var Producto = require("../../modelos/productos").Producto;

registro=function(req,res){
    Producto.find({},function(err,doc){
        if(err){
            console.log(err);
            res.redirect("HEMO/home");
            return;
        }
        console.log(doc);
        res.render("HEMO/salidas/salida_mercancia",{producto:doc});
    });
};

actuales=function(req,res){
    Sal_Produc.find({},function(err,doc){
        if(err){
            console.log(err);
            res.redirect("HEMO/home");
            return;
        }
        res.render("HEMO/salidas/salidas_actuales",{producto:doc});
    });
};

nueva=function(req,res){
    var sal_produc = new Sal_Produc({producto: req.fields.producto, cantidad: req.fields.cantidad});
        sal_produc.save().then(function(pro)
        {
            Producto.find({},function(err,doc){
                if(err){
                    console.log(err);
                    res.redirect("HEMO/home");
                    return;
                }
                console.log(doc);
                var resultado="se dio salida al producto con exito"
                res.render("HEMO/salidas/salida_mercancia",{resultado:resultado,producto:doc});
            })
        },
        function(err)
        {
            if(err){
                console.log(String(err));
                var resultado="error producto no guardado intente de nuevo"
                Producto.find({},function(err,doc){
                    if(err){
                        console.log(err);
                        res.redirect("HEMO/home");
                        return;
                    }
                    console.log(doc);
                    res.render("HEMO/salidas/salida_mercancia",{resultado:resultado,producto:doc});
                });   
            }   
        });
}
module.exports.actuales = actuales;
module.exports.nueva = nueva;
module.exports.registro = registro;

