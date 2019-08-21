import factory from "./factory.js"
import API from "./data.js"
import messages from "./messages.js"



const masterContainer = document.querySelector("#masterContainer")
let users = []

API.getData().then(parsedData => {
    users.push(parsedData)
})

const getEventsByDate = () => {
    API.getEventsData().then(parsedData => {
        const savedSortArray = parsedData.sort((a, b) => {
            const dateA = new Date(a.date),
                dateB = new Date(b.date)
            return dateA - dateB
        })
        factory.renderEvents(savedSortArray)
    })
}
masterContainer.innerHTML = factory.renderLogin()

//prevent refresh
if (sessionStorage.length > 0) {
    masterContainer.innerHTML = ""
    masterContainer.innerHTML = factory.renderHomepage()
    getEventsByDate()
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
                getEventsByDate()
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
                        getEventsByDate()
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


// declared constants to select input fields and created a clear form function to clear inputs
const date = document.querySelector("#eventDate")
const eventName = document.querySelector("#eventName")
const location = document.querySelector("#eventLocation")

const clearForm = () => {
    date.value = ""
    eventName.value = ""
    location.value = ""
}


//created a event listener with a function that will target the save button and targeted the input fields
masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("submitButton")) {
        const date = document.querySelector("#eventDate").value
        const userId = parseInt(sessionStorage.getItem("userId"))
        const eventName = document.querySelector("#eventName").value
        const location = document.querySelector("#eventLocation").value
        const hiddenInputId = document.querySelector("#eventsId")

        //created an object referencing the input fields
        const newEventEntry = {
            date: date,
            userId: userId,
            eventName: eventName,
            location: location
        };
        //clear form function that will clear the input fields
        // returns the fetch data parses the data and renders it to the DOM also made an if statement
        // that will target the hidden input Id and if is not an empty string it will edit the event entry else it will save it as new entry
        if (hiddenInputId.value !== "") {
            API.editEvents(newEventEntry, hiddenInputId.value).then(() => {
                getEventsByDate()
            }).then(clearForm)
        } else {
            API.saveEventsData(newEventEntry).then(getEventsByDate).then(clearForm)
        }
    }
})




// created a event listerner with a function that will target the delete button to delete an event and render the updated events
masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("deleteEvent--")) {
        const deleteEntry = event.target.id.split("--")[1]
        API.deleteEvent(deleteEntry).then(getEventsByDate)

    }

})


// created a event listener with a function that will target the edit button and reference the entries into the input fields so they will be able to be edit

masterContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("editEvent")) {
        const editEventEntry = event.target.id.split("--")[1]
        API.updateFormFields(editEventEntry)
    }
})