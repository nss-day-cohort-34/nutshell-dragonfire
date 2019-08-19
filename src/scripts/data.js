const getData = () => {
    return fetch("http://localhost:8088/users")
    .then(entries => entries.json())
}

const register = (registerObject) => {
    return fetch("http://localhost:8088/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(registerObject)
    })
}

const searchAPI = (username, email) => {
    return fetch(`http://localhost:8088/users?username=${username}&email=${email}`)
    .then(entries => entries.json())
}

//Events Fetch//
const getEventsData = () => {
    return fetch("http://localhost:8088/events")
    .then(entries => entries.json())
}

const saveEventsData = (registerEvent) => {
    return fetch("http://localhost:8088/events", {
        method: "POST",
        headers: {
                "Content-Type": "application/json"
            },
        body: JSON.stringify(registerEvent)
        }).then(response => response.json())
}

const deleteEvent = (entryId) => {
    return fetch(`http://localhost:8088/events/${entryId}`, {
            method: "DELETE",
        }).then(response => response.json())


}

const editEvents = (updatedObject, id) => {
    return fetch(`http://localhost:8088/events/${id}`, {
            "method": "PUT",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(updatedObject)
        })
        .then(response => response.json())
}

const updateFormFields = (eventId) => {
    const hiddenEntryId = document.querySelector("#eventsId")
    const hiddenDate = document.querySelector("#eventDate")
    const hiddenEventName = document.querySelector("#eventName")
    const hiddenLocation = document.querySelector("#eventLocation")
    return fetch(`http://localhost:8088/events/${eventId}`)
        .then(response => response.json())
        .then(event => {
            console.log(hiddenEntryId)
            hiddenEntryId.value = event.id
            hiddenDate.value = event.date
            hiddenEventName.value = event.eventName
            hiddenLocation.value = event.location
        })
}


export default {
    getData, register, searchAPI, getEventsData, saveEventsData, deleteEvent, editEvents, updateFormFields
}