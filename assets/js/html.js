function returnTaskCard(task) {
    const taskStatus = task.taskStatus || task.status || 'Backlog'
    const getSelected = (option) => taskStatus === option ? 'selected' : ''

    return `<div class="task-card" draggable="true" id="${task.taskId}" data-task-status="${taskStatus}">
                <span class="open-task">...</span>
                <h4 class="task-title" title="${task.taskTitle}">
                    ${task.taskTitle}
                </h4>
                <p class="task-desc" title="${task.taskDescription}">
                    ${task.taskDescription}
                    </p>
                <select class="status-select">
                    <option value="Backlog" ${getSelected('Backlog')}>Backlog</option>
                    <option value="En Curso" ${getSelected('En Curso')}>En Curso</option>
                    <option value="Pausado / QA" ${getSelected('Pausado / QA')}>Pausado / QA</option>
                    <option value="Listo" ${getSelected('Listo')}>Listo</option>
                </select>
            </div>`
}

export { returnTaskCard }