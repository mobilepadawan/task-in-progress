// --- Lógica del Panel Lateral (Sidebar) ---
const toggleBtn = document.getElementById('toggle-sidebar-btn');
const sidebar = document.getElementById('sidebar');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
});

// --- Lógica de Drag and Drop y Sincronización de Combos ---
const cards = document.querySelectorAll('.task-card');
const columns = document.querySelectorAll('.kanban-column');

cards.forEach(card => {
    // Al empezar a arrastrar
    card.addEventListener('dragstart', () => {
        card.classList.add('dragging');
    });

    // Al soltar el arrastre
    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });

    // Sincronizar select manual: cambiar de columna si cambian el selector de estado
    const select = card.querySelector('.status-select');
    select.addEventListener('change', (e) => {
        const targetStatus = e.target.value;
        const targetColumn = document.querySelector(`.kanban-column[data-status="${targetStatus}"] .cards-container`);
        if (targetColumn) {
            targetColumn.appendChild(card);
        }
    });
});

columns.forEach(column => {
    const container = column.querySelector('.cards-container');

    // Permitir soltar elementos en la columna
    column.addEventListener('dragover', (e) => {
        e.preventDefault(); // Requerido para permitir el drop
        column.classList.add('drag-over');
    });

    column.addEventListener('dragleave', () => {
        column.classList.remove('drag-over');
    });

    column.addEventListener('drop', () => {
        column.classList.remove('drag-over');
        const draggingCard = document.querySelector('.dragging');

        if (draggingCard) {
            container.appendChild(draggingCard);

            // Sincronizar el select interno de la card con el estado de la nueva columna
            const newStatus = column.getAttribute('data-status');
            const select = draggingCard.querySelector('.status-select');
            if (select) {
                select.value = newStatus;
            }
        }
    });
});