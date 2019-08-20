//Tasks API data here -- Brian Wilson

//get all tasks
const getTasksData = () => {
    return fetch("http://localhost:8088/tasks")
        .then(data => data.json())
}

//get one task
const getOneTask = (id) => {
    return fetch(`http://localhost:8088/tasks?id=${id}`)
        .then(data => data.json())
}

//post new task
const postNewTask = (task) => {
    return fetch("http://localhost:8088/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    })
}

//delete task
const deleteTaskEntry = (deleteBtnId) => {
    return fetch(`http://localhost:8088/tasks/${deleteBtnId}`, {
            method: "DELETE",
        })
        .then(response => response.json())
}

//edit task
const editTaskEntry = (updatedObject, id) => {
    return fetch(`http://localhost:8088/tasks/${id}`, {
            "method": "PUT",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(updatedObject)

        })
        .then(response => response.json())
}

//update task fields
const updateTaskEditFields = (id) => {
    const hiddenEntryID = document.querySelector("#taskID")
    const checkbox = document.querySelector(".completed").checked
    //variables to hold DOM locations for form fields
    const taskDueDate = document.querySelector("#taskDueDate")
    const taskText = document.querySelector("#tasksText")
    return fetch(`http://localhost:8088/tasks/${id}`)
        .then(response => response.json())
        .then(task => {
            hiddenEntryID.value = task.id
            taskDueDate.value = task.date
            taskText.value = task.task
        })
}

//Factory function here:

const tasksHTML = (messageObject) => {
    return `
    <article id="taskField" class="taskField">
    <span id="taskLine--${messageObject.id}"><input type=checkbox class="completed" name=completed id=completed--${messageObject.id}  value="yes">
    ${messageObject.task}
    (Due: ${messageObject.date})
    <button class="edit-button" id="edit__Task--${messageObject.id}">Edit</button>
    <button class="delete-button" id="delete__Task--${messageObject.id}">Delete</button>
    </span>
    <br>
    <hr>
    </article>`
}

const tasksHTMLChecked = (messageObject) => {
    return `
    <article id="taskField" class="taskField">
    <span id="taskLine--${messageObject.id}" class="checked"><input type=checkbox class="completed" name=completed id=completed--${messageObject.id}  value="yes" checked>
    ${messageObject.task}
    (Due: ${messageObject.date})
    <button class="edit-button" id="edit__Task--${messageObject.id}">Edit</button>
    <button class="delete-button" id="delete__Task--${messageObject.id}">Delete</button></span>
    <br>
    <hr>
    </article>`
}

//object for tasks
const makeTasksObject = (userId, task, date, result) => {
    return {
        userId: userId,
        task: task,
        date: date,
        completed: result

    }
}
const makeTaskTrue = (userId, task, date, boolean) => {
    return {
        userId: userId,
        task: task,
        date: date,
        completed: boolean

    }
}

//Dom and Render functions

//get tasks and render to the dom
const renderTasks = (tasks) => {
    const tasksHTMLRender = document.querySelector("#tasksRender")
    tasksHTMLRender.innerHTML = ""
    tasks.forEach(task => {
        const convertedTask = tasksHTML(task)
        tasksHTMLRender.innerHTML += convertedTask
    });
}

const renderCompletedTasks = (tasks) => {
    const tasksHTMLRender = document.querySelector("#completedTasks")
    tasksHTMLRender.innerHTML = ""
    tasks.forEach(task => {
        const convertedTask = tasksHTMLChecked(task)
        tasksHTMLRender.innerHTML += convertedTask
    });
}


export default {
    getTasksData,
    postNewTask,
    deleteTaskEntry,
    editTaskEntry,
    updateTaskEditFields,
    tasksHTML,
    makeTasksObject,
    renderTasks,
    getOneTask,
    renderCompletedTasks,
    makeTaskTrue
}