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

//TASKS filtering by UserId
//make new array with data that I need and pass in to the renderTasks function
const getRenderTasks = () => {
    tasks.getTasksData().then(parsedData => {
        const tasksHTMLRender = document.querySelector("#tasksRender")
        const tasksHTMLRenderCompleted = document.querySelector("#completedTasks")
        let usersTasks = []
        let completedTasks = []
        const userId = parseInt(sessionStorage.getItem("userId"))
        parsedData.forEach(task => {
            if (task.completed === false && task.userId === userId) {
                usersTasks.push(task)
                tasks.renderTasks(usersTasks)
            } else if (task.completed === true && task.userId === userId) {
                completedTasks.push(task)
                tasks.renderCompletedTasks(completedTasks)
            } else if (completedTasks.length === 0) {
                console.log(completedTasks.length)
                tasksHTMLRender.innerHTML = ""
                console.log(completedTasks)
            } else if (usersTasks.length === 0) {
                tasksHTMLRenderCompleted.innerHTML = ""
            }
        });
    })
}



//prevent refresh
if (sessionStorage.length > 0) {
    masterContainer.innerHTML = ""
    masterContainer.innerHTML = factory.renderHomepage()
    getRenderTasks()

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
                getRenderTasks()


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
                        getRenderTasks()
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
        const checkbox = document.querySelector(".completed").checked
        console.log(checkbox)
        // const checkboxValue = checkbox.value
        const taskDueDate = document.querySelector("#taskDueDate")
        const taskText = document.querySelector("#tasksText")
        const hiddenEntryID = document.querySelector("#taskID")
        const dateValue = taskDueDate.value
        const taskValue = taskText.value
        const userId = parseInt(sessionStorage.getItem("userId"))
        const newTaskEntry = tasks.makeTasksObject(userId, taskValue, dateValue, checkbox)

        if (hiddenEntryID.value !== "") {
            tasks.editTaskEntry(newTaskEntry, hiddenEntryID.value).then(() => {
                getRenderTasks()
                deleteAllFields()
            })


        } else {
            const checkbox = document.querySelector(".completed").checked

            // const checkboxValue = checkbox.value
            const taskDueDate = document.querySelector("#taskDueDate")
            const userId = parseInt(sessionStorage.getItem("userId"))
            const taskText = document.querySelector("#tasksText")
            const dateValue = taskDueDate.value
            const taskValue = taskText.value
            const newTaskEntry = tasks.makeTasksObject(userId, taskValue, dateValue, checkbox)
            tasks.postNewTask(newTaskEntry).then(() => {
                getRenderTasks()
                deleteAllFields()
            })


        }
    }
})

//tasks delete event listener


masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("delete__Task")) {
        const deleteBtnID = event.target.id.split("--")[1]
        tasks.deleteTaskEntry(deleteBtnID)
        getRenderTasks()
    }
    if (event.target.id.startsWith("edit__Task")) {
        const entryId = event.target.id.split("--")[1]
        console.log("click")
        tasks.updateTaskEditFields(entryId)
        getRenderTasks()
    }
})

// const editButton = document.querySelector("edit__Task")
// editButton.addEventListener("keyup", (event) => {
//     if (event.keyCode === 13) {
//         // Cancel the default action, if needed
//         event.preventDefault();
//         // Trigger the button element with a click
//         document.getElementById("edit__Task").click();
//         console.log("keyup")
//     }
// });



//this targets the item we want to mark completed and adds "checked" class to it that strike-throughs and lowers opacity
masterContainer.addEventListener("click", (event) => {
    if (event.target.id.startsWith("completed")) {
        const checkbox = document.querySelector("#completed")
        const id = event.target.id.split("--")[1]
        const newID = `#taskLine--${id}`
        tasks.getOneTask(id).then(data => {
            if (data[0].completed === false) {
                const trueDataObject = tasks.makeTaskTrue(data[0].userId, data[0].task, data[0].date, true)
                tasks.editTaskEntry(trueDataObject, id).then(() => {
                    // document.querySelector(newID).classList.toggle("checked")
                    getRenderTasks()
                })
            } else {
                const trueDataObject = tasks.makeTaskTrue(data[0].userId, data[0].task, data[0].date, false)
                tasks.editTaskEntry(trueDataObject, id).then(() => {
                    getRenderTasks()
                })
            }
        })
    }
});

//Toggle button to show completed tasks
masterContainer.addEventListener("click", (event) => {
    if (event.target.id.startsWith("delete_completed")) {
        const completedTasks = document.querySelectorAll(".checked")
        console.log(completedTasks)
        completedTasks[0].classList.toggle("hidden")
    }

})