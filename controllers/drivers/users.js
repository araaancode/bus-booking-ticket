const catchAsync = require('../../middlewares/catchAsync');
const AppError = require('../../middlewares/appError');

// User model
const Ticket = require('../../models/Ticket');
const User = require('../../models/User');


// # description -> HTTP VERB -> Accesss
// # get user profile -> GET -> user
exports.getMe = catchAsync(async (req, res) => {
    let user = await User.findById(req.user.id).select('-password -confirmPassword')
    if (user) {
        res.status(200).json({
            status: 'success',
            msg: 'user fetched',
            user,
        })
    } else {
        res.status(403).json({
            msg: 'can not fetch user',
        })
    }
})

// # description -> HTTP VERB -> Accesss
// # update user profile -> PUT -> user
exports.updateProfile = catchAsync(async (req, res) => {
    await User.findByIdAndUpdate(
        req.params.userId,
        {
            name: req.body.name,
            phone: req.body.phone,
        },
        { new: true }
    ).then((user) => {
        if (user) {
            res.status(200).json({
                msg: 'کاربر ویرایش شد',
                user,
            })
        }
    }).catch((error) => {
        console.log(error);
        res.status(400).json({
            msg: "user not update",
            error: error
        })
    })

})

// # description -> HTTP VERB -> Accesss
// # update user avatar -> PUT -> user
exports.updateAvatar = catchAsync(async (req, res) => {
    res.send("update avatar")
})

// # description -> HTTP VERB -> Accesss
// # send message -> POST -> user
exports.sendMessage = catchAsync(async (req, res) => {
    res.send("send message")
})

// # description -> HTTP VERB -> Accesss
// # my tickets -> GET -> user
exports.myTickets = catchAsync(async (req, res) => {
    res.send("my tickets")
})


// # description -> HTTP VERB -> Accesss
// # cancle ticket -> PUT -> user
exports.cancleTicket = catchAsync(async (req, res) => {
    res.send("cancle ticket")
})

// # description -> HTTP VERB -> Accesss
// # search ticket -> GET -> user
exports.searchTickets = catchAsync(async (req, res) => {
    res.send("search ticket")
})

// # description -> HTTP VERB -> Accesss
// # book ticket -> POST -> user
exports.bookTicket = catchAsync(async (req, res) => {
   
})