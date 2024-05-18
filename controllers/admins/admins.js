const catchAsync = require('../../middlewares/catchAsync');
const AppError = require('../../middlewares/appError');

// User model
const Ticket = require('../../models/Ticket');
const User = require('../../models/User');
const Bus = require('../../models/Bus');
const Driver = require('../../models/Driver');
const Admin = require('../../models/Admin');


// # description -> HTTP VERB -> Accesss
// # get admin profile -> GET -> admin
exports.getMe = catchAsync(async (req, res) => {
    let admin = await Admin.findById(req.admin.id).select('-password -confirmPassword')
    if (admin) {
        res.status(200).json({
            status: 'success',
            msg: 'admin fetched',
            admin,
        })
    } else {
        res.status(403).json({
            msg: 'can not fetch admin',
        })
    }
})

// # description -> HTTP VERB -> Accesss
// # update admin profile -> PUT -> admin
exports.updateProfile = catchAsync(async (req, res) => {
    await Admin.findByIdAndUpdate(
        req.params.adminId,
        {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
        },
        { new: true }
    ).then((admin) => {
        if (admin) {
            res.status(200).json({
                msg: 'admin ویرایش شد',
                admin,
            })
        }
    }).catch((error) => {
        console.log(error);
        res.status(400).json({
            msg: "admin not update",
            error: error
        })
    })

})

// # description -> HTTP VERB -> Accesss
// # update admin avatar -> PUT -> admin
exports.updateAvatar = catchAsync(async (req, res) => {
    await Admin.findByIdAndUpdate(
        req.params.adminId,
        {
            avatar: req.file.filename,
        },
        { new: true }
    ).then((admin) => {
        if (admin) {
            res.status(200).json({
                msg: 'آواتار ویرایش شد',
                admin,
            })
        }
    }).catch(err => {
        console.log(err)
        res.status(403).json({
            msg: 'آواتار ویرایش نشد',
            err,
        })
    })
})

// # description -> HTTP VERB -> Accesss
// # get all drivers -> GET -> admin
exports.getDrivers = catchAsync(async (req, res) => {
    let drivers = await Driver.find({})
    console.log(drivers);
    if (drivers) {
        res.status(200).json({
            status: 'success',
            msg: 'drivers fetched',
            count: drivers.length,
            drivers,
        })
    } else {
        res.status(403).json({
            msg: 'can not fetch drivers',
        })
    }
})

// # description -> HTTP VERB -> Accesss
// # get single driver -> GET -> admin
exports.getDriver = catchAsync(async (req, res) => {
    let driver = await Driver.findById(req.params.driverId).select('-password -confirmPassword')
    if (driver) {
        res.status(200).json({
            status: 'success',
            msg: 'driver fetched',
            driver,
        })
    } else {
        res.status(403).json({
            msg: 'can not fetch drivers',
        })
    }
})

// # description -> HTTP VERB -> Accesss
// # active driver -> GET -> admin
exports.activeDriver = catchAsync(async (req, res) => {
    let findDriver = await Driver.findById(req.params.driverId)

    if(findDriver && findDriver.active === false) {
        res.send(findDriver)
    }else{
        res.send("operation failed")
    }

    // await Driver.findByIdAndUpdate(
    //     req.params.driverId,
    //     {
    //         name: req.body.name,
    //         phone: req.body.phone,
    //         email: req.body.email,
    //     },
    //     { new: true }
    // ).then((driver) => {
    //     if (driver) {
    //         res.status(200).json({
    //             msg: 'driver فعال شد',
    //             driver,
    //         })
    //     }
    // }).catch((error) => {
    //     console.log(error);
    //     res.status(400).json({
    //         msg: "driver not update",
    //         error: error
    //     })
    // })
})

// # description -> HTTP VERB -> Accesss
// # deActive driver -> GET -> admin
exports.deActiveDriver = catchAsync(async (req, res) => {
    let driver = await Driver.findById(req.params.driverId).select('-password -confirmPassword')

    res.send("deactive ")
    
})



// # description -> HTTP VERB -> Accesss
// # get all users -> GET -> admin
exports.getUsers = catchAsync(async (req, res) => {
    let users = await User.find({}).select('-password -confirmPassword')
    if (users) {
        res.status(200).json({
            status: 'success',
            msg: 'users fetched',
            count: users.length,
            users,
        })
    } else {
        res.status(403).json({
            msg: 'can not fetch users',
        })
    }
})

// # description -> HTTP VERB -> Accesss
// # get single user -> GET -> admin
exports.getUser = catchAsync(async (req, res) => {
    let user = await User.findById(req.params.userId).select('-password -confirmPassword')
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
// # get all buses -> GET -> admin
exports.getBuses = catchAsync(async (req, res) => {
    let buses = await Bus.find({})
    if (buses) {
        res.status(200).json({
            status: 'success',
            msg: 'buses fetched',
            count: buses.length,
            buses,
        })
    } else {
        res.status(403).json({
            msg: 'can not fetch buses',
        })
    }
})

// # description -> HTTP VERB -> Accesss
// # get single bus -> GET -> admin
exports.getBus = catchAsync(async (req, res) => {
    let bus = await Bus.findById(req.params.busId).select('-password -confirmPassword')
    if (bus) {
        res.status(200).json({
            status: 'success',
            msg: 'bus fetched',
            bus,
        })
    } else {
        res.status(403).json({
            msg: 'can not fetch bus',
        })
    }
})