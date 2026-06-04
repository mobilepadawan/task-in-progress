import { Options, projectsAndTasksURLS, 
         showToastMessage, Storage } from "./utils.js"
import { returnTaskCard } from "./html.js"

const projectsArray = []
const tasksArray = []
const btnNewTask = document.querySelector('button#new-task-btn')
const btnNewProject = document.querySelector('button#new-project-btn')

// --- Dialog New Project and Elements ---
const dialogNewProject = document.querySelector('dialog#new-project-dialog')
const inputProjectId = document.querySelector('input#project-id')
const inputProjectName = document.querySelector('input#project-title')
const inputProjectDesc = document.querySelector('textarea#project-desc')
const pCreatedAt = document.querySelector('p.p-created-at')
const btnCreateProject = document.querySelector('button#create-project-btn')

// --- Dialog New Project and Elements ---
const dialogNewTask = document.querySelector('dialog#new-task-dialog')
const inputTaskId = document.querySelector('input#new-task-id')
const inputTaskTitle = document.querySelector('input#new-task-title')
const inputTaskDesc = document.querySelector('textarea#new-task-desc')
const labelFechaAlta = document.querySelector('span#label-date-created')
const labelFechaInicio = document.querySelector('span#label-date-started')
const labelFechaFin = document.querySelector('span#label-date-ended')
const labelEstado = document.querySelector('span#label-task-status')
const btnCreateTask = document.querySelector('button#confirm-create-task-btn')

// --- Lógica del Panel Lateral (Sidebar) ---
const toggleBtn = document.querySelector('button#toggle-sidebar-btn')
const sidebar = document.querySelector('.sidebar')

// --- Lógica de Drag and Drop y Sincronización de Combos ---
const columns = document.querySelectorAll('.kanban-column')
const cards = document.querySelectorAll('.task-card')

// Funciones Principales

function validarToken() {
    const token = Storage.getSessionToken('knbntkn')

    if (token === "Error") {
        showToastMessage('error', 'Usuario no identificado.')
        .then((r)=> location.href = 'login.html')
    } else {
        obtenerProyectos()
    }
}

function seleccionarProyecto(pId) {
    localStorage.setItem('projectSelected', pId)
    const activeProject = document.querySelector(`li[data-project-id="${pId}"]`)
    activeProject.classList.add('active')
}

function limpiarProyectoActivo() {
    const projectItems = document.querySelectorAll('li.project-item')
    if (projectItems.length > 0) {
        projectItems.forEach((pItem)=> pItem.classList.remove('active'))
    }    
}

function obtenerProyectos() {
    let toastIcon = 'info'
    const kanbantokensession = Storage.getSessionToken('knbntkn')
    Options.method = 'GET'
    Options.headers['kanbantoken'] = kanbantokensession // para forzar error: +'aa'
    delete Options.body

    fetch(projectsAndTasksURLS.getAllProjectsURL, Options)
    .then((response)=> {
        if (response.ok) {
            return response.json()
        } else {
            toastIcon = 'warning'
            throw new Error('Error obteniendo proyectos.')
        }
    })
    .then((data)=> {
        // console.table(data)
        if (data.success) {
            projectsArray.length = 0
            projectsArray.push(...data.projects)
            listarProyectos()
        } else {
            toastIcon = 'info'
            throw new Error('No existen proyectos para listar.')
        }
    })
    .catch((error)=> {
        showToastMessage(toastIcon, error.message)
    })
}

function listarProyectos() {
    if (projectsArray.length > 0) {
        const projectItems = []
        const projectList = document.querySelector('ul.project-list')

        projectsArray.forEach((project)=> {
            const liProject = document.createElement('li')
            liProject.classList.add('project-item')
            liProject.textContent = `📂 ${project.projectName}`
            liProject.title = project.projectDescription
            liProject.dataset.projectId = project.projectId
            liProject.dataset.projectStatus = project.status
            liProject.addEventListener('click', ()=> {
                limpiarProyectoActivo()
                seleccionarProyecto(liProject.dataset.projectId)
                obtenerTareas(liProject.dataset.projectId)
            })
            projectItems.push(liProject)
        })
        projectList.innerHTML = ""
        projectList.append(...projectItems)
    } else {
        showToastMessage('info', 'No hay proyectos para listar.')
    }
}

