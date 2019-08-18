

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

const makeFriendObject = (userId, otherFriendId) => {
    return {
        userId: userId,
        otherFriendId: otherFriendId,
        areFriends: false
    }
}

const renderFriendsList = (friendsArray) => {
    const friendsContainer = document.querySelector("#friends__container")
    friendsContainer.innerHTML = ""
    friendsArray.forEach(friend => {
        const convertedUsername = makeFriendComponent(friend)
        friendsContainer.innerHTML += convertedUsername
    });
}

const renderFriendsListPending = (friendsArray) => {
    const friendsContainer = document.querySelector("#friends__container")
    friendsArray.forEach(friend => {
        const convertedUsername = makeFriendComponenPending(friend)
        friendsContainer.innerHTML += convertedUsername
    });
}
const renderFriendsListAcceptButton = (friendsArray) => {
    const friendsContainer = document.querySelector("#friends__container")
    friendsArray.forEach(friend => {
        const convertedUsername = makeFriendComponentAcceptButton(friend)
        friendsContainer.innerHTML += convertedUsername
    });
}

const makeFriendComponent = (friendUsername) => {
    return `<li>${friendUsername}<button>Delete</button></li>`
}
const makeFriendComponenPending = (friendUsername) => {
    return `<li>${friendUsername} <i>Pending</i><button>Delete</button></li>`
}

const makeFriendComponentAcceptButton = (friendUsername) => {
    return `<li>${friendUsername} <i>Pending</i><button>Accept</button><button>Deny</button></li>`
}


export default {
    getAllFriends, friendDialogBox, renderFriendDialogBox, addFriend, makeFriendObject, renderFriendsList, renderFriendsListPending, renderFriendsListAcceptButton
}