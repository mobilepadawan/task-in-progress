const User = {
    uid: '',
    nombreCompleto: '',
    email: '',
    telefono: '',
    password: '',
    createdAt: '',
    userToken: ''
}

const UserURLS = {
    userRegisterURL: "https://task-in-progress-backend.onrender.com/api/v1/user-register",
    userLoginURL: "https://task-in-progress-backend.onrender.com/api/v1/user-login"
}

const projectsAndTasksURLS = {
    getAllProjectsURL: "https://task-in-progress-backend.onrender.com/api/v1/get-all-projects",
    postNewProjectURL: "https://task-in-progress-backend.onrender.com/api/v1/create-project",
    getAllTasksURL: "https://task-in-progress-backend.onrender.com/api/v1/get-all-tasks",
    postNewTaskURL: "https://task-in-progress-backend.onrender.com/api/v1/create-task"
}

const Options = {
    method: '',
    headers: {
        "Content-Type": "application/json"
    },
    body: ''
}

class Storage {
    static saveCookie(name, value) {
        const encondedValue = encodeURIComponent(value)
        // const tamanioTotal = name.length + encondedValue.length
        // console.log('Tamaño de la cookie:', tamanioTotal)
        // debug
        cookieStore.set(name, encondedValue)
        .then(()=> console.log("Ok"))
        .catch((error) => {
            console.log(error.message)
            throw new Error(`Error inesperado: ${error.message}`)
        })
    }

    static getCookie(name) {
        cookieStore.get(name)
            .then((cookie) => {
                if (cookie.value !== null) {
                    const decodedValue = decodeURIComponent(cookie.value)
                    return decodedValue
                } else {
                    return "N/A"
                }
            })
            .catch((error) => {
                throw new Error(`Error inesperado recuperando la Cookie: ${name}`)
            })
    }

    static saveSessionToken(name, value) {
        const encondedValue = encodeURIComponent(value)
        localStorage.setItem(name, encondedValue)
        console.log("Ok")
    }

    static getSessionToken(name) {
        const decodedValue = decodeURIComponent(localStorage.getItem(name))

        if (!decodedValue) {
            return "Error"
        } else {
            return decodedValue
        }
    }
}

function showToastMessage(icon, message) {
    return Swal.fire({
        toast: true,
        theme: 'dark',
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: icon,
        text: message
    })
}

export { User, UserURLS, Options, showToastMessage, Storage, projectsAndTasksURLS }