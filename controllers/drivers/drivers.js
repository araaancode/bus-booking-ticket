const catchAsync = require('../../middlewares/catchAsync');
const AppError = require('../../middlewares/appError');

// Driver model
const Driver = require('../../models/Driver');


// # description -> HTTP VERB -> Accesss
// # get Driver profile -> GET -> Driver
exports.getMe = catchAsync(async (req, res) => {
    let driver = await Driver.findById(req.driver.id).select('-password -confirmPassword')
    if (driver) {
        res.status(200).json({
            status: 'success',
            msg: 'driver fetched',
            driver,
        })
    } else {
        res.status(403).json({
            msg: 'can not fetch Driver',
        })
    }
})

// # description -> HTTP VERB -> Accesss
// # see driver bus -> GET -> Driver
exports.seeBus=catchAsync(async(req,res)=>{
    res.send('see bus')
})

// # description -> HTTP VERB -> Accesss
// # driver travels -> GET -> Driver
exports.myTravels=catchAsync(async(req,res)=>{
    res.send('my travels')
})

// # description -> HTTP VERB -> Accesss
// # update bus -> PUT -> Driver
exports.updateBus=catchAsync(async(req,res)=>{
    res.send('update bus')
})

// # description -> HTTP VERB -> Accesss
// # update bus cover -> PUT -> Driver
exports.updateBusCover=catchAsync(async(req,res)=>{
    res.send('update bus cover')
})

// # description -> HTTP VERB -> Accesss
// # update bus images -> PUT -> Driver
exports.updateBusImages=catchAsync(async(req,res)=>{
    res.send('update bus images')
})

// # description -> HTTP VERB -> Accesss
// # get driver passengers -> GET -> Driver
exports.getDriverPassengers=catchAsync(async(req,res)=>{
    res.send('get driver passengers')
})

// # description -> HTTP VERB -> Accesss
// # cancel travel -> PUT -> Driver
exports.cancelTravel=catchAsync(async(req,res)=>{
    res.send('cancel travel')
})

// # description -> HTTP VERB -> Accesss
// # get income -> GET -> Driver
exports.getIncome=catchAsync(async(req,res)=>{
    res.send('get income')
})


// # description -> HTTP VERB -> Accesss
// # get reservations -> POST -> Driver
exports.getReservation=catchAsync(async(req,res)=>{
    res.send('get reservations')
})



// # description -> HTTP VERB -> Accesss
// # update Driver profile -> PUT -> Driver
exports.updateProfile = catchAsync(async (req, res) => {
    await Driver.findByIdAndUpdate(
        req.params.DriverId,
        {
            name: req.body.name,
            phone: req.body.phone,
        },
        { new: true }
    ).then((Driver) => {
        if (Driver) {
            res.status(200).json({
                msg: 'کاربر ویرایش شد',
                Driver,
            })
        }
    }).catch((error) => {
        console.log(error);
        res.status(400).json({
            msg: "Driver not update",
            error: error
        })
    })

})

// # description -> HTTP VERB -> Accesss
// # update Driver avatar -> PUT -> Driver
exports.updateAvatar = catchAsync(async (req, res) => {
    res.send("update avatar")
})

// # description -> HTTP VERB -> Accesss
// # send message -> POST -> Driver
exports.sendMessage = catchAsync(async (req, res) => {
    res.send("send message")
})

// # description -> HTTP VERB -> Accesss
// # my tickets -> GET -> Driver
exports.myTickets = catchAsync(async (req, res) => {
    res.send("my tickets")
})


// # description -> HTTP VERB -> Accesss
// # cancel ticket -> PUT -> Driver
exports.cancelTicket = catchAsync(async (req, res) => {
    res.send("cancel ticket")
})

// # description -> HTTP VERB -> Accesss
// # search ticket -> GET -> Driver
exports.searchTickets = catchAsync(async (req, res) => {
    res.send("search ticket")
})

// # description -> HTTP VERB -> Accesss
// # book ticket -> POST -> Driver
exports.bookTicket = catchAsync(async (req, res) => {
   
})