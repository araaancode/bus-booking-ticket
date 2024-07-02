const catchAsync = require('../../middlewares/catchAsync');
const AppError = require('../../middlewares/appError');

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
// # get bus for driver -> GET -> bus
exports.getBus = catchAsync(async (req, res) => {
    let bus = await Bus.findOne({ driver: req.driver.id })
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

    await Bus.create({
        driver: req.driver._id,
        name: req.body.name,
        model: req.body.model,
        color: req.body.color,
        features: req.body.features,
    }).then((bus) => {
        if (bus) {
            main().then(async (drivers) => {
                let findDriver = drivers.find((driver) => driver.id == req.driver.id)

                udpateDoc(bus._id, findDriver.phone).then((data) => {
                    if (data) {
                        res.status(201).json({
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
            res.status(400).json({
                success: true,
                data: bus,
                msg: "خطایی وجود دارد اتوبوس وجود دارد"
            })
        }
    }).catch((error) => {
        console.log(error);
        res.status(400).json({
            msg: "خطایی وجود دارد."
        })
    })



})


// # description -> HTTP VERB -> Accesss
// # update bus for driver -> PUT -> bus
exports.updateBus = catchAsync(async (req, res) => {
    await Bus.findByIdAndUpdate(
        req.driver.bus,
        {
            name: req.body.name,
            model: req.body.model,
            color: req.body.color,
            capicity: req.body.capicity,
            seats: req.body.seats,
            features: req.body.features,
        },
        { new: true }
    ).then((bus) => {
        if (bus) {
            res.status(200).json({
                msg: 'اتوبوس ویرایش شد',
                bus,
            })
        }
    }).catch((error) => {
        console.log(error);
        res.status(400).json({
            msg: "اتوبوس ویرایش نشد",
            error: error
        })
    })
})


// # description -> HTTP VERB -> Accesss
// # update bus cover for driver -> PUT -> bus
exports.updateBusCover = catchAsync(async (req, res) => {
    res.send("update bus cover")
})

// # description -> HTTP VERB -> Accesss
// # update bus images for driver -> PUT -> bus
exports.updateBusImages = catchAsync(async (req, res) => {
    res.send("update bus images")
})