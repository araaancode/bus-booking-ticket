
const passwordInput = document.getElementById('password');
const eyeOpen = document.getElementById('eye-open');
const eyeClosed = document.getElementById('eye-closed');
let countdown;
let inpt1 = document.getElementById("inpt-1")
let inpt2 = document.getElementById("inpt-2")
let inpt3 = document.getElementById("inpt-3")
let inpt4 = document.getElementById("inpt-4")
let inpt5 = document.getElementById("inpt-5")
let verifyBtn = document.getElementById("verify-btn")


document.querySelectorAll('.toggle-password').forEach(item => {
    item.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        eyeOpen.classList.toggle('hidden');
        eyeClosed.classList.toggle('hidden');
    });
});



function startTimer() {
    const timerDisplay = document.getElementById('timer');
    const duration = 120; // Set timer duration in seconds
    const endTime = Date.now() + duration * 1000;

    displayTimeLeft(duration);

    countdown = setInterval(() => {
        const secondsLeft = Math.round((endTime - Date.now()) / 1000);

        if (secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }

        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    document.getElementById('timer').textContent = 'تا درخواست مجدد ' + display
}


startTimer()

// focus
document.addEventListener("DOMContentLoaded", function (e) {
    inpt1.focus()
})

verifyBtn.addEventListener("click", verifyCode)



function verifyCode(e) {
    let phone = localStorage.getItem("phone")

    if (!inpt1.value || !inpt2.value || !inpt3.value || !inpt4.value || !inpt5.value) {
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
            title: "همه خانه ها باید وارد شوند!",
            // content: 'My toast notification description.',
            style: 'error'
        });


        setTimeout(() => {
            document.querySelector('.toast-notification').style.display = "none"
        }, 2000)
    } else {
        let verifyCode = []
        verifyCode.push(inpt1.value)
        verifyCode.push(inpt2.value)
        verifyCode.push(inpt3.value)
        verifyCode.push(inpt4.value)
        verifyCode.push(inpt5.value)

        axios.post("/api/v1/users/auth/verify-otp", {
            phone: phone,
            code: verifyCode.join('')
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

                firstAuth.classList.add('hidden')
                secondAuth.classList.remove('hidden')

                setTimeout(() => {
                    location.reload()
                }, 3000)
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

    }
}