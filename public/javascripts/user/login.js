let phone = document.getElementById("phone")
let password = document.getElementById("password")
let loginBtn = document.getElementById("login-btn")
let firstAuth = document.getElementById("first-auth")
let secondAuth = document.getElementById("second-auth")

// login
loginBtn.addEventListener("click", loginUser)


function sendCode() {
    axios.post("/api/v1/users/auth/send-otp", {
        phone: phone.value,
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

            setTimeout(() => {
                document.querySelector('.toast-notification').style.display = "none"
            }, 2000)

            firstAuth.classList.add('hidden')
            secondAuth.classList.remove('hidden')

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


            setTimeout(() => {
                document.querySelector('.toast-notification').style.display = "none"
            }, 2000)
        });
}


function loginUser() {
    if (!phone.value || !password.value) {

    } else {
        localStorage.setItem("phone", phone.value)
        axios.post("/api/v1/users/auth/login", {
            phone: phone.value,
            password: password.value
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

                setTimeout(() => {
                    document.querySelector('.toast-notification').style.display = "none"
                }, 2000)

                firstAuth.classList.add('hidden')
                secondAuth.classList.remove('hidden')

                localStorage.setItem("user",response.data.user._id)
                sendCode()
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


                setTimeout(() => {
                    document.querySelector('.toast-notification').style.display = "none"
                }, 2000)
            });

    }
}