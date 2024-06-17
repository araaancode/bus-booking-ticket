const loginBtn = document.getElementById("login-btn")
const verifyOtpBtn = document.getElementById('verify-otp-btn')

let emailPhone = document.getElementById("email-phone")
let password = document.getElementById("password")

let emailPhoneError = document.getElementById("email-phone-error")
let passwordError = document.getElementById("password-error")


let firstAuth = document.getElementById("first-auth")
let secondAuth = document.getElementById("second-auth")

let otpMessage = document.getElementById("otp-message")

let userPhone = ""

let otp1 = document.getElementById("otp-1")
let otp2 = document.getElementById("otp-2")
let otp3 = document.getElementById("otp-3")
let otp4 = document.getElementById("otp-4")
let otp5 = document.getElementById("otp-5")
let otp6 = document.getElementById("otp-6")


// add event listener to login button
loginBtn.addEventListener("click", login)
verifyOtpBtn.addEventListener("click", verifyOtp)


async function sendOtp(phone) {

    axios.post('/api/v1/users/auth/send-otp', {
        phone
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });

}

async function verifyOtp(e) {
    e.preventDefault()

    if ((otp1.value && (otp1.value !== null || otp1.value === "")) && (otp2.value && (otp2.value !== null || otp2.value === "")) && (otp3.value && (otp3.value !== null || otp3.value === "")) && (otp4.value && (otp4.value !== null || otp4.value === "")) && (otp5.value && (otp5.value !== null || otp5.value === ""))) {
        let otps = [otp1.value, otp2.value, otp3.value, otp4.value, otp5.value]
        let otpCode = otps.join('')

        axios.post('/api/v1/users/auth/verify-otp', {
            phone: userPhone,
            code: otpCode
        })
            .then(function (response) {
                console.log(response.data);
                let message = response.data.msg
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
                }, 2000)
            })
            .catch(function (error) {
                console.log(error);
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
            });


    } else {
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
            title: 'همه فیلدها باید وارد شوند!',
            // content: 'My toast notification description.',
            style: 'error'
        });


        setTimeout(() => {
            document.querySelector('.toast-notification').style.display = "none"
        }, 2000)
    }


}


function login(e) {
    if (!emailPhone || emailPhone.value === "" || emailPhone.value === null || emailPhone.value === undefined) emailPhoneError.innerText = "*شماره همراه یا ایمیل باید وارد شود"
    if (!password || password.value === "" || password.value === null || password.value === undefined) passwordError.innerText = "* پسورد باید وارد شود"

    if (emailPhone.value.startsWith("09")) {
        axios.post('/api/v1/users/auth/login', {
            phone: emailPhone.value,
            password: password.value,
        })
            .then(function (response) {
                userPhone = response.data.user.phone
                let message = response.data.msg
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
                }, 2000)

                firstAuth.style.display = "none";
                secondAuth.style.display = "block";

                otpMessage.innerText = `کد تایید برای شماره ${userPhone} فرستاده شد`

                sendOtp(userPhone)

                const twoMinutes = 60 * 2, // 2 minutes in seconds
                    display = document.getElementById('two-sec');
                startTimer(twoMinutes, display);
                otp1.focus()

                localStorage.setItem("user",response.data.user._id)
            })
            .catch(function (error) {
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
            });
    } else {
        axios.post('/api/v1/users/auth/login', {
            email: emailPhone.value,
            password: password.value,
        })
            .then(function (response) {
                userPhone = response.data.user.phone
                let message = response.data.msg
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


                firstAuth.style.display = "none";
                secondAuth.style.display = "block";

                otpMessage.innerText = `کد تایید برای شماره ${userPhone} فرستاده شد`

                sendOtp(userPhone)
                const twoMinutes = 60 * 2, // 2 minutes in seconds
                    display = document.getElementById('two-sec');
                startTimer(twoMinutes, display);
                otp1.focus()
            })
            .catch(function (error) {
                console.log(error.response);
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
            });
    }

}


// Function to start the countdown
function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    const interval = setInterval(() => {
        minutes = Math.floor(timer / 60);
        seconds = timer % 60;

        // Ensure double digits for seconds
        seconds = seconds < 10 ? '0' + seconds : seconds;

        // Display the time
        display.innerHTML = "زمان باقی مانده برای ارسال کد تایید " + " " + "<b>" + minutes + "</b>" + ':' + "<b>" + seconds + "</b>"

        // Check if timer reached zero
        if (--timer < 0) {
            clearInterval(interval);
            display.textContent = "";
            document.getElementById("send-again-link").style.display = "block"
        }
    }, 1000);
}

// When the window loads, start the timer
// window.onload = function () {

// };
