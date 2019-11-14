var mongoose=require("mongoose");
var Schema=mongoose.Schema;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost/productos");

var validador_contraseña_igual = {
        validator: function(contra){
            return this.password_confirmation == contra;
        },
        message: "Las contraseñas no son iguales"
}

var validar_correo = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"coloca un email valido"];

var user_schema = new Schema({
    usuario: {
        type: String,
        required: true, 
        minlength: [3,"El usuario requiere minimo tres caracteres"],
        maxlength: [25,"El usuario debe ser de 25 caracteres maximo "]
    },
    contraseña: {
        type: String,
        required: true,
        minlength: [5,"La contraseña requiere minimo cinco caracteres"],
        validate: validador_contraseña_igual
    },
    correo: {
        type: String,
        required: "El correo es obligatorio",
        match: validar_correo
    }
});

user_schema.virtual("password_confirmation").get(function(){
    return this.p_c;
}).set(function(contraseña){
    this.p_c=contraseña;
});

var User=mongoose.model("User",user_schema);

module.exports.User = User;