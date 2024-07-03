// let buses = [
//     {
//         "_id": "6644aade4602b26d484f73f9",
//         "driver": "664348ee91f5784a8a9860b6",
//         "name": "Scania 1",
//         "model": "1978",
//         "color": "red"
//     },
//     {
//         "_id": "6644aade4602b26d484f73fa",
//         "driver": "664348ee91f5784a8a9860b7",
//         "name": "Scania 2",
//         "model": "1980",
//         "color": "red"
//     },
//     {
//         "_id": "6644aade4602b26d484f73fb",
//         "driver": "664348ee91f5784a8a9860b8",
//         "name": "Scania 3",
//         "model": "1981",
//         "color": "blue"
//     },
//     {
//         "_id": "6644aade4602b26d484f73fc",
//         "driver": "664348ee91f5784a8a9860b9",
//         "name": "Volvo 1",
//         "model": "1974",
//         "color": "blue"
//     },
//     {
//         "_id": "6644aade4602b26d484f73fd",
//         "driver": "664348ee91f5784a8a9860ba",
//         "name": "Volvo 2",
//         "model": "1986",
//         "color": "black"
//     },
//     {
//         "_id": "6644aade4602b26d484f73fe",
//         "driver": "664348ee91f5784a8a9860bb",
//         "name": "Volvo 3",
//         "model": "1986",
//         "color": "black"
//     },
//     {
//         "_id": "6644aade4602b26d484f73ff",
//         "driver": "664348ee91f5784a8a9860bc",
//         "name": "Benz 1",
//         "model": "1986",
//         "color": "yellow"
//     },
//     {
//         "_id": "6644aade4602b26d484f7400",
//         "driver": "664348ee91f5784a8a9860bd",
//         "name": "Benz 2",
//         "model": "1986",
//         "color": "red"
//     },
//     {
//         "_id": "6644aade4602b26d484f7401",
//         "driver": "664348ee91f5784a8a9860be",
//         "name": "Benz 3",
//         "model": "1986",
//         "color": "blue"
//     },
//     {
//         "_id": "6644aade4602b26d484f7402",
//         "driver": "664348ee91f5784a8a9860bf",
//         "name": "Tangara 1",
//         "model": "1990",
//         "color": "blue"
//     }
// ]

// module.exports = buses

const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb://localhost:27017/safirdbb";

    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Specify the database and collection
        const database = client.db('safirdbb');
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


let buses=[]

try {

    main().then(async (drivers) => {
        for (let i = 0; i < drivers.length; i++) {
            let driverId = drivers[i]._id
            let busId = drivers[i].bus
            newBus={
                _id:busId,
                driver:driverId,
                name:'Scania',
                model:"1994",
                color:"orange",
                capicity:10,
                seats:10,
                cover:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/ETS_Bus_Not_in_Service.jpg/1024px-ETS_Bus_Not_in_Service.jpg",
                images:["https://blog.payaneh.ir/wp-content/uploads/2022/07/WhatsApp-Image-2022-07-30-at-5.50.25-PM6655-1.jpeg","https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/LT_471_%28LTZ_1471%29_Arriva_London_New_Routemaster_%2819522859218%29.jpg/263px-LT_471_%28LTZ_1471%29_Arriva_London_New_Routemaster_%2819522859218%29.jpg"]
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