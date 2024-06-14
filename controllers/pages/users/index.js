// index page
exports.index=(req,res)=>{
    res.render("users/index",{title:"صفحه اصلی"})
}

// login page
exports.login=(req,res)=>{
    res.render("users/login",{title:"ورود"})
}

// register page
exports.register=(req,res)=>{
    res.render("users/register",{title:"ثبت نام"})
}

// profile page
exports.profile=(req,res)=>{
    res.render("users/profile",{title:"حساب کاربری"})
}