function obtenerTareas(pId) {
    let toastIcon = 'info'
    const kanbantokensession = Storage.getSessionToken('knbntkn')
    Options.method = 'GET'
    Options.headers['kanbantoken'] = kanbantokensession // para forzar error: +'aa'
    delete Options.body

    const getTasksEndpoint = new URL(`${projectsAndTasksURLS.getAllTasksURL}/${pId}`)

    fetch(getTasksEndpoint, Options)
    .then((response)=> {
        if (response.ok) {
            return response.json()
        } else {
            toastIcon = 'warning'
            throw new Error('Error obteniendo las tareas.')
        }
    })
    .then((data)=> {
        limpiarColumnasTareas()
        if (data.success && data.tasks.length > 0) {
            tasksArray.length = 0
            tasksArray.push(...data.tasks)
            cargarTareas(tasksArray)
        } else {
            toastIcon = 'info'
            throw new Error('No existen tareas para listar.')
        }
    })
    .catch((error)=> {
        showToastMessage(toastIcon, error.message)
    })
}

function limpiarColumnasTareas() {
    const taskCols = document.querySelectorAll('div.cards-container')
    taskCols.length > 0 && taskCols.forEach((col)=> col.innerHTML = '')
}

function cargarTareas(tasksArray) {

    if (tasksArray.length > 0) {
        const divCardsContainerBacklog = document.querySelector('div.cards-container[data-containername="Backlog"]')
        let taskCardsHTML = ''
        tasksArray.forEach((task)=> {
            taskCardsHTML += returnTaskCard(task)
        })
        divCardsContainerBacklog.innerHTML = taskCardsHTML
    }
}

// FUNCION PRINCIPAL
validarToken()

// EVENTOS

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('hidden')
})

btnNewProject.addEventListener('click', ()=> {
    dialogNewProject.showModal()
    dialogNewProject.addEventListener('close', ()=> {
        inputProjectId.classList.remove('green-highlight')
        btnCreateProject.removeAttribute('disabled')
        inputProjectId.value = ''
        inputProjectName.value = ''
        inputProjectDesc.value = ''
    })
})

btnNewTask.addEventListener('click', ()=> {
    dialogNewTask.showModal()
    dialogNewTask.addEventListener('close', ()=> {
        inputTaskId.value = ''
        inputTaskTitle.value = ''
        inputTaskDesc.value = ''
        labelFechaAlta.textContent = ''
        labelFechaInicio.textContent = '' 
        labelFechaFin.textContent = ''
        labelEstado.textContent = ''
    })
})

btnCreateProject.addEventListener('click', (e)=> {
    e.preventDefault()

    if (inputProjectName && inputProjectDesc) {
        const newProject = {
            projectName: inputProjectName.value,
            projectDescription: inputProjectDesc.value 
        }

        let toastIcon = 'info'
        const kanbantokensession = Storage.getSessionToken('knbntkn')

        Options.method = 'POST'
        Options.headers['kanbantoken'] = kanbantokensession
        Options.body = JSON.stringify(newProject)

        fetch(projectsAndTasksURLS.postNewProjectURL, Options)
        .then((response)=> {
            if (response.ok) {
                return response.json()
            } else {
                toastIcon = 'warning'
                throw new Error('Error al intentar crear un nuevo proyecto.')
            }
        })
        .then((data)=> {
            inputProjectId.value = data.projectId
            pCreatedAt.textContent += new Date(data.createdAt).toLocaleDateString()
            inputProjectId.classList.add('green-highlight')
            btnCreateProject.setAttribute('disabled', 'true')
            showToastMessage('success', 'Proyecto creado exitosamente.')
            .then((r)=> obtenerProyectos())
        })
        .catch((error)=> {
            showToastMessage(toastIcon, error.message)
        })
    }
})

btnCreateTask.addEventListener('click', (e)=> {
    e.preventDefault()

    if (inputTaskTitle && inputTaskDesc) {

        let toastIcon = 'info'
        const kanbantokensession = Storage.getSessionToken('knbntkn')
        const projectId = Storage.getSessionToken('projectSelected')

        const newTask = {
            taskTitle: inputTaskTitle.value,
            taskDescription: inputTaskDesc.value 
        }

        Options.method = 'POST'
        Options.headers['kanbantoken'] = kanbantokensession
        Options.body = JSON.stringify(newTask)

        const postNewTaskEndpoint = new URL(`${projectsAndTasksURLS.postNewTaskURL}/${projectId}`)

        fetch(postNewTaskEndpoint, Options)
        .then((response)=> {
            if (response.ok) {
                return response.json()
            } else {
                toastIcon = 'warning'
                throw new Error('Error al intentar crear una nueva tarea.')
            }
        })
        .then((data)=> {
            console.table(data)
            inputTaskId.value = data.taskId 
            labelFechaAlta.textContent = new Date(data.createdAt).toLocaleDateString()
            inputTaskId.classList.add('green-highlight')
            btnCreateTask.setAttribute('disabled', 'true')

            showToastMessage('success', 'Tarea creada exitosamente.')
            .then((r)=> {
                dialogNewTask.close()
                obtenerTareas(projectId)
            })
        })
        .catch((error)=> {
            showToastMessage(toastIcon, error.message)
        })
    }
})

