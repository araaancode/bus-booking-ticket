const bcrypt = require("bcryptjs")
const moment = require("moment")

function createRandomNumber(){
    return Math.floor((Math.random() * 30) + 1)
}


// for (let i = 1; i < 5; i++) {
//     let data = moment().add(i,'days').format();
//     console.log(data);
// }



let drivers = [
    {
        "_id": "664348ee91f5784a8a9860b6",
        "name": "driver one",
        "phone": "09383901130",
        "password": bcrypt.hashSync('12345678', 10),
        "arrival": "rasht",
        "cities": ["isfahan", "rasht"],
        "bus": "6644aade4602b26d484f73f9",
        "movingDate": moment().add(createRandomNumber(),'days').format(),
        "price": "1000"
    },
    {
        "_id": "664348ee91f5784a8a9860b7",
        "name": "driver two",
        "phone": "09383901131",
        "password": bcrypt.hashSync('12345678', 10),
        "arrival": "isfahan",
        "cities": ["isfahan", "tehran"],
        "bus": "6644aade4602b26d484f73fa",
        "movingDate": moment().add(createRandomNumber(),'days').format(),
        "price": "1000"
    },
    {
        "_id": "664348ee91f5784a8a9860b8",
        "name": "driver three",
        "phone": "093839011312",
        "password": bcrypt.hashSync('12345678', 10),
        "arrival": "tabriz",
        "cities": ["isfahan", "tabriz"],
        "bus": "6644aade4602b26d484f73fb",
        "movingDate": moment().add(createRandomNumber(),'days').format(),
        "price": "1000"
    },
    {
        "_id": "664348ee91f5784a8a9860b9",
        "name": "driver four",
        "phone": "09383901133",
        "password": bcrypt.hashSync('12345678', 10),
        "arrival": "isfahan",
        "cities": ["tehran", "isfahan"],
        "bus": "6644aade4602b26d484f73fc",
        "movingDate": moment().add(createRandomNumber(),'days').format(),
        "price": "1000"
    },
    {
        "_id": "664348ee91f5784a8a9860ba",
        "name": "driver five",
        "phone": "09383901134",
        "password": bcrypt.hashSync('12345678', 10),
        "arrival": "zahedan",
        "cities": ["tehran", "zahedan"],
        "bus": "6644aade4602b26d484f73fd",
        "movingDate": moment().add(createRandomNumber(),'days').format(),
        "price": "1000"
    },
    {
        "_id": "664348ee91f5784a8a9860bb",
        "name": "driver six",
        "phone": "09383901135",
        "password": bcrypt.hashSync('12345678', 10),
        "arrival": "isfahan",
        "cities": ["zahedan", "isfahan"],
        "bus": "6644aade4602b26d484f73fe",
        "movingDate": moment().add(createRandomNumber(),'days').format(),
        "price": "1000"
    },
    {
        "_id": "664348ee91f5784a8a9860bc",
        "name": "driver seven",
        "phone": "09383901136",
        "password": bcrypt.hashSync('12345678', 10),
        "arrival": "mashhad",
        "cities": ["zahedan", "mashhad"],
        "bus": "6644aade4602b26d484f73ff",
        "movingDate": moment().add(createRandomNumber(),'days').format(),
        "price": "1000"
    },
    {
        "_id": "664348ee91f5784a8a9860bd",
        "name": "driver eight",
        "phone": "09383901137",
        "password": bcrypt.hashSync('12345678', 10),
        "arrival": "zahedan",
        "cities": ["zahedan", "isfahan"],
        "bus": "6644aade4602b26d484f7400",
        "movingDate": moment().add(createRandomNumber(),'days').format(),
        "price": "1000"
    },
    {
        "_id": "664348ee91f5784a8a9860be",
        "name": "driver nine",
        "phone": "09383901138",
        "password": bcrypt.hashSync('12345678', 10),
        "arrival": "zahedan",
        "cities": ["zahedan", "tehran"],
        "bus": "6644aade4602b26d484f7401",
        "movingDate": moment().add(createRandomNumber(),'days').format(),
        "price": "1000"
    },
    {
        "_id": "664348ee91f5784a8a9860bf",
        "name": "driver ten",
        "phone": "09383901139",
        "password": bcrypt.hashSync('12345678', 10),
        "arrival": "tehran",
        "cities": ["zahedan", "tehran"],
        "bus": "6644aade4602b26d484f7402",
        "movingDate": moment().add(createRandomNumber(),'days').format(),
        "price": "1000"
    }
]

module.exports = drivers