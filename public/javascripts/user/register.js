const registerBtn = document.getElementById("register-btn")

let name = document.getElementById("name")
let username = document.getElementById("username")
let phone = document.getElementById("phone")
let email = document.getElementById("email")
let password = document.getElementById("password")
let passwordConfirm = document.getElementById("password-confirm")

let nameError = document.getElementById("name-error")
let usernameError = document.getElementById("username-error")
let phoneError = document.getElementById("phone-error")
let emailError = document.getElementById("email-error")
let passwordError = document.getElementById("password-error")
let passwordConfirmError = document.getElementById("password-confirm-error")


// add event listener to register button
registerBtn.addEventListener("click", register)

function register() {
    if (!name || name.value === "" || name.value === null || name.value === undefined) nameError.innerText = "* نام و نام خانوادگی باید وارد شود"
    if (!username || username.value === "" || username.value === null || username.value === undefined) usernameError.innerText = "* نام کاربری باید وارد شود"
    if (!phone || phone.value === "" || phone.value === null || phone.value === undefined) phoneError.innerText = "*شماره همراه باید وارد شود"
    if (!email || email.value === "" || email.value === null || email.value === undefined) emailError.innerText = "* ایمیل باید وارد شود"
    if (!password || password.value === "" || password.value === null || password.value === undefined) passwordError.innerText = "* پسورد باید وارد شود"
    if (!passwordConfirm || passwordConfirm.value === "" || passwordConfirm.value === null || passwordConfirm.value === undefined) passwordConfirmError.innerText = "* تایید پسورد باید وارد شود"


    axios.post('/api/v1/users/auth/register', {
        name: name.value,
        username: username.value,
        phone: phone.value,
        email: email.value,
        password: password.value,
        passwordConfirm: passwordConfirm.value,
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

}

