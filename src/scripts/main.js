import factory from "./factory.js"
import API from "./data.js"
import messages from "./messages.js"
import friends from "./friends.js"
import tasks from "./tasks.js"

const masterContainer = document.querySelector("#masterContainer")
let users = []
let friendArray = []
let messagesArray = []
masterContainer.innerHTML = factory.renderLogin()

API.getData().then(parsedData => {
    users.push(parsedData)
})
friends.getAllFriends().then(data => {
    friendArray.push(data)
})
messages.getAllMessages().then(data => {
    messagesArray.push(data)
})
const friendInterval = () => {
    const userId = parseInt(sessionStorage.getItem("userId"))
    friends.getAllFriends().then(data => {
        friendArray[0].forEach(friend => {
            if (friendArray[0].length !== data.length) {
                getRenderFriends()
                friendArray = []
                friendArray.push(data)
            } else if (friend.areFriends === false && userId === friend.userId) {
                getRenderFriends()
                console.log("HH")
                friendArray = []
                friendArray.push(data)
            }
        });
    })
}
const messageInterval = () => {
    messages.getAllMessages().then(data => {
        if (messagesArray[0].length !== data.length) {
            getRenderMessage()
            messagesArray.push(data)
        }
    })
}
setInterval(friendInterval, 3000)
setInterval(messageInterval, 3000)
//condense code for getting and rendering messages
const getRenderMessage = () => {
    messages.getAllMessages().then(parsedData => {
        messages.renderMessage(parsedData)
        parsedData.forEach(data => {
            if (data.userId !== parseInt(sessionStorage.getItem("userId"))) {
                document.getElementById(`messageEdit--${data.id}`).style.visibility = "hidden"
            }
        })
    })
}
//to get all friends on load
const getRenderFriends = () => {
    friends.getAllFriends().then(data => {
        const userId = parseInt(sessionStorage.getItem("userId"))
        const friendsContainer = document.querySelector("#friends__container")
        friendsContainer.innerHTML = ""
        data.forEach(friend => {
            if (friend.userId === userId) {
                if (friend.areFriends === true) {
                    const idea = users[0].find(user => user.id === friend.otherFriendId)
                    friends.renderFriendsList(idea.username, friend.id)
                } else if (friend.areFriends === false) {
                    const idea = users[0].find(user => user.id === friend.otherFriendId)
                    friends.renderFriendsListPending(idea.username, friend.id)
                }
            } else if (friend.otherFriendId === userId) {
                if (friend.areFriends === true) {
                    const idea = users[0].find(user => user.id === friend.userId)
                    friends.renderFriendsList(idea.username, friend.id)
                } else if (friend.areFriends === false) {
                    const idea = users[0].find(user => user.id === friend.userId)
                    friends.renderFriendsListAcceptButton(idea.username, friend.id)
                }
            }
        })
    })
}

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
                // console.log(completedTasks.length)
                tasksHTMLRender.innerHTML = ""
                // console.log(completedTasks)
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
    getRenderMessage()
    getRenderFriends()
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
                masterContainer.innerHTML = ""
                masterContainer.innerHTML = factory.renderHomepage()
                getRenderMessage()
                getRenderFriends()
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
                        getRenderMessage()
                        getRenderFriends()
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

//submit new message
masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("messages__submit")) {
        const message = document.querySelector("#messages__input")
        const id = parseInt(sessionStorage.getItem("userId"))
        const newMessageObject = messages.makeMessageObject(id, message.value)
        messages.saveMessage(newMessageObject).then(() => {
            getRenderMessage()
        })
        message.value = ""
    }
})

// open edit window
masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("messageEdit")) {
        const id = event.target.id.split("--")[1]
        const sessionId = parseInt(sessionStorage.getItem("userId"))
        messages.getOneMessage(id).then(parsedData => {
            if (parseInt(parsedData[0].userId) === sessionId) {
                const modal = document.querySelector(`#modal--${id}`)
                modal.showModal()
                const modalInput = document.querySelector(`#messageInput--${id}`)
                modalInput.value = parsedData[0].message
            }
        })
    }
})
//save edit to database and re-render
masterContainer.addEventListener("click", () => {
    const nameOfArray = event.target.id.split("--")[0]
    const ifParameter = `${nameOfArray}--save`
    if (event.target.id.startsWith(ifParameter)) {
        const id = event.target.id.split("--")[2]
        const locationID = `messageInput--${id}`
        messages.edit(nameOfArray, id, locationID).then(() => {
            getRenderMessage()
            const modal = document.querySelector(`#modal--${id}`)
            modal.close()
        })
    }
})
//close the dialog box
masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("cancelMessage")) {
        const id = event.target.id.split("--")[1]
        const modal = document.querySelector(`#modal--${id}`)
        modal.close()
    }
})

