const bcrypt = require("bcryptjs")
const moment = require("moment")
const mongoose = require('mongoose');
const { BSON } = require('bson');
const { ObjectId, Long, Double, Int32, Decimal128, Timestamp } = BSON;

const colors = ["سفید","سیاه","قرمز","آبی","سبز"]

const cities = [
    "arak",
    "ardebil",
    "oromieh",
    "isfahan",
    "ahvaz",
    "elam",
    "bognord",
    "bandar_abbas",
    "boshehr",
    "birgand",
    "tabriz",
    "tehran",
    "khoram_abad",
    "rasht",
    "zahedan",
    "zanjan",
    "sari",
    "semnan",
    "sanandaj",
    "sharekord",
    "shiraz",
    "ghazvin",
    "ghom",
    "karaj",
    "kerman",
    "kermanshah",
    "gorgan",
    "mashhad",
    "hamedan",
    "yasoj",
    "yazd",
];

function makeRandomCities(arr) {
    if (!Array.isArray(arr) || arr.length < 2) {
        throw new Error('Input must be an array of at least two strings');
    }

    // Generate the first random index
    const index1 = Math.floor(Math.random() * arr.length);
    let index2;

    // Ensure the second index is different from the first
    do {
        index2 = Math.floor(Math.random() * arr.length);
    } while (index1 === index2);

    return [arr[index1], arr[index2]];
}

function createRandomDay() {
    return Math.floor((Math.random() * 180) + 1)
}

function makeRandomArrival(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        throw new Error('Input must be a non-empty array of strings');
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}



function makeRandomPrice(min = 150000, max = 1000000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function makeRandomPhone() {
    // Generate the remaining 9 digits of the phone number
    let remainingDigits = '';
    for (let i = 0; i < 9; i++) {
        remainingDigits += Math.floor(Math.random() * 10);
    }

    // Concatenate '09' with the remaining digits
    return '09' + remainingDigits;
}




// function generateBsonObjectId() {
//     return new ObjectId();
// }

// // Example usage
// const bsonId = generateBsonObjectId();



function generateRandomBsonDocuments(numDocuments = 100) {
    const bsonDocuments = [];

    for (let i = 0; i < numDocuments; i++) {
        const bsonDocument = {
            _id: new ObjectId(),
            name: `Random Document ${i + 1}`,
            createdAt: new Date(),
            randomNumber: Math.random() * 1000,
            someInt: new Int32(Math.floor(Math.random() * 100)),
            someLong: new Long(Math.floor(Math.random() * 1000000)),
            someDecimal: Decimal128.fromString((Math.random() * 1000).toFixed(2)),
            someTimestamp: Timestamp.fromNumber(Date.now()),
            nestedDocument: {
                subField: `Sub Value ${i + 1}`
            }
        };

        bsonDocuments.push(bsonDocument);
    }

    // Return a random BSON document from the array
    const randomIndex = Math.floor(Math.random() * numDocuments);
    return bsonDocuments[randomIndex];
}

// Example usage
const randomBsonDocument = generateRandomBsonDocuments();


let drivers = []

for (let i = 1; i <= 1000; i++) {
    let newArrival = makeRandomArrival(cities)
    let newCities = makeRandomCities(cities)
    if (!newCities.includes(newArrival)) {
        newCities.pop()
        newCities.push(newArrival)
    }

    let data = {
        "name": `driver ${i}`,
        "phone": makeRandomPhone(),
        "password": bcrypt.hashSync('12345678', 10),
        "arrival": newArrival,
        "cities": newCities,
        "movingDate": moment().add(createRandomDay(), 'days').format(),
        "bus": new ObjectId().toString(),
        "role": "driver",
        "price": makeRandomPrice()
    }

    drivers.push(data)
}



module.exports = drivers


