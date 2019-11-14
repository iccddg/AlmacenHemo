var mongoose=require("mongoose");
var Schema=mongoose.Schema;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost/productos");

var sal_producSchemaJSON={
    producto:{type: String,required:"El producto es requerido"},
    cantidad:{type: Number, required:"La cantidad es requerida"}
};

var sal_produc_schema = new Schema(sal_producSchemaJSON);

var Sal_Produc=mongoose.model("Salida",sal_produc_schema);

module.exports.Sal_Produc = Sal_Produc;