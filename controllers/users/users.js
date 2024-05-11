const catchAsync = require('../../middlewares/catchAsync');
const AppError = require('../../middlewares/appError');


// # description -> HTTP VERB -> Accesss
// # get user profile -> GET -> user
exports.getMe=catchAsync(async(req,res)=>{
    res.send("user profile")
})

// # description -> HTTP VERB -> Accesss
// # update user profile -> PUT -> user
exports.updateProfile=catchAsync(async(req,res)=>{
    res.send("update profile")
})

// # description -> HTTP VERB -> Accesss
// # update user avatar -> PUT -> user
exports.updateAvatar=catchAsync(async(req,res)=>{
    res.send("update avatar")
})

// # description -> HTTP VERB -> Accesss
// # send message -> POST -> user
exports.sendMessage=catchAsync(async(req,res)=>{
    res.send("send message")
})

// # description -> HTTP VERB -> Accesss
// # my tickets -> GET -> user
exports.myTickets=catchAsync(async(req,res)=>{
    res.send("my tickets")
})


// # description -> HTTP VERB -> Accesss
// # cancle ticket -> PUT -> user
exports.cancleTicket=catchAsync(async(req,res)=>{
    res.send("cancle ticket")
})

// # description -> HTTP VERB -> Accesss
// # search ticket -> GET -> user
exports.searchTickets=catchAsync(async(req,res)=>{
    res.send("search ticket")
})

// # description -> HTTP VERB -> Accesss
// # book ticket -> POST -> user
exports.bookTicket=catchAsync(async(req,res)=>{
    res.send("book ticket")
})