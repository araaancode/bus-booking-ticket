const catchAsync = require('../../middlewares/catchAsync');
const AppError = require('../../middlewares/appError');
const { StatusCodes } = require("http-status-codes")


// Bus model
const Bus = require('../../models/Bus');

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


async function udpateDoc(updateEntry, docData) {
    // Connection URL
    const url = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
    const client = new MongoClient(url);

    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected successfully to server');

        // Database and Collection
        const dbName = 'safir'; // Replace with your database name
        const db = client.db('safir');
        const collection = db.collection('drivers'); // Replace with your collection name

        // Define the filter and the update
        const filter = { phone: docData }; // Replace with your filter criteria
        const updateDoc = {
            $set: { bus: updateEntry }, // Replace with your update operation
        };

        // Update the document
        const result = await collection.updateOne(filter, updateDoc);
        return result
    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection
        await client.close();
    }
}


// # description -> HTTP VERB -> Accesss
// # get all buses (active and deactive) -> GET -> admin
exports.getAllBus = async (req, res) => {
    try {
        let buses = await Bus.find({})
        if (buses.length > 0) {
            return res.status(StatusCodes.OK).json({
                status: 'success',
                msg: "اتوبوس ها پیدا شدند",
                count: buses.length,
                buses: buses
            })
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'failure',
                msg: "اتوبوسی پیدا نشد"
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
// # get single buse -> GET -> admin
exports.getSingleBus = async (req, res) => {
    try {
        let bus = await Bus.findById(req.params.busId)
        if (bus) {
            return res.status(StatusCodes.OK).json({
                status: 'success',
                msg: "اتوبوس پیدا شدند",
                bus: bus
            })
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'failure',
                msg: "اتوبوسی پیدا نشد"
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
// # create bus for driver -> POST -> bus
exports.createBus = catchAsync(async (req, res) => {
    let images = [];
    if (req.files.images) {
        req.files.images.forEach((element) => {
            images.push(element.filename);
        });
    }

    await Bus.create({
        driver: req.driver._id,
        name: req.body.name,
        model: req.body.model,
        color: req.body.color,
        features: req.body.features,
        cover: req.files.cover[0].filename,
        images,
    }).then((bus) => {
        if (bus) {
            main().then(async (drivers) => {
                let findDriver = drivers.find((driver) => driver.id == req.driver.id)
                udpateDoc(bus._id, findDriver.phone).then((data) => {
                    if (data) {
                        res.status(StatusCodes.CREATED).json({
                            success: true,
                            msg: "اتوبوس شما ایجاد شد",
                            driver: data,
                            bus
                        })
                    }
                }).catch(console.error);


            }).catch((error) => {
                console.log(error);
                res.send(error)
            })

        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: true,
                data: bus,
                msg: "خطایی وجود دارد اتوبوس وجود دارد"
            })
        }
    }).catch((error) => {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: "خطایی وجود دارد."
        })
    })

})


// # description -> HTTP VERB -> Accesss
// # update bus for driver -> PUT -> bus
exports.updateBus = async (req, res) => {
    try {

        let bus = await Bus.findById(req.params.busId)

        if (bus.driver.toString() == req.driver._id.toString()) {

            await Bus.findByIdAndUpdate(req.params.busId, {
                name: req.body.name,
                model: req.body.model,
                color: req.body.color,
                capicity: req.body.capicity,
                seats: req.body.seats,
                features: req.body.features,
            }, { new: true }).then((newData) => {
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: "اتوبوس ویرایش شد",
                    newBus: newData
                });
            }).catch((error) => {
                console.log(error);
                res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'failure',
                    msg: "اتوبوس ویرایش نشد",
                });
            })

        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
                status: 'failure',
                msg: "دسترسی غیرمجاز",
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
// # update bus cover for driver -> PUT -> bus
exports.updateBusCover = async (req, res) => {
    try {
        await Bus.findByIdAndUpdate(req.params.busId, {
            cover: req.file.filename,
        }).then((newBus) => {
            if (newBus) {
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: "کاور اتوبوس ویرایش شد",
                    newBus
                });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({
                    status: 'failure',
                    msg: "کاور اتوبوس ویرایش نشد",
                });
            }
        });
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
// # update bus images for driver -> PUT -> bus
exports.updateBusImages = async (req, res) => {
    console.log(req.file.filename);
    // try {
    //     await Bus.findByIdAndUpdate(req.params.busId, {
    //       $push: {
    //         images: {
    //           filename: req.file.filename,
    //         },
    //       },
    //     }).then((newBus) => {
    //       if (newBus) {
    //         res.status(StatusCodes.OK).json({
    //             status: 'success',
    //             msg: "عکس های اتوبوس ویرایش شد",
    //             newBus
    //         });
    //       }
    //     }).catch((error)=>{
    //         console.log(error);
    //         res.status(StatusCodes.BAD_REQUEST).json({
    //             status: 'success',
    //             msg: "عکس های اتوبوس ویرایش نشد",
    //             error
    //         });
    //     });
    // } catch (error) {
    //     console.error(error.message);
    //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //         status: 'failure',
    //         msg: "خطای داخلی سرور",
    //         error
    //     });
    // }
}
