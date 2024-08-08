// index page
exports.index = (req, res) => {
    res.render("admins/index", { title: "صفحه اصلی" })
}

// login page
exports.login = (req, res) => {
    res.render("admins/login", { title: "ورود" })
}

// register page
exports.register = (req, res) => {
    res.render("admins/register", { title: "ثبت نام" })
}

// profile page
exports.profile = (req, res) => {
    res.render("admins/profile", { title: "حساب کاربری" })
}


