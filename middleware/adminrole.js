const jwt = require('jsonwebtoken')

const adminRole = (roles) => {
return(req,res,next) => {

    if(!roles.includes(req.userdata.role)){
        req.flash('error','Unathorised user please login')
        res.redirect('/')
    }
    next();
}

}
module.exports = adminRole