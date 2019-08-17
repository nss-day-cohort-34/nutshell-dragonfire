import factory from "./factory.js"
import API from "./data.js"
import messages from "./messages.js"
import tasks from "./tasks.js"

const masterContainer = document.querySelector("#masterContainer")
let users = []

API.getData().then(parsedData => {
    users.push(parsedData)
})
masterContainer.innerHTML = factory.renderLogin()

//prevent refresh
if (sessionStorage.length > 0) {
    masterContainer.innerHTML = ""
    masterContainer.innerHTML = factory.renderHomepage()
    tasks.getTasksData().then(parsedData => {
        tasks.renderTasks(parsedData)
    })

}
//click login button
masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("loginButton")) {
        const loginContainer = document.querySelector("#loginContainer")
        loginContainer.innerHTML = ""
        loginContainer.innerHTML = factory.createLogin()

    }
})
//click register button
masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("registerButton")) {
        const loginContainer = document.querySelector("#loginContainer")
        loginContainer.innerHTML = ""
        loginContainer.innerHTML = factory.createRegister()

    }
})
// verify user in database
masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("signOnUser")) {
        const username = document.querySelector("#loginUsername")
        const email = document.querySelector("#loginEmail")
        API.searchAPI(username.value, email.value).then(data => {
            if (data.length === 0) {
                window.alert("Not a vaild Login")
            } else if (data.length > 0) {
                sessionStorage.setItem("userId", JSON.stringify(data[0].id))
                console.log(sessionStorage.userId)
                masterContainer.innerHTML = ""
                masterContainer.innerHTML = factory.renderHomepage()
                tasks.getTasksData().then(parsedData => {
                    tasks.renderTasks(parsedData)
                })


            }
        })
    }
})
//verify it is a new user and register
masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("create")) {
        const username = document.querySelector("#registerUsername")
        const email = document.querySelector("#registerEmail")
        const userObject = factory.makeUserObject(username.value, email.value)
        API.searchAPI(username.value, email.value).then(data => {
            if (data.length > 0) {
                window.alert("Already a Valid Username or Email")
            } else if (data.length === 0) {
                API.register(userObject).then(() => {
                    API.getData().then(parsedData => {
                        const registeredUser = parsedData.find(item => item.username === username.value)
                        sessionStorage.setItem("userId", JSON.stringify(registeredUser.id))
                        users = []
                        users.push(parsedData)
                        masterContainer.innerHTML = ""
                        masterContainer.innerHTML = factory.renderHomepage()
                        tasks.getTasksData().then(parsedData => {
                            tasks.renderTasks(parsedData)
                        })
                    })
                })
            }
        })
    }
})

masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("signOut")) {
        sessionStorage.clear()
        masterContainer.innerHTML = ""
        masterContainer.innerHTML = factory.renderLogin()
    }
})
//messages


//*******************************************/


//Tasks
const taskDueDate = document.querySelector("#taskDueDate")
const taskText = document.querySelector("#tasksText")
const deleteAllFields = (tasks) => {
    taskDueDate.value = ""
    taskText.value = ""
}

masterContainer.addEventListener("click", event => {
    if (event.target.id.startsWith("submit_button")) {
        const taskDueDate = document.querySelector("#taskDueDate")
        const taskText = document.querySelector("#tasksText")
        const hiddenEntryID = document.querySelector("#taskID")
        const dateValue = taskDueDate.value
        const taskValue = taskText.value
        const newTaskEntry = tasks.makeTasksObject(taskValue, dateValue)

        if (hiddenEntryID.value !== "") {
            tasks.editTaskEntry(newTaskEntry, hiddenEntryID.value)
                .then(tasks.getTasksData).then(parsedData => {
                    tasks.renderTasks(parsedData)
                })
                .then(deleteAllFields)

        } else {
            const taskDueDate = document.querySelector("#taskDueDate")
            const taskText = document.querySelector("#tasksText")
            const dateValue = taskDueDate.value
            const taskValue = taskText.value
            const newTaskEntry = tasks.makeTasksObject(taskValue, dateValue)
            tasks.postNewTask(newTaskEntry)
                .then(tasks.getTasksData).then(parsedData => {
                    tasks.renderTasks(parsedData)
                })
                .then(deleteAllFields)

        }
    }
})

//tasks edit/delete eventlistener

masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("delete__Task")) {
        const deleteBtnID = event.target.id.split("--")[1]
        tasks.deleteTaskEntry(deleteBtnID)
            .then(tasks.getTasksData).then(parsedData => {
                tasks.renderTasks(parsedData)
            })
    }
    if (event.target.id.startsWith("edit__Task")) {
        const entryId = event.target.id.split("--")[1]
        tasks.updateTaskEditFields(entryId)
            .then(tasks.getTasksData).then(parsedData => {
                tasks.renderTasks(parsedData)
            })

    }

})

//eventListener for task checkbox goes here:

masterContainer.addEventListener("click", (event) => {
    if (event.target.id.startsWith("completed")) {
        event.target.classList.toggle("checked");
        console.log("click")
    }
}, false);