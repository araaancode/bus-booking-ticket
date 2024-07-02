const catchAsync = require('../../middlewares/catchAsync');
const AppError = require('../../middlewares/appError');

// Driver model
const Driver = require('../../models/Driver');
const Bus = require('../../models/Bus');
const Ticket = require('../../models/Ticket');


const { MongoClient } = require('mongodb');

async function main() {
    const uri = process.env.MONGO_URI;

    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Specify the database and collection
        const database = client.db('safir');
        const collection = database.collection('drivers');

        // Query the collection (fetch data)
        const query = {}; // Define your query here
        const options = {
            // Optionally, you can add options like sort, limit, etc.
        };

        const results = await collection.find(query, options).toArray();

        return results
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        await client.close();
    }
}

// # description -> HTTP VERB -> Accesss
// # get Driver profile -> GET -> Driver
exports.getMe = catchAsync(async (req, res) => {
    main().then(async (drivers) => {
        let findDriver = drivers.find((driver) => driver.id == req.driver.id)

        if (findDriver) {
            console.log(findDriver);
            res.status(200).json({
                msg: "پروفایل راننده پیدا شد",
                driver: findDriver
            })
        } else {
            res.status(404).json({
                msg: "پروفایل راننده پیدا نشد",
            })
        }

    }).catch((error) => {
        console.log(error);
        res.send(error)
    })

})

// # description -> HTTP VERB -> Accesss
// # see driver bus -> GET -> Driver
exports.myBus = catchAsync(async (req, res) => {
    main().then(async (drivers) => {
        let findDriver = drivers.find((driver) => driver.id == req.driver.id)

        if (findDriver.bus) {
            let bus = await Bus.findById(findDriver.bus)
            if (bus) {
                res.status(200).json({
                    msg: "اتوبوس راننده پیدا شد",
                    bus: bus
                })

            } else {
                res.status(404).json({
                    msg: "اتوبوس راننده پیدا نشد",
                })
            }
        } else {
            res.status(404).json({
                msg: " اتوبوس پیدا نشد. می توانید اتوبوس خود را اضافه کنید",
            })
        }

    }).catch((error) => {
        console.log(error);
        res.send(error)
    })
})

// # description -> HTTP VERB -> Accesss
// # driver travels -> GET -> Driver
exports.myTravels = catchAsync(async (req, res) => {
    let myTickets = await Ticket.find({}).populate('driver')

    if(myTickets.length > 0){
        res.status(200).json({
            mag:"بلیط های راننده پیدا شد",
            tickets:myTickets
        })
    }else{
        res.status(404).json({
            mag:"بلیطی ندارید!",
        })
    }

})



// # description -> HTTP VERB -> Accesss
// # get driver passengers -> GET -> Driver
exports.getDriverPassengers = catchAsync(async (req, res) => {
    res.send('get driver passengers')
})

// # description -> HTTP VERB -> Accesss
// # cancel travel -> PUT -> Driver
exports.cancelTravel = catchAsync(async (req, res) => {
    res.send('cancel travel')
})

// # description -> HTTP VERB -> Accesss
// # get income -> GET -> Driver
exports.getIncome = catchAsync(async (req, res) => {
    res.send('get income')
})


// # description -> HTTP VERB -> Accesss
// # get reservations -> POST -> Driver
exports.getReservation = catchAsync(async (req, res) => {
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

