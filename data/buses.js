const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb://localhost:27017/bus_db";

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


let buses = []


const colors = ["سفید", "سیاه", "قرمز", "آبی", "سبز"]


function makeRandomColor(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        throw new Error('Input must be a non-empty array of strings');
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}



try {

    main().then(async (drivers) => {
        for (let i = 0; i < drivers.length; i++) {
            let driverId = drivers[i]._id
            let busId = drivers[i].bus
            newBus = {
                "_id": busId,
                "driver": driverId,
                "name": 'Scania',
                "model": "1994",
                "color": makeRandomColor(colors),
                "capicity": 10,
                "seats": 10,
                "cover": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/ETS_Bus_Not_in_Service.jpg/1024px-ETS_Bus_Not_in_Service.jpg",
                "images": ["https://blog.payaneh.ir/wp-content/uploads/2022/07/WhatsApp-Image-2022-07-30-at-5.50.25-PM6655-1.jpeg", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/LT_471_%28LTZ_1471%29_Arriva_London_New_Routemaster_%2819522859218%29.jpg/263px-LT_471_%28LTZ_1471%29_Arriva_London_New_Routemaster_%2819522859218%29.jpg"]
            }

            buses.push(newBus)
        }
    })

} catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'failure',
        msg: "خطای داخلی سرور",
        error
    });
}


module.exports = buses