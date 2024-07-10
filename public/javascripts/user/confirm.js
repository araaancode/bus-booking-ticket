const confirmBtn = document.getElementById("confirm-ticket")
const confirmSection = document.getElementById("confirm-section")
const userInformation = document.getElementById("user-information")
const msg = document.getElementById("msg")

const busName = document.getElementById("bus-name")
const busColor = document.getElementById("bus-color")
const busModel = document.getElementById("bus-model")
const driverName = document.getElementById("driver-name")
const movingDate = document.getElementById("moving-date")
const movingHour = document.getElementById("moving-hour")
const seats = document.getElementById("seats")
const busImage = document.getElementById("bus-image")
const firstCity = document.getElementById("first-city")
const lastCity = document.getElementById("last-city")

const name = document.getElementById("name")
const phone = document.getElementById("phone")
const email = document.getElementById("email")
const nationalCode = document.getElementById("national-code")




function persianCity(city) {
    switch (city) {
        case "arak":
            return "اراک";
            break;

        case "ardebil":
            return "اردبیل";
            break;

        case "oromieh":
            return "ارومیه";
            break;

        case "isfahan":
            return "اصفهان";
            break;

        case "ahvaz":
            return "اهواز";
            break;

        case "elam":
            return "ایلام";
            break;

        case "bognord":
            return "بجنورد";
            break;

        case "bandar_abbas":
            return "بندرعباس";
            break;

        case "boshehr":
            return "بوشهر";
            break;

        case "birgand":
            return "بیرجند";
            break;

        case "tabriz":
            return "تبریز";
            break;

        case "tehran":
            return "تهران";
            break;

        case "khoram_abad":
            return "خرم آباد";
            break;

        case "rasht":
            return "رشت";
            break;

        case "zahedan":
            return "زاهدان";
            break;

        case "zanjan":
            return "زنجان";
            break;

        case "sari":
            return "ساری";
            break;

        case "semnan":
            return "سمنان";
            break;

        case "sanandaj":
            return "سنندج";
            break;

        case "sharekord":
            return "شهرکرد";
            break;

        case "shiraz":
            return "شیراز";
            break;

        case "ghazvin":
            return "قزوین";
            break;

        case "ghom":
            return "قم";
            break;


        case "karaj":
            return "کرج";
            break;

        case "kerman":
            return "کرمان";
            break;


        case "kermanshah":
            return "کرمانشاه";
            break;

        case "gorgan":
            return "گرگان";
            break;


        case "mashhad":
            return "مشهد";
            break;

        case "hamedan":
            return "همدان";
            break;

        case "yasoj":
            return "یاسوج";
            break;

        case "yazd":
            return "یزد";
            break;


        default:
            return null;
    }
}


