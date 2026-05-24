import { Options, projectsAndTasksURLS, 
         showToastMessage, Storage } from "./utils.js"
import { returnTaskCard } from "./html.js"

const projectsArray = []
const tasksArray = []
const btnNewProject = document.querySelector('button#new-project-btn')
const btnCreateProject = document.querySelector('button#create-project-btn')

// --- Dialog New Project and Elements ---
const dialogNewProject = document.querySelector('dialog#new-project-dialog')
const inputProjectId = document.querySelector('input#project-id')
const inputProjectName = document.querySelector('input#project-title')
const inputProjectDesc = document.querySelector('textarea#project-desc')
const pCreatedAt = document.querySelector('p.p-created-at')

// --- Lógica del Panel Lateral (Sidebar) ---
const toggleBtn = document.getElementById('toggle-sidebar-btn')
const sidebar = document.getElementById('sidebar')
const columns = document.querySelectorAll('.kanban-column')

// --- Lógica de Drag and Drop y Sincronización de Combos ---
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
})

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
})

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