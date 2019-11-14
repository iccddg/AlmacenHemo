var mongoose=require("mongoose");
var Schema=mongoose.Schema;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost/productos");

var productoSchemaJSON={
    producto:{type: String,required:"El producto es requerido"},
    fondofijo:{type: Number, required:"El fondo fijo es requerido"}
};

var producto_schema = new Schema(productoSchemaJSON);

var Producto=mongoose.model("productos",producto_schema);

module.exports.Producto = Producto;