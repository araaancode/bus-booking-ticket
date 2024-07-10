let firstCity = document.getElementById("firstCity")
let lastCity = document.getElementById("lastCity")
let count = document.getElementById("count")
var movingDate = document.getElementById("movingDate")
let bus = document.getElementById("bus")


// data

document.getElementById("search").addEventListener("click", search)

firstCity.addEventListener("change", (e) => {
    firstCity = e.target.value
})


lastCity.addEventListener("change", (e) => {
    lastCity = e.target.value
})


movingDate.addEventListener("change", (e) => {
    movingDate = e.target.value
})


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


function search() {
    if (firstCity && lastCity && count.value && movingDate) {
        axios.post('/api/v1/users/search-ticket', {
            firstCity: firstCity,
            lastCity: lastCity,
            seats: count.value,
            movingDate: movingDate,
        }).then((data) => {
            let results = data.data.data
            let newBuses = []


            if (results === undefined) {
                bus.innerHTML = "<h2 class='text-2xl text-gray-500'>بلیطی پیدا نشد..!</h2>"
            } else {
                bus.innerHTML = ""
                for (let i = 0; i < results.length; i++) {
                    newBuses.push({ ...results[i].bus, updateDriver: results[i].driver })
                }

                for (let i = 0; i < newBuses.length; i++) {
                    bus.innerHTML += `
                        <div style="width:100%;" class="border rounded-md shadow shadow-md bus grid grid-cols-2 gap-4 mx-auto my-10">
                            <div class="font-bold text-xl mb-2 p-8 flex flex-col justify-center">
                                <img class="m-4 rounded-md w-80 h-100 inline"
                                    src=${newBuses[i].cover}
                                    alt=${newBuses[i].name}>
                                <span class="ml-4 block" id="bus-title">نام اتوبوس: ${newBuses[i].name}</span>
                                <span class="ml-4 block" id="bus-title">مدل اتوبوس: ${newBuses[i].name}</span>
                                <span class="ml-4 block" id="bus-title">رنگ اتوبوس: ${newBuses[i].color}</span>
                                <span class="ml-4 block">مبدا: ${persianCity(newBuses[i].updateDriver.arrival)}</span>
                                <span class="ml-4 block">مقصد: ${newBuses[i].updateDriver.cities[0] === firstCity ? persianCity(newBuses[i].updateDriver.cities[1]) : persianCity(newBuses[i].updateDriver.cities[0])}</span>
                                <span class="ml-4 block">شهر پایانه: ${persianCity(newBuses[i].updateDriver.arrival)}</span>
                                <span class="ml-4 block">ظرفیت: ${newBuses[i].seats}</span>
                                <span class="ml-4 block">تاریخ حرکت: ${newBuses[i].updateDriver.movingDate}</span>
                                <p>هزینه به ازای هر نفر: ${newBuses[i].updateDriver.price}</p>
                                <a href="/confirm">
                                    <button id=${newBuses[i]._id}" onclick='handleClick(${JSON.stringify(newBuses[i])})'
                                        class="confirm-btn bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent mt-4 rounded">رزرو
                                        بلیط    
                                    </button>
                                </a>
                            </div>
                        </div>

                   `
                }


            }

        }).catch((error) => {
            console.log(error);
        })
        document.querySelectorAll('input').value = ""
    } else {
        alert("enter all fields")
    }


}

// document.addEventListener("click", function (e) {
//     if (e.target.classList.contains('confirm-btn')) {
//         console.log(e.target.parentNode.id);
//         let busId = e.target.id
//         localStorage.setItem("bus", busId)
//     }
// })


function handleClick(data) {
    localStorage.setItem("bus",data._id)
    localStorage.setItem("driver",data.driver)
}