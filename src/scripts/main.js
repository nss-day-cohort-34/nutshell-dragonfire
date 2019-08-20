import factory from "./factory.js"
import API from "./data.js"
import messages from "./messages.js"
import friends from "./friends.js"

const masterContainer = document.querySelector("#masterContainer")
let users = []

masterContainer.innerHTML = factory.renderLogin()
API.getData().then(parsedData => {
    users.push(parsedData)
})
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
        const friendsArray = []
        const usernameArray = []
        const pendingUsername = []
        const finalPendingArray = []
        const pendingUsernameAcceptButton = []
        const finalPendingArrayAcceptButton = []
        const userId = parseInt(sessionStorage.getItem("userId"))
        data.forEach(friend => {
            if (friend.userId === userId) {
                if (friend.areFriends === true) {
                    friendsArray.push(friend.otherFriendId)
                } else if (friend.areFriends === false) {
                    pendingUsername.push(friend.otherFriendId)
                }
                friendsArray.forEach(friend => {
                    const idea = users[0].find(user => user.id === friend)
                    usernameArray.push(idea.username)
                });
                pendingUsername.forEach(friend => {
                    const idea = users[0].find(user => user.id === friend)
                    finalPendingArray.push(idea.username)
                });
                const usernameSet = new Set(usernameArray)
                const pendingSet = new Set(finalPendingArray)
                friends.renderFriendsList(usernameSet, friend.id)
                friends.renderFriendsListPending(pendingSet, friend.id)
            } else if (friend.otherFriendId === userId) {
                if (friend.areFriends === true) {
                    friendsArray.push(friend.userId)
                } else if (friend.areFriends === false) {
                    pendingUsernameAcceptButton.push(friend.userId)
                }
                friendsArray.forEach(friend => {
                    const idea = users[0].find(user => user.id === friend)
                    usernameArray.push(idea.username)
                });
                pendingUsernameAcceptButton.forEach(friend => {
                    const idea = users[0].find(user => user.id === friend)
                    finalPendingArrayAcceptButton.push(idea.username)
                });
                const usernameSet = new Set(usernameArray)
                const pendingSet = new Set(finalPendingArrayAcceptButton)
                friends.renderFriendsList(usernameSet, friend.id)
                friends.renderFriendsListAcceptButton(pendingSet, friend.id)
            }
        })
    })
}

//prevent refresh
if (sessionStorage.length > 0) {
    masterContainer.innerHTML = ""
    masterContainer.innerHTML = factory.renderHomepage()
    getRenderMessage()
    getRenderFriends()
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
                friends.renderFriendDialogBox(friendHTML)
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
        console.log("sidjnfg")
    }
})
