

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

const renderFriendDialogBox = (friendHTML) => {
    const friendBoxLocation = document.querySelector("#friendDialogBox")
    friendBoxLocation.innerHTML = ""
    friendBoxLocation.innerHTML = friendHTML
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

const renderFriendsList = (friendsArray, friendId) => {
    const friendsContainer = document.querySelector("#friends__container")
    friendsContainer.innerHTML = ""
    friendsArray.forEach(friend => {
        const convertedUsername = makeFriendComponent(friend, friendId)
        friendsContainer.innerHTML += convertedUsername
    });
}

const renderFriendsListPending = (friendsArray, friendId) => {
    const friendsContainer = document.querySelector("#friends__container")
    friendsArray.forEach(friend => {
        const convertedUsername = makeFriendComponenPending(friend, friendId)
        friendsContainer.innerHTML += convertedUsername
    });
}
const renderFriendsListAcceptButton = (friendsArray, friendId) => {
    const friendsContainer = document.querySelector("#friends__container")
    friendsArray.forEach(friend => {
        const convertedUsername = makeFriendComponentAcceptButton(friend, friendId)
        friendsContainer.innerHTML += convertedUsername
    });
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




export default {
    getAllFriends, friendDialogBox, renderFriendDialogBox, addFriend, makeFriendObject, renderFriendsList, renderFriendsListPending, renderFriendsListAcceptButton, getOneFriend
}