

const getAllFriends = () => {
    return fetch("http://localhost:8088/friends")
        .then(entries => entries.json())
}

const friendDialogBox = (username) => {
    return `<dialog class = "modal" id="friendModal">
    <h2>Would you like to add ${username.username} as a friend?</h2>
    <button class="save__button" id="friends--add">Add Friend</button>
    <button class="cancel__button" id="cancelFriend--">Cancel</button>
    </dialog>`
}

const addFriendDialogBox = () => {
    return `<dialog class = "modal" id="addFriendModal">
    <p>Search for a friend</p><input type="text" placeholder = "search" id = "searchFriend">
    <button class="search__button" id="friends--search">Search</button>
    <button class="cancel__button" id="CancelFriendSearch">Cancel</button>
    </dialog>`
}

const renderFriendDialogBox = (friendHTML, location) => {
    location.innerHTML = ""
    location.innerHTML = friendHTML
}

const addFriend = (friendObject) => {
    return fetch("http://localhost:8088/friends", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(friendObject)
    })
}

const makeFriendObject = (userId, otherFriendId, boolean) => {
    return {
        userId: userId,
        otherFriendId: otherFriendId,
        areFriends: boolean
    }
}

const renderFriendsList = (friend, friendId) => {
    const friendsContainer = document.querySelector("#friends__container")
    const convertedUsername = makeFriendComponent(friend, friendId)
    friendsContainer.innerHTML += convertedUsername
}

const renderFriendsListPending = (friend, friendId) => {
    const friendsContainer = document.querySelector("#friends__container")
    const convertedUsername = makeFriendComponenPending(friend, friendId)
    friendsContainer.innerHTML += convertedUsername
}
const renderFriendsListAcceptButton = (friend, friendId) => {
    const friendsContainer = document.querySelector("#friends__container")
        const convertedUsername = makeFriendComponentAcceptButton(friend, friendId)
        friendsContainer.innerHTML += convertedUsername
}

const makeFriendComponent = (friendUsername, friendId) => {
    return `<li>${friendUsername}<button id="deleteFriend--${friendId}">Delete</button></li>`
}
const makeFriendComponenPending = (friendUsername, friendId) => {
    return `<li>${friendUsername} <i>Pending</i><button id= "deleteFriendPending--${friendId}">Delete</button></li>`
}

const makeFriendComponentAcceptButton = (friendUsername, friendId) => {
    return `<li>${friendUsername} <i>Pending</i><button id="friends--acceptFriend--${friendId}">Accept</button><button id="denyFriend--${friendId}">Deny</button></li>`
}

const getOneFriend = (id) => {
    return fetch(`http://localhost:8088/friends?id=${id}`)
        .then(entries => entries.json())
}

const deleteFriend = (entryID) => {
    return fetch(`http://localhost:8088/friends/${entryID}`,
        {
            method: "DELETE",

        })
        .then(data => data.json())
}




export default {
    getAllFriends, friendDialogBox, renderFriendDialogBox, addFriend, makeFriendObject, renderFriendsList, renderFriendsListPending, renderFriendsListAcceptButton, getOneFriend, deleteFriend, addFriendDialogBox
}