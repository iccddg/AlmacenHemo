var Ent_Produc = require("../../modelos/entreadaproductos").Ent_Produc;
var Producto = require("../../modelos/productos").Producto;

registro=function(req,res){
    Producto.find({},function(err,doc){
        if(err){
            console.log(err);
            res.redirect("HEMO/home");
            return;
        }
        console.log(doc);
        res.render("HEMO/entradas/ingreso_mercancia",{producto:doc});
    })
};

actuales=function(req,res){
    Ent_Produc.find({},function(err,doc){
        if(err){
            console.log(err);
            res.redirect("HEMO/home");
            return;
        }
        res.render("HEMO/entradas/entradas_actuales",{producto:doc});
    });
};

nueva=function(req,res){
    var ent_produc = new Ent_Produc({producto: req.fields.producto, cantidad: req.fields.cantidad});
        ent_produc.save().then(function(pro)
        {
            Producto.find({},function(err,doc){
                if(err){
                    console.log(err);
                    res.redirect("HEMO/home");
                    return;
                }
                console.log(doc);
                var resultado="se ingreso el producto con exito"
                res.render("HEMO/entradas/ingreso_mercancia",{resultado:resultado,producto:doc});
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
                res.render("HEMO/entradas/ingreso_mercancia",{resultado:resultado,producto:doc});   
                });
            }   
        });
}
module.exports.actuales = actuales;
module.exports.nueva = nueva;
module.exports.registro = registro;

