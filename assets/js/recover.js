// js/recover.js
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.recovery-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('email');
            const email = emailInput.value;

            // Aquí iría la lógica real de llamada a API para resetear contraseña
            console.log(`Intentando recuperar contraseña para: ${email}`);

            // Simulación de éxito con SweetAlert2
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Si existe su email en nuestro registro, le será enviado un link de reset.',
                confirmButtonText: 'Entendido'
            });

            // Opcional: Limpiar el campo después del éxito simulado
            emailInput.value = '';
        });
    }
});