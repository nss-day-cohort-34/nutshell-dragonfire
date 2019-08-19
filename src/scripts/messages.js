// const rightSide = document.querySelector(".rightSideContainer")

import friends from "./friends.js"

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
    return ` <p><button class = "invisibleButton" id = "invisibleButton--${messageObject.userId}">${messageObject.user.username}</button> - ${messageObject.message}</p>
    <button class="edit__button" id="messageEdit--${messageObject.id}">Edit</button>
    <dialog class = "modal" id="modal--${messageObject.id}">
    <input class="editMessageInput" id="messageInput--${messageObject.id}" type="text">
    <button class="save__button" id="messages--save--${messageObject.id}">Save</button>
    <button class="cancel__button" id="cancelMessage--${messageObject.id}">Cancel</button>
    </dialog>`
}

const getOneMessage = (id) => {
    return fetch(`http://localhost:8088/messages?id=${id}`)
    .then(entries => entries.json())
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

let updatedObject = {}
const edit = (nameOfArray, ID, locationID) => {
    if (nameOfArray === "messages") {
        updatedObject = messagesEdit(locationID)
    }
    if (nameOfArray === "friends") {
        updatedObject = friendAccept(locationID)
    }
    return fetch(`http://localhost:8088/${nameOfArray}/${ID}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedObject)
    }).then(data => data.json())
        .then(() => {
        })
}

const messagesEdit = (messageID) => {
    const message = document.querySelector(`#${messageID}`)
    const id = parseInt(sessionStorage.getItem("userId"))
    const updatedObject = makeMessageObject(id, message.value)
    return updatedObject
}

const friendAccept = (otherFriendID) => {
    const id = parseInt(sessionStorage.getItem("userId"))
    const updatedObject = friends.makeFriendObject(id, otherFriendID, true)
    return updatedObject
}





export default {
    saveMessage, makeMessageObject, renderMessage, getAllMessages, edit, getOneMessage
}