document.addEventListener("DOMContentLoaded", function (e) {
    let busId = localStorage.getItem("bus")
    let driverId = localStorage.getItem("driver")

    let savedBus;
    let savedDriver;

    axios.get(`/api/v1/buses/${busId}`).then((data) => {
        let bus = data.data.bus
        if (bus) {
            savedBus = bus
            confirmSection.style.display = "block"
            userInformation.style.display = "block"
            busName.innerHTML = "<b>نام اتوبوس: </b>" + bus.name
            busModel.innerHTML = "<b>نام اتوبوس: </b>" + bus.model
            busColor.innerHTML = "<b>رنگ اتوبوس: </b>" + bus.color
            busImage.src = bus.cover
            seats.innerHTML = "<b>صندلی های باقی مانده : </b>" + bus.seats

        } else {
            msg.innerHTML = "<b><h1>هیچ اطلاعاتی وجود ندارد...</h1>"
        }
    }).catch((error) => {
        console.log(error);
        let message = error.response.data.msg || error
        const toasts = new Toasts({
            offsetX: 20, // 20px
            offsetY: 20, // 20px
            gap: 20, // The gap size in pixels between toasts
            width: 300, // 300px
            timing: 'ease', // See list of available CSS transition timings
            duration: '.5s', // Transition duration
            dimOld: true, // Dim old notifications while the newest notification stays highlighted
            position: 'top-right' // top-left | top-center | top-right | bottom-left | bottom-center | bottom-right
        });

        toasts.push({
            title: message,
            // content: 'My toast notification description.',
            style: 'error'
        });


        setTimeout(() => {
            document.querySelector('.toast-notification').style.display = "none"
        }, 2000)
    })


    axios.get(`/api/v1/users/drivers/${driverId}`).then((data) => {
        let driver = data.data.driver
        if (driver) {
            savedDriver = driver
            driverName.innerHTML = "<b>نام راننده: </b>" + driver.name
            firstCity.innerHTML = "<b>مبدا: </b>" + persianCity(driver.arrival)
            lastCity.innerHTML = "<b>مقصد: </b>" + (driver.cities[0] === firstCity ? persianCity(driver.cities[1]) : persianCity(driver.cities[0]))
            movingDate.innerHTML = "<b>تاریخ حرکت: </b>" + new Date(driver.movingDate).toLocaleDateString("fa")
            movingHour.innerHTML = "<b>ساعت حرکت: </b>" + new Date(driver.movingDate).getHours() + ":" + new Date(driver.movingDate).getMinutes()

        } else {
            msg.innerHTML = "<b><h1>هیچ اطلاعاتی وجود ندارد...</h1>"
        }
    }).catch((error) => {
        console.log(error);
        let message = error.response.data.msg || error
        const toasts = new Toasts({
            offsetX: 20, // 20px
            offsetY: 20, // 20px
            gap: 20, // The gap size in pixels between toasts
            width: 300, // 300px
            timing: 'ease', // See list of available CSS transition timings
            duration: '.5s', // Transition duration
            dimOld: true, // Dim old notifications while the newest notification stays highlighted
            position: 'top-right' // top-left | top-center | top-right | bottom-left | bottom-center | bottom-right
        });

        toasts.push({
            title: message,
            // content: 'My toast notification description.',
            style: 'error'
        });


        setTimeout(() => {
            document.querySelector('.toast-notification').style.display = "none"
        }, 2000)
    })



    // **********************************************
    axios.get('/api/v1/users/me').then((user) => {
        let userData = user.data.user
        name.innerHTML = "<b>نام و نام خانوادگی: </b>" + userData.name
        phone.innerHTML = "<b>شماره همراه: </b>" + userData.phone
        email.innerHTML = "<b>ایمیل: </b>" + userData.email
        nationalCode.innerHTML = "<b>کد ملی: </b>" + userData.nationalCode
    }).catch((error) => {
        console.log(error);
        let message = error.response.data.msg || error
        const toasts = new Toasts({
            offsetX: 20, // 20px
            offsetY: 20, // 20px
            gap: 20, // The gap size in pixels between toasts
            width: 300, // 300px
            timing: 'ease', // See list of available CSS transition timings
            duration: '.5s', // Transition duration
            dimOld: true, // Dim old notifications while the newest notification stays highlighted
            position: 'top-right' // top-left | top-center | top-right | bottom-left | bottom-center | bottom-right
        });

        toasts.push({
            title: message,
            // content: 'My toast notification description.',
            style: 'error'
        });


        setTimeout(() => {
            document.querySelector('.toast-notification').style.display = "none"
        }, 2000)
    })


    confirmBtn.addEventListener("click", async (e) => {
        console.log(savedBus);
        console.log(savedDriver);
        await axios.post('/api/v1/users/book-ticket', {
            driver: savedDriver._id,
            passengers: [localStorage.getItem("user")],
            user: localStorage.getItem("user"),
            bus: savedBus._id,
            movingDate: savedDriver.movingDate,
            hour: savedDriver.movingDate,
            firstCity: savedDriver.arrival,
            lastCity: savedDriver.cities[0] === firstCity ? savedDriver.cities[1] : savedDriver.cities[0],
            seatNumbers: savedBus.seats,
            ticketPrice: savedDriver.price,
        }).then(data => {
            let message = data.data.msg
            const toasts = new Toasts({
                offsetX: 20, // 20px
                offsetY: 20, // 20px
                gap: 20, // The gap size in pixels between toasts
                width: 300, // 300px
                timing: 'ease', // See list of available CSS transition timings
                duration: '.5s', // Transition duration
                dimOld: true, // Dim old notifications while the newest notification stays highlighted
                position: 'top-right' // top-left | top-center | top-right | bottom-left | bottom-center | bottom-right
            });

            toasts.push({
                title: message,
                // content: 'My toast notification description.',
                style: 'success'
            });

            setTimeout(() => {
                document.querySelector('.toast-notification').style.display = "none"
                location.replace('/profile')
            }, 2000)


        }).catch((error) => {
            console.log(error);
            let message = error.response.data.msg || error
            const toasts = new Toasts({
                offsetX: 20, // 20px
                offsetY: 20, // 20px
                gap: 20, // The gap size in pixels between toasts
                width: 300, // 300px
                timing: 'ease', // See list of available CSS transition timings
                duration: '.5s', // Transition duration
                dimOld: true, // Dim old notifications while the newest notification stays highlighted
                position: 'top-right' // top-left | top-center | top-right | bottom-left | bottom-center | bottom-right
            });

            toasts.push({
                title: message,
                // content: 'My toast notification description.',
                style: 'error'
            });


            setTimeout(() => {
                document.querySelector('.toast-notification').style.display = "none"
            }, 2000)
        })
    })

})