//friends
let clickedID = 0
//add friend on message username click
masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("invisibleButton")) {
        const userId = parseInt(sessionStorage.getItem("userId"))
        clickedID = parseInt(event.target.id.split("--")[1])
        friends.getAllFriends().then(data => {
            const filteredData = data.filter(friend => (friend.userId === userId || friend.otherFriendId === userId) && (friend.userId === clickedID || friend.otherFriendId === clickedID) && userId !== clickedID)
            if (filteredData.length < 1 && userId !== clickedID) {
                const usernameObject = users[0].find(user => user.id === clickedID)
                const friendHTML = friends.friendDialogBox(usernameObject)
                const friendBoxLocation = document.querySelector("#friendDialogBox")
                friends.renderFriendDialogBox(friendHTML, friendBoxLocation)
                const modal = document.querySelector("#friendModal")
                modal.showModal()
            }
        })
    }
})

//add friend
masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("friends--add")) {
        const userId = parseInt(sessionStorage.getItem("userId"))
        const newFriendObject = friends.makeFriendObject(userId, clickedID, false)
        friends.addFriend(newFriendObject).then(data => {
            const modal = document.querySelector("#friendModal")
            modal.close()
            getRenderFriends()
        })
    }
})

//cancel modal
masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("cancelFriend")) {
        const modal = document.querySelector("#friendModal")
        modal.close()
    }
})
//accept friend
masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("friends--acceptFriend")) {
        const nameOfArray = event.target.id.split("--")[0]
        const id = event.target.id.split("--")[2]
        friends.getOneFriend(id).then(friendship => {
            const otherFriendId = friendship[0].userId
            messages.edit(nameOfArray, id, otherFriendId).then(() => {
                getRenderFriends()
            })
        })
    }
})

//delete friend
masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("deleteFriend")) {
        const deleteId = event.target.id.split("--")[1]
        friends.deleteFriend(deleteId).then(() => {
            getRenderFriends()
        })
    } else if (event.target.id.startsWith("denyFriend")) {
        const deleteId = event.target.id.split("--")[1]
        friends.deleteFriend(deleteId).then(() => {
            getRenderFriends()
        })
    }
})

//add friend search
masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("searchFriend")) {
        const friendsDialogBox = friends.addFriendDialogBox()
        const friendDialogBoxLocation = document.querySelector("#addFriendContainer")
        friends.renderFriendDialogBox(friendsDialogBox, friendDialogBoxLocation)
        const modal = document.querySelector("#addFriendModal")
        modal.showModal()
    }
})

//cancel modal
masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("CancelFriendSearch")) {
        const modal = document.querySelector("#addFriendModal")
        modal.close()
    }
})

//search for friend
masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("friends--search")) {
        const modal2 = document.querySelector("#addFriendModal")
        modal2.close()
        const textValue = document.querySelector("#searchFriend")
        const userId = parseInt(sessionStorage.getItem("userId"))
        const desiredFriendId = users[0].find(user => user.username === textValue.value)
        clickedID = desiredFriendId.id
        friends.getAllFriends().then(data => {
            const filteredData = data.filter(friend => (friend.userId === userId || friend.otherFriendId === userId) && (friend.userId === desiredFriendId.id || friend.otherFriendId === desiredFriendId.id) && userId !== desiredFriendId.id)
            if (filteredData.length < 1 && userId !== desiredFriendId.id) {
                const usernameObject = users[0].find(user => user.id === desiredFriendId.id)
                const friendHTML = friends.friendDialogBox(usernameObject)
                const friendBoxLocation = document.querySelector("#friendDialogBox")
                friends.renderFriendDialogBox(friendHTML, friendBoxLocation)
                const modal = document.querySelector("#friendModal")
                modal.showModal()
            }
        })
    }
})
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
        // console.log(checkbox)
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
