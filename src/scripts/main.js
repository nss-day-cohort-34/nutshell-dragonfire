import factory from "./factory.js"
import API from "./data.js"
import messages from "./messages.js"



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
    API.getEventsData().then(parsedData => {
        factory.renderEvents(parsedData)
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
                API.getEventsData().then(parsedData => {
                    factory.renderEvents(parsedData)
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
                        API.getEventsData().then(parsedData => {
                            factory.renderEvents(parsedData)
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



// event Doms and main.j



const clearForm = () => {
    eventName.value = ""
    location.value = ""
}

document.querySelector("#submitButton").addEventListener("click", event => {

    const date = document.querySelector("#eventDate").value
    const userId = parseInt(sessionStorage.getItem("userId"))
    const eventName = document.querySelector("#eventName").value
    const location = document.querySelector("#eventLocation").value
    const hiddenInputId = document.querySelector("#eventsId")
    console.log("I'm POSTING")
    const newEventEntry = {
        date: date,
        userId: userId,
        eventName: eventName,
        location: location
    };

    if (hiddenInputId.value !== "") {
        API.editEvents(newEventEntry, hiddenInputId.value).then(() => {
            API.getEventsData(data => {
                factory.renderEvents(data)
            })
        })
    } else {
        API.saveEventsData(newEventEntry)
            .then(API.getEventsData).then(parsedData => {
                factory.renderEvents(parsedData)
            }).then(clearForm)
    }
})





masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("deleteEvent--")) {
        const deleteEntry = event.target.id.split("--")[1]
        console.log("deleteId", deleteEntry)

        API.deleteEvent(deleteEntry).then(API.getEventsData).then(parsedData => {
            factory.renderEvents(parsedData)
        }).then(clearForm)
    }
})

masterContainer.addEventListener("click", () => {
            if (event.target.id.startsWith("editEvent")) {
                const editEventEntry = event.target.id.split("--")[1]
                console.log("hi im edit", editEventEntry)
                API.updateFormFields(editEventEntry)
            }
            })