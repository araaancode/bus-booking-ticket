const catchAsync = require('../../middlewares/catchAsync');
const AppError = require('../../middlewares/appError');

// models
const Ticket = require('../../models/Ticket');
const User = require('../../models/User');
const Driver = require('../../models/Driver');
const Bus = require('../../models/Bus');


// covert persian date to gregorian
JalaliDate = {
    g_days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    j_days_in_month: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
};

JalaliDate.jalaliToGregorian = function (j_y, j_m, j_d) {
    j_y = parseInt(j_y);
    j_m = parseInt(j_m);
    j_d = parseInt(j_d);
    var jy = j_y - 979;
    var jm = j_m - 1;
    var jd = j_d - 1;

    var j_day_no = 365 * jy + parseInt(jy / 33) * 8 + parseInt((jy % 33 + 3) / 4);
    for (var i = 0; i < jm; ++i) j_day_no += JalaliDate.j_days_in_month[i];

    j_day_no += jd;

    var g_day_no = j_day_no + 79;

    var gy = 1600 + 400 * parseInt(g_day_no / 146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
    g_day_no = g_day_no % 146097;

    var leap = true;
    if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */ {
        g_day_no--;
        gy += 100 * parseInt(g_day_no / 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
        g_day_no = g_day_no % 36524;

        if (g_day_no >= 365) g_day_no++;
        else leap = false;
    }

    gy += 4 * parseInt(g_day_no / 1461); /* 1461 = 365*4 + 4/4 */
    g_day_no %= 1461;

    if (g_day_no >= 366) {
        leap = false;

        g_day_no--;
        gy += parseInt(g_day_no / 365);
        g_day_no = g_day_no % 365;
    }

    for (var i = 0; g_day_no >= JalaliDate.g_days_in_month[i] + (i == 1 && leap); i++)
        g_day_no -= JalaliDate.g_days_in_month[i] + (i == 1 && leap);
    var gm = i + 1;
    var gd = g_day_no + 1;

    gm = gm < 10 ? "0" + gm : gm;
    gd = gd < 10 ? "0" + gd : gd;

    return [gy, gm, gd];
}

var myDate = "1397-12-04",
    dateSplitted = myDate.split("-"),
    jD = JalaliDate.jalaliToGregorian(dateSplitted[0], dateSplitted[1], dateSplitted[2]);
jResult = jD[0] + "-" + jD[1] + "-" + jD[2];

// console.log(jResult);


// # description -> HTTP VERB -> Accesss
// # get user profile -> GET -> user
exports.getMe = catchAsync(async (req, res) => {
    let user = await User.findById(req.user.id).select('-password -confirmPassword')
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
// # update user profile -> PUT -> user
exports.updateProfile = catchAsync(async (req, res) => {
    await User.findByIdAndUpdate(
        req.params.userId,
        {
            name: req.body.name,
            phone: req.body.phone,
        },
        { new: true }
    ).then((user) => {
        if (user) {
            res.status(200).json({
                msg: 'کاربر ویرایش شد',
                user,
            })
        }
    }).catch((error) => {
        console.log(error);
        res.status(400).json({
            msg: "user not update",
            error: error
        })
    })

})

// # description -> HTTP VERB -> Accesss
// # update user avatar -> PUT -> user
exports.updateAvatar = catchAsync(async (req, res) => {
    await User.findByIdAndUpdate(
        req.params.userId,
        {
            avatar: req.file.filename,
        },
        { new: true }
    ).then((user) => {
        if (user) {
            res.status(200).json({
                msg: 'آواتار کاربر ویرایش شد',
                user,
            })
        }
    }).catch(err => {
        console.log(err)
        res.status(403).json({
            msg: 'آواتار کاربر ویرایش نشد',
            err,
        })
    })

})

// # description -> HTTP VERB -> Accesss
// # send message -> POST -> user
exports.sendMessage = catchAsync(async (req, res) => {
    res.send("send message")
})

// # description -> HTTP VERB -> Accesss
// # my tickets -> GET -> user
exports.myTickets = catchAsync(async (req, res) => {
    let tickets = await Ticket.find({}).populate('user')
    let findMyTickets=[]


    for (let i = 0; i < tickets.length; i++) {
        if(req.user.id === tickets[i].user.id){
            findMyTickets.push(tickets[i])
        }
    }


    res.send({
        count:findMyTickets.length,
        msg:"my tickets",
        myTickets:findMyTickets
    })
})


// # description -> HTTP VERB -> Accesss
// # cancle ticket -> PUT -> user
exports.cancleTicket = catchAsync(async (req, res) => {
    res.send("cancle ticket")
})

// # description -> HTTP VERB -> Accesss
// # search ticket -> POST -> user
exports.searchTickets = catchAsync(async (req, res) => {
    let buses = await Bus.find({}).populate('driver')
    let drivers = []
    let results = []
    let day = ""

    let { firstCity, lastCity, seats, movingDate } = req.body

    buses.forEach((bus) => {
        if (bus.driver.active) {
            drivers.push({
                driver: bus.driver,
                bus
            })
        }
    })

    dateSplitted = movingDate.split("-"),
        jD = JalaliDate.jalaliToGregorian(dateSplitted[0], dateSplitted[1], dateSplitted[2]);
    convertMovingDate = jD[0] + "-" + jD[1] + "-" + jD[2];


    for (let i = 0; i < drivers.length; i++) {
        let driverFirstCity = drivers[i].driver.cities[i]
        let driverLastCity = drivers[i].driver.cities[1]
        let driverSeats = drivers[i].bus.seats
        let driverArrival = drivers[i].driver.arrival
        let driverMovingDate = drivers[i].driver.movingDate.toISOString().split('T')[0]

        if (firstCity === driverArrival && (lastCity === driverFirstCity || lastCity === driverLastCity) && driverSeats > 0 && driverSeats >= seats) {
            console.log(drivers[i]);
            results.push(drivers[i])
        }
    }

    res.json({
        msg: "ticket find",
        data: req.body,
        countData: results.length,
        search: results
    })
})

// # description -> HTTP VERB -> Accesss
// # book ticket -> POST -> user
exports.bookTicket = catchAsync(async (req, res) => {
    let { driver, passengers, movingDate, hour, firstCity, lastCity, seats } = req.body
    let findDriver = await Driver.findById(req.body.driver).populate('bus')
    let price = 0
    let newSeatNumbers = []

    let user = await User.findById(req.user.id)

    // calulate number seats
    for (let i = 0; i < passengers.length; i++) {
        newSeatNumbers.push(findDriver.bus.capicity >= findDriver.bus.seats ? (i + (findDriver.bus.capicity - findDriver.bus.seats) + 1) : (i + 1))
    }


    // calulate price 
    price = passengers.length * findDriver.price

    // handle bus ticket booking
    let findBus = await Bus.findById({ _id: findDriver.bus._id })
    findBus.seats = findDriver.bus.seats - (passengers.length)

    await findBus.save()


    // handle ticket booking
    dateSplitted = movingDate.split("-"),
        jD = JalaliDate.jalaliToGregorian(dateSplitted[0], dateSplitted[1], dateSplitted[2]);
    convertMovingDate = jD[0] + "-" + jD[1] + "-" + jD[2];

    let newTicket = await Ticket.create({
        driver,
        passengers,
        user:req.user.id,
        bus: findDriver.bus,
        movingDate:convertMovingDate,
        hour: new Date().now,
        firstCity,
        lastCity,
        seatNumbers: newSeatNumbers,
        ticketPrice: price,

    })

    res.json({
        msg: "ticket booked",
        ticket: newTicket
    })
})


