//Tasks API data here

//get all tasks
const getTasksData = () => {
    return fetch("http://localhost:8088/tasks")
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
    const hiddenEntryId = document.querySelector("#entryId")
    //variables to hold DOM locations for form fields
    const taskDueDate = document.querySelector("#taskDueDate")
    const taskText = document.querySelector("#tasksText")
    return fetch(`http://localhost:8088/tasks/${id}`)
        .then(response => response.json())
        .then(task => {
            hiddenEntryId.value = task.id
            taskDueDate.value = task.date
            taskText.value = task.task
        })
}

//Factory function here:

const tasksHTML = (messageObject) => {
    return `
    <article id="taskField--${messageObject.id}" class="taskField">
    <input type="checkbox">
    <span>${messageObject.task}</span>
    <p>Due Date: ${messageObject.date}</p>
    <button class="edit-button" id="edit_Entry--${messageObject.id}">Edit Task</button>
    <button class="delete-button" id="delete_Entry--${messageObject.id}">Delete Task</button>
    <br>
    <hr>
    </article>`
}

//object for tasks
const makeTasksObject = (task, date) => {
    return {
        task: task,
        date: date
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


export default {
    getTasksData,
    postNewTask,
    deleteTaskEntry,
    editTaskEntry,
    updateTaskEditFields,
    tasksHTML,
    makeTasksObject,
    renderTasks
}