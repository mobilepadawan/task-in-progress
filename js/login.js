import { User, showToastMessage, UserURLS, Options, Storage, projectsAndTasksURLS } from "../assets/js/utils.js"

const loginForm = document.querySelector('.login-form')

function loginUser() {
    const email = document.querySelector('input#email')
    const password = document.querySelector('input#password')

    User.email = email.value
    User.password = password.value

    if (User.email && User.password) {
        fetchUserLogin()
    } else {
        showToastMessage('warning', 'Completa usuario y contraseña.')
    }
}

function fetchUserLogin() {
    Options.method = 'POST'
    Options.body = JSON.stringify(User)
    fetch(UserURLS.userLoginURL, Options)
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                Storage.saveSessionToken('knbntkn', data.tokenId.toString())
                showToastMessage('success', 'Bienvenid@, nuevamente a Task-In-Progress.')
                .then((r)=> location.href = 'index.html')
                
            } else {
                throw new Error(data.errorMessage)
            }
            console.table(data)
        })
        .catch((error) => {
            showToastMessage('error', `Error de inicio de sesión: ${error.message}`)
        })
}

// EVENTOS
if (loginForm) {
    loginForm.addEventListener('submit', (e)=> {
        e.preventDefault()
        loginUser()
    })
}

