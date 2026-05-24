import {User, UserURLS, Options, showToastMessage, Storage } from "./utils.js"

const registerForm = document.querySelector('.login-form')

async function fetchUserRegistration() {
    Options.method = 'POST'
    Options.body = JSON.stringify(User)

    fetch(UserURLS.userRegisterURL, Options)
        .then((response)=> response.json())
        .then((data)=> {
            Storage.saveCookie('user_uuid', data.userData.uid)
            showToastMessage('info', 'Usuario registrado exitosamente.')
            .then((result)=> location.href = 'login.html' )
            // CAMBIAR LA COOKIE LOCAL POR UNA GENERADA POR EL BACKEND
        })
        .catch((error)=> console.error(error.message))
}

function registerUser() {
    const fPassword = document.querySelector('input#password')
    const rPassword = document.querySelector('input#repeat-password')

    User.nombreCompleto = document.querySelector('input#fullname').value
    User.email = document.querySelector('input#email').value
    User.telefono = document.querySelector('input#phone').value

    const basicUserData = (User.nombreCompleto && 
                           User.email && 
                           User.telefono && 
                           fPassword.value && 
                           rPassword.value)

    const passwordsCorrect = (fPassword.value === rPassword.value)

    if (basicUserData && passwordsCorrect) {
        User.password = fPassword.value
        fetchUserRegistration()
        // Ir a login
    } else if (!basicUserData) {
        showToastMessage('info', 'Verifica los datos ingresados.')
    } else if (!passwordsCorrect) {
        showToastMessage('warning', 'Las contraseñas no coinciden. Verifícalas por favor.')
    } else {
        showToastMessage('error', 'Error no esperado. Intenta nuevamente en unos instantes.')
    }
}

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        registerUser()
    });
}
