var User=require("../modelos/usuarios").User;
module.exports = function(req,res,next){
    if(!req.session.user_id){
        res.redirect("/Login");
    }
    else
    {
        User.findById(req.session.user_id,function(err,doc){
            if(err){
                console.log(err);
                res.redirect("/Login");
            }else{
                res.locals = {user: doc};
                next(); 
            }   
        });
        
    }
}