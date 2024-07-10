
let name = document.getElementById("name")
let email = document.getElementById("email")
let phone = document.getElementById("phone")
let nationalCode = document.getElementById("national-code")
let updateBtn = document.getElementById("update-btn")
let username = document.getElementById("username")
let emailInfo = document.getElementById("email-info")


updateBtn.addEventListener("click", updateUser)

let userId = localStorage.getItem("user") ? localStorage.getItem("user") : null

function UI() {
    axios.get('/api/v1/users/me')
        .then(function (response) {
            let message = response.data.msg
            name.value = response.data.user.name === undefined ? '' : response.data.user.name
            phone.value = response.data.user.phone === undefined ? '' : response.data.user.phone
            email.value = response.data.user.email === undefined ? '' : response.data.user.email
            nationalCode.value = response.data.user.nationalCode === undefined ? '' : response.data.user.nationalCode

            if (response.data.user.name === null || response.data.user.name === undefined || response.data.user.name === '') {
                username.innerHTML = 'هنوز نام کاربر وارد نشده است'
            } else {
                username.innerHTML = response.data.user.name
            }

            if (response.data.user.email === null || response.data.user.email === undefined || response.data.user.email === '') {
                username.innerHTML = 'هنوز ایمیلی وارد نشده است'
            } else {
                username.innerHTML = response.data.user.email
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}


function updateUser() {

    axios.put(`/api/v1/users/update-profile/${userId}`, {
        phone: phone.value,
        name: name.value,
        email: email.value,
        nationalCode: nationalCode.value,
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
                location.reload()
            }, 2000)


           

        })
        .catch(function (error) {
            console.log(error);
            let message = error
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


document.addEventListener("DOMContentLoaded", function () {
    UI()
})