// MANEJO DE DRAG AND DROP

document.addEventListener('DOMContentLoaded', () => {
    const taskCards = document.querySelectorAll('.task-card')
    // Seleccionamos todos los contenedores de tarjetas (las zonas de drop)
    const cardsContainers = document.querySelectorAll('.cards-container') 

    /**
     * Simula el envío del estado actualizado al backend/API.
     * @param {string} taskId - El ID único de la tarea.
     * @param {string} newStatus - El nuevo estado (ej: 'Listo', 'En Curso').
     */
    function updateTaskStatus(taskId, newStatus) {
        console.log(`==============================================`)
        console.log(`[BACKEND CALL]: Enviando actualización para Tarea ID: ${taskId}`)
        console.log(`[BACKEND CALL]: Nuevo Estado Detectado: ${newStatus}`)
        // Aquí iría tu Fetch API call, Axios request o función de librería
        // Ejemplo: fetch('/api/tasks/' + taskId).then(r => r.put({ status: newStatus }))
        console.log(`[BACKEND CALL]: Actualización simulada completada.`)
        console.log(`==============================================`)
    }

    // 1. HACER LOS ELEMENTOS ARRASTRABLES (DRAGGABLE)
    taskCards.forEach(card => {
        // Aseguramos que el elemento sea arrastrable
        card.setAttribute('draggable', 'true')

        // Evento cuando comienza a arrastrar la tarjeta
        card.addEventListener('dragstart', (e) => {
            const taskId = e.target.id
            console.log(`Iniciando drag para Tarea ID: ${taskId}`)
            
            // Creamos un efecto visual temporal al arrastrar 
            e.dataTransfer.setData('text/plain', taskId)

            // Opcional: Añadir una clase de "arrastrando" para CSS visual
            setTimeout(() => e.target.classList.add('dragging'), 0)
        })

        // Evento cuando deja de arrastrar (independientemente del resultado)
        card.addEventListener('dragend', (e) => {
             e.target.classList.remove('dragging')
        })
    })


    // 2. ASIGNAR EVENTOS DE DROP A CADA COLUMNA (CONTENEDORES)
    cardsContainers.forEach(container => {
        const column = container.closest('.kanban-column')
        if (!column) return // Seguridad

        // --- Drag Over: Debe prevenir el comportamiento por defecto para que sea un drop zone válido ---
        container.addEventListener('dragover', (e) => {
            e.preventDefault() 
            // Aquí puedes añadir clases de resaltado visual al contenedor objetivo
            console.log(`Dragover detectado sobre ${column.dataset.status}`)
        })

        // --- Drag Enter: Feedback visual cuando el elemento entra en la zona ---
        container.addEventListener('dragenter', (e) => {
            e.preventDefault()
            // Añadir clase de feedback (Ej: container.classList.add('highlight'))
        })
        
        // --- Drop: La lógica principal se ejecuta aquí ---
        container.addEventListener('drop', (e) => {
            e.preventDefault()

            // 1. Recuperar la tarjeta arrastrada
            const draggedCard = document.querySelector('.task-card[data-id="' + e.dataTransfer.getData('text/plain') + '"]')
            if (!draggedCard) return

            // 2. Obtener el nuevo estado de la columna destino
            // El estado está definido en data-status del contenedor padre .kanban-column
            const newStatus = column.dataset.status 
            
            console.log(`\n--- DROP DETECTADO ---`)
            console.log(`Origen: ${draggedCard.dataset.originalStatus || 'N/A'}`)
            console.log(`Destino (Nuevo Estado): ${newStatus}`)

            // =============================================
            // 🚀 PASO CRÍTICO A: ACTUALIZAR EL DOM Y EL ESTADO INTERNO
            // =============================================
            
            // 3. Mover la tarjeta arrastrada al nuevo contenedor
            container.appendChild(draggedCard)

            // 4. Detectar y actualizar el <select> interno de la card
            const selectElement = draggedCard.querySelector('.status-select')
            if (selectElement) {
                // Establecer el valor del select al nuevo estado
                selectElement.value = newStatus
                console.log(`[UI Update] Select actualizado a: ${newStatus}`)

                // 5. LLAMAR A LA FUNCIÓN DE BACKEND
                const taskId = draggedCard.id
                updateTaskStatus(taskId, newStatus)
            } else {
                console.error("No se encontró el select element en la tarjeta.")
            }
        })

        // Opcional: Limpiar feedback cuando sale de la zona
        container.addEventListener('dragleave', (e) => {
             // Remover clases de highlight aquí
        })

    })
})
