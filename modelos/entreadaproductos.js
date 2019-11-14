var mongoose=require("mongoose");
var Schema=mongoose.Schema;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost/productos");

var productoSchemaJSON={
    producto:{type: String,required:"El producto es requerido"},
    cantidad:{type: Number, required:"La cantidad es requerida"}
};

var producto_schema = new Schema(productoSchemaJSON);

var Ent_Produc=mongoose.model("entradas",producto_schema);

module.exports.Ent_Produc = Ent_Produc;