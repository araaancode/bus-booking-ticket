const loginBtn = document.getElementById("login-btn")

let emailPhone = document.getElementById("email-phone")
let password = document.getElementById("password")

let emailPhoneError = document.getElementById("email-phone-error")
let passwordError = document.getElementById("password-error")





// add event listener to login button
loginBtn.addEventListener("click", login)

function login() {
    console.log("login");
    if (!emailPhone || emailPhone.value === "" || emailPhone.value === null || emailPhone.value === undefined) emailPhoneError.innerText = "*شماره همراه یا ایمیل باید وارد شود"
    if (!password || password.value === "" || password.value === null || password.value === undefined) passwordError.innerText = "* پسورد باید وارد شود"

    if (emailPhone.value.startsWith("09")) {
        axios.post('/api/v1/users/auth/login', {
            phone: emailPhone.value,
            password: password.value,
        })
            .then(function (response) {
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
            })
            .catch(function (error) {
                let message = error.response.data.msg
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
            })
            .catch(function (error) {
                console.log(error.response);
                let message = error.response.data.msg
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

