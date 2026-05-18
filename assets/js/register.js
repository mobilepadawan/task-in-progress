const registerForm = document.querySelector('.login-form');

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const password = document.getElementById('password').value;
        const repeatPassword = document.getElementById('repeat-password').value;

        if (password !== repeatPassword) {
            alert('Las contraseñas no coinciden. Por favor, verifícalas.');
            return;
        }

        // Simulación de registro exitoso y redirección al login
        window.location.href = 'login.html';
    });
}