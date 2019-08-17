import factory from "./factory.js"
import API from "./data.js"
import messages from "./messages.js"

const masterContainer = document.querySelector("#masterContainer")
let users = []

masterContainer.innerHTML = factory.renderLogin()
API.getData().then(parsedData => {
    users.push(parsedData)
})


//prevent refresh
if (sessionStorage.length > 0) {
    masterContainer.innerHTML = ""
    masterContainer.innerHTML = factory.renderHomepage()
    messages.getAllMessages().then(parsedData => {
        messages.renderMessage(parsedData)
        parsedData.forEach(data => {
            if (data.userId !== parseInt(sessionStorage.getItem("userId")) ) {
                document.getElementById(`messageEdit--${data.id}`).style.visibility = "hidden"
            }
        })
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
                messages.getAllMessages().then(parsedData => {
                    messages.renderMessage(parsedData)
                    parsedData.forEach(data => {
                        if (data.userId !== parseInt(sessionStorage.getItem("userId")) ) {
                            document.getElementById(`messageEdit--${data.id}`).style.visibility = "hidden"
                        }
                    })
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
                        messages.getAllMessages().then(parsedData => {
                            messages.renderMessage(parsedData)
                            parsedData.forEach(data => {
                                if (data.userId !== parseInt(sessionStorage.getItem("userId")) ) {
                                    document.getElementById(`messageEdit--${data.id}`).style.visibility = "hidden"
                                }
                            })
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

//submit new message
masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("messages__submit")) {
        const message = document.querySelector("#messages__input")
        const id = parseInt(sessionStorage.getItem("userId"))
        const newMessageObject = messages.makeMessageObject(id, message.value)
        messages.saveMessage(newMessageObject).then(() => {
            messages.getAllMessages().then(parsedData => {
                messages.renderMessage(parsedData)
                parsedData.forEach(data => {
                    if (data.userId !== parseInt(sessionStorage.getItem("userId")) ) {
                        document.getElementById(`messageEdit--${data.id}`).style.visibility = "hidden"
                    }
                })
            })
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
            messages.getAllMessages().then(parsedData => {
                messages.renderMessage(parsedData)
                parsedData.forEach(data => {
                    if (data.userId !== parseInt(sessionStorage.getItem("userId")) ) {
                        document.getElementById(`messageEdit--${data.id}`).style.visibility = "hidden"
                    }
                })
                const modal = document.querySelector(`#modal--${id}`)
                modal.close()
            })
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

// hide edit buttons
