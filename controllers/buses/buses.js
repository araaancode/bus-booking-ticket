const catchAsync = require('../../middlewares/catchAsync');
const AppError = require('../../middlewares/appError');

// Bus model
const Bus = require('../../models/Bus');


// # description -> HTTP VERB -> Accesss
// # get bus for driver -> GET -> bus
exports.getBus = catchAsync(async (req, res) => {
    let bus = await Bus.findOne({driver:req.driver.id})
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


// # description -> HTTP VERB -> Accesss
// # create bus for driver -> POST -> bus
exports.createBus = catchAsync(async (req, res) => {
    const bus = await Bus.create({
        driver: req.driver.id,
        name: req.body.name,
        model: req.body.model,
        color: req.body.color,
        features: req.body.features,
    });


    if(bus){
        res.status(201).json({
            success:true,
            data:bus,
            msg:"اتوبوس ایجاد شد"
        })
    }else{
        res.status(400).json({
            success:true,
            data:bus,
            msg:"خطایی وجود دارد اتوبوس وجود دارد"
        })
    }

})


// # description -> HTTP VERB -> Accesss
// # update bus for driver -> PUT -> bus
exports.updateBus=catchAsync(async(req,res)=>{
    res.send("update bus")
})


// # description -> HTTP VERB -> Accesss
// # update bus cover for driver -> PUT -> bus
exports.updateBusCover=catchAsync(async(req,res)=>{
    res.send("update bus cover")
})

// # description -> HTTP VERB -> Accesss
// # update bus images for driver -> PUT -> bus
exports.updateBusImages=catchAsync(async(req,res)=>{
    res.send("update bus images")
})