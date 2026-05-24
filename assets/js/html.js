function returnTaskCard(task) {
    return `<div class="task-card" draggable="true" id="${task.taskId}">
                <span class="open-task">...</span>
                <h4 class="task-title" title="${task.taskTitle}">
                    ${task.taskTitle}
                </h4>
                <p class="task-desc" title="${task.taskDescription}">
                    ${task.taskDescription}
                    </p>
                <select class="status-select">
                    <option value="Backlog">Backlog</option>
                    <option value="En Curso">En Curso</option>
                    <option value="Pausado / QA">Pausado / QA</option>
                    <option value="Listo">Listo</option>
                </select>
            </div>`
}


export { returnTaskCard }