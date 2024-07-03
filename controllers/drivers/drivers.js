const catchAsync = require('../../middlewares/catchAsync');
const AppError = require('../../middlewares/appError');
const { StatusCodes } = require("http-status-codes")

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
        const database = client.db('bus_db');
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
exports.getMe = async (req, res) => {
    try {
        main().then(async (drivers) => {
            let findDriver = drivers.find((driver) => driver.id == req.driver.id)

            if (findDriver) {
                res.status(StatusCodes.OK).json({
                    msg: "پروفایل راننده پیدا شد",
                    driver: findDriver
                })
            } else {
                res.status(StatusCodes.NOT_FOUND).json({
                    msg: "پروفایل راننده پیدا نشد",
                })
            }

        }).catch((error) => {
            console.error(error.message);
            res.status(StatusCodes.BAD_REQUEST).json({
                status: 'failure',
                msg: "راننده پیدا نشد",
                error
            });
        })

    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}

// # description -> HTTP VERB -> Accesss
// # see driver bus -> GET -> Driver
exports.myBus = async (req, res) => {
    let buses = await Bus.find({})
    let findBus;

    buses.forEach(bus => {
        if (bus.driver.toString() === req.driver._id.toString()) {
            findBus = bus
        }
    });

    try {
        if (findBus) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: "اتوبوس راننده پیدا شد",
                bus: findBus
            });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                msg: "اتوبوس پیدا نشد",
            });
        }
    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }


}

// # description -> HTTP VERB -> Accesss
// # driver travels -> GET -> Driver
exports.myTravels = async (req, res) => {
    try {
        let myTickets = await Ticket.find({}).populate('driver')

        if (myTickets.length > 0) {
            res.status(StatusCodes.OK).json({
                status: 'success',
                mag: "بلیط های راننده پیدا شد",
                tickets: myTickets
            })
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                status: 'failure',
                mag: "بلیطی ندارید!",
            })
        }
    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }

}



// # description -> HTTP VERB -> Accesss
// # get driver passengers -> GET -> Driver
exports.getDriverPassengers = (async (req, res) => {
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
exports.updateProfile = async (req, res) => {
    try {
        await Driver.findByIdAndUpdate(
            req.params.driverId,
            {
                name: req.body.name,
                phone: req.body.phone,
            },
            { new: true }
        ).then((driver) => {
            if (driver) {
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: 'راننده ویرایش شد',
                    driver,
                })
            }
        }).catch((error) => {
            console.log(error);
            res.status(StatusCodes.BAD_REQUEST).json({
                status: 'failure',
                msg: "راننده ویرایش نشد",
                error: error
            })
        })
    } catch (error) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'failure',
            msg: "خطای داخلی سرور",
            error
        });
    }
}

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

