// const rightSide = document.querySelector(".rightSideContainer")



//factory function to render input field


const saveMessage = (messageObject) => {
    return fetch("http://localhost:8088/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(messageObject)
    })
}

const makeMessageObject = (userId, message) => {
    return {
        userId: userId,
        message: message
    }
}

const makeMessageComponent = (messageObject) => {
    return ` <p>${messageObject.user.username} - ${messageObject.message}</p>
    <button class="edit__button" id="edit--${messageObject.id}">Edit</button>`
}

const getAllMessages = () => {
    return fetch("http://localhost:8088/messages?_expand=user")
    .then(entries => entries.json())
}

const renderMessage = (entries) => {
    const messagesContainer = document.querySelector("#messages__container")
    messagesContainer.innerHTML = ""
    entries.forEach(entry => {
        const convertedEntry = makeMessageComponent(entry)
        messagesContainer.innerHTML += convertedEntry
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight
}




export default {
    saveMessage, makeMessageObject, renderMessage, getAllMessages
}