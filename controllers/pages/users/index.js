// index page
exports.index=(req,res)=>{
    res.render("users/index")
}

// login page
exports.login=(req,res)=>{
    res.render("users/login")
}

// register page
exports.register=(req,res)=>{
    res.render("users/register")
}