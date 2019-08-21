import factory from "./factory.js"
import API from "./data.js"
import messages from "./messages.js"
import friends from "./friends.js"
import tasks from "./tasks.js"
import news from "./news.js"



const masterContainer = document.querySelector("#masterContainer")
let users = []
let friendArray = []
let messagesArray = []
masterContainer.innerHTML = factory.renderLogin()

API.getData().then(parsedData => {
    users.push(parsedData)
})

const getEventsByDate = () => {
    API.getEventsData().then(parsedData => {
        const finalArray = []
        const userId = parseInt(sessionStorage.getItem("userId"))
        parsedData.forEach(events => {
            if (events.userId === userId) {
                finalArray.push(events)
            }
        });
        friendArray[0].forEach(friendship => {
            if (friendship.userId === userId && friendship.areFriends === true) {
                const toRender = parsedData.filter(event => event.userId === friendship.otherFriendId)
                const savedSortArray = toRender.sort((a, b) => {
                    const dateA = new Date(a.date),
                        dateB = new Date(b.date)
                    return dateA - dateB
                })
                savedSortArray.forEach(event => {
                    finalArray.push(event)
                })
                // parsedData.forEach(data => {
                //     console.log(`#eventRenderContainer--${data.id}`)
                //     document.querySelector(`#eventRenderContainer--${data.id}`).style.backgroundColor = "cornsilk"
                //     document.querySelector(`#eventRenderContainer--${data.id}`).style.fontStyle = "italic"
                // })
            } else if (friendship.otherFriendId === userId && friendship.areFriends === true) {
                const toRender = parsedData.filter(event => event.userId === friendship.userId)
                const savedSortArray = toRender.sort((a, b) => {
                    const dateA = new Date(a.date),
                        dateB = new Date(b.date)
                    return dateA - dateB
                })
                savedSortArray.forEach(event => {
                    finalArray.push(event)
                })
                // parsedData.forEach(data => {
                //     document.querySelector(`#eventRenderContainer--${data.id}`).style.backgroundColor = "cornsilk"
                //     document.querySelector(`#eventRenderContainer--${data.id}`).style.fontStyle = "italic"
                // })
            }
        })
        factory.renderEvents(finalArray)
    })
}
masterContainer.innerHTML = factory.renderLogin()

friends.getAllFriends().then(data => {
        friendArray.push(data)
    })
messages.getAllMessages().then(data => {
        messagesArray.push(data)
    })
const friendInterval = () => {
        const userId = parseInt(sessionStorage.getItem("userId"))
        friends.getAllFriends().then(data => {
            friendArray[0].forEach(friend => {
                if (friendArray[0].length !== data.length) {
                    getRenderFriends()
                    friendArray = []
                    friendArray.push(data)
                } else if (friend.areFriends === false && userId === friend.userId) {
                    getRenderFriends()
                    friendArray = []
                    friendArray.push(data)
                }
            });
        })
    }
    const messageInterval = () => {
        messages.getAllMessages().then(data => {
            if (messagesArray[0].length !== data.length) {
                getRenderMessage()
                messagesArray = []
                messagesArray.push(data)
            }
        })
    }

    setInterval(friendInterval, 3000)
    setInterval(messageInterval, 3000)
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

    const getNewsByDate = () => {
        news.getNewsData().then(parsedData => {
            const finalArray = []
            const userId = parseInt(sessionStorage.getItem("userId"))
            parsedData.forEach(news => {
                if (news.userId === userId) {
                    finalArray.push(news)
                }
            });
            friendArray[0].forEach(friendship => {
                if (friendship.userId === userId && friendship.areFriends === true) {
                    const toRender = parsedData.filter(news => news.userId === friendship.otherFriendId)
                    const savedNewsArray = toRender.sort((a, b) => {
                        const newsDateA = new Date(a.date), newsDateB = new Date(b.date)
                        return newsDateB - newsDateA
                    })
                    savedNewsArray.forEach(news => {
                        finalArray.push(news)
                    })
                    // console.log(savedNewsArray)
                } else if (friendship.otherFriendId === userId && friendship.areFriends === true) {
                    const toRender = parsedData.filter(news => news.userId === friendship.userId)
                    const savedNewsArray = toRender.sort((a, b) => {
                        const newsDateA = new Date(a.date), newsDateB = new Date(b.date)
                        return newsDateB - newsDateA
                    })
                    savedNewsArray.forEach(news => {
                        finalArray.push(news)
                    })
                    // console.log(savedNewsArray)
                }
            })
            console.log(finalArray)
            news.renderToDOM(finalArray)
        })
    }

    //to get all friends on load
    const getRenderFriends = () => {
        friends.getAllFriends().then(data => {
            const userId = parseInt(sessionStorage.getItem("userId"))
            const friendsContainer = document.querySelector("#friends__container")
            friendsContainer.innerHTML = ""
            data.forEach(friend => {
                if (friend.userId === userId) {
                    if (friend.areFriends === true) {
                        const idea = users[0].find(user => user.id === friend.otherFriendId)
                        friends.renderFriendsList(idea.username, friend.id)
                    } else if (friend.areFriends === false) {
                        const idea = users[0].find(user => user.id === friend.otherFriendId)
                        friends.renderFriendsListPending(idea.username, friend.id)
                    }
                } else if (friend.otherFriendId === userId) {
                    if (friend.areFriends === true) {
                        const idea = users[0].find(user => user.id === friend.userId)
                        friends.renderFriendsList(idea.username, friend.id)
                    } else if (friend.areFriends === false) {
                        const idea = users[0].find(user => user.id === friend.userId)
                        friends.renderFriendsListAcceptButton(idea.username, friend.id)
                    }
                }
            })
        })
    }

    //TASKS filtering by UserId
    //make new array with data that I need and pass in to the renderTasks function
    const getRenderTasks = () => {
        tasks.getTasksData().then(parsedData => {
            const tasksHTMLRender = document.querySelector("#tasksRender")
            const tasksHTMLRenderCompleted = document.querySelector("#completedTasks")
            tasksHTMLRender.innerHTML = ""
            let usersTasks = []
            let completedTasks = []
            const userId = parseInt(sessionStorage.getItem("userId"))
            parsedData.forEach(task => {
                if (task.completed === false && task.userId === userId) {
                    usersTasks.push(task)
                    tasks.renderTasks(usersTasks)
                } else if (task.completed === true && task.userId === userId) {
                    completedTasks.push(task)
                    tasks.renderCompletedTasks(completedTasks)
                } else if (completedTasks.length === 0) {
                    // console.log(completedTasks.length)
                    tasksHTMLRender.innerHTML = ""
                    // console.log(completedTasks)
                } else if (usersTasks.length === 0) {
                    tasksHTMLRenderCompleted.innerHTML = ""
                }
            });
        })
    }



    //prevent refresh
    if (sessionStorage.length > 0) {
        masterContainer.innerHTML = ""
        masterContainer.innerHTML = factory.renderHomepage()
        getEventsByDate()
        getRenderMessage()
        getRenderFriends()
        getRenderTasks()
        getNewsByDate()

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
                    getEventsByDate()
                    getRenderMessage()
                    getRenderFriends()
                    getRenderTasks()
                    getNewsByDate()


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
                            getRenderMessage()
                            getRenderFriends()
                            getRenderTasks()
                            getNewsByDate()
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
                    const friendBoxLocation = document.querySelector("#friendDialogBox")
                    friends.renderFriendDialogBox(friendHTML, friendBoxLocation)
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
                    getNewsByDate()
                })
            })
        }
    })

    //delete friend
    masterContainer.addEventListener("click", () => {
        if (event.target.id.startsWith("deleteFriend")) {
            const deleteId = event.target.id.split("--")[1]
            friends.deleteFriend(deleteId).then(() => {
                getRenderFriends()
                getNewsByDate()
            })
        } else if (event.target.id.startsWith("denyFriend")) {
            const deleteId = event.target.id.split("--")[1]
            friends.deleteFriend(deleteId).then(() => {
                getRenderFriends()
                getNewsByDate()
            })
        }
    })

    //add friend search
    masterContainer.addEventListener("click", () => {
        if (event.target.id.startsWith("searchFriend")) {
            const friendsDialogBox = friends.addFriendDialogBox()
            const friendDialogBoxLocation = document.querySelector("#addFriendContainer")
            friends.renderFriendDialogBox(friendsDialogBox, friendDialogBoxLocation)
            const modal = document.querySelector("#addFriendModal")
            modal.showModal()
        }
    })

    //cancel modal
    masterContainer.addEventListener("click", () => {
        if (event.target.id.startsWith("CancelFriendSearch")) {
            const modal = document.querySelector("#addFriendModal")
            modal.close()
        }
    })

    //search for friend
    masterContainer.addEventListener("click", () => {
        if (event.target.id.startsWith("friends--search")) {
            const modal2 = document.querySelector("#addFriendModal")
            modal2.close()
            const textValue = document.querySelector("#searchFriend")
            const userId = parseInt(sessionStorage.getItem("userId"))
            const desiredFriendId = users[0].find(user => user.username === textValue.value)
            clickedID = desiredFriendId.id
            friends.getAllFriends().then(data => {
                const filteredData = data.filter(friend => (friend.userId === userId || friend.otherFriendId === userId) && (friend.userId === desiredFriendId.id || friend.otherFriendId === desiredFriendId.id) && userId !== desiredFriendId.id)
                if (filteredData.length < 1 && userId !== desiredFriendId.id) {
                    const usernameObject = users[0].find(user => user.id === desiredFriendId.id)
                    const friendHTML = friends.friendDialogBox(usernameObject)
                    const friendBoxLocation = document.querySelector("#friendDialogBox")
                    friends.renderFriendDialogBox(friendHTML, friendBoxLocation)
                    const modal = document.querySelector("#friendModal")
                    modal.showModal()
                }
            })
        }
    })
    //*******************************************/


    //Tasks
    const taskDueDate = document.querySelector("#taskDueDate")
    const taskText = document.querySelector("#tasksText")

    const deleteAllFields = (tasks) => {
        taskDueDate.value = ""
        taskText.value = ""
    }


    masterContainer.addEventListener("click", event => {
        if (event.target.id.startsWith("submit_button")) {
            const checkbox = document.querySelector(".completed").checked
            // console.log(checkbox)
            // const checkboxValue = checkbox.value
            const taskDueDate = document.querySelector("#taskDueDate")
            const taskText = document.querySelector("#tasksText")
            const hiddenEntryID = document.querySelector("#taskID")
            const dateValue = taskDueDate.value
            const taskValue = taskText.value
            const userId = parseInt(sessionStorage.getItem("userId"))
            const newTaskEntry = tasks.makeTasksObject(userId, taskValue, dateValue, checkbox)

            if (hiddenEntryID.value !== "") {
                tasks.editTaskEntry(newTaskEntry, hiddenEntryID.value).then(() => {
                    getRenderTasks()
                    deleteAllFields()
                })


            } else {
                const checkbox = document.querySelector(".completed").checked

                // const checkboxValue = checkbox.value
                const taskDueDate = document.querySelector("#taskDueDate")
                const userId = parseInt(sessionStorage.getItem("userId"))
                const taskText = document.querySelector("#tasksText")
                const dateValue = taskDueDate.value
                const taskValue = taskText.value
                const newTaskEntry = tasks.makeTasksObject(userId, taskValue, dateValue, checkbox)
                tasks.postNewTask(newTaskEntry).then(() => {
                    getRenderTasks()
                    deleteAllFields()
                })


            }
        }
    })

    //tasks delete event listener


    masterContainer.addEventListener("click", () => {
        if (event.target.id.startsWith("delete__Task")) {
            const deleteBtnID = event.target.id.split("--")[1]
            tasks.deleteTaskEntry(deleteBtnID)
            getRenderTasks()
        }
        if (event.target.id.startsWith("edit__Task")) {
            const entryId = event.target.id.split("--")[1]
            console.log("click")
            tasks.updateTaskEditFields(entryId)
            getRenderTasks()
        }
    })

    //this targets the item we want to mark completed and adds "checked" class to it that strike-throughs and lowers opacity
    masterContainer.addEventListener("click", (event) => {
        if (event.target.id.startsWith("completed")) {
            const checkbox = document.querySelector("#completed")
            const id = event.target.id.split("--")[1]
            const newID = `#taskLine--${id}`
            tasks.getOneTask(id).then(data => {
                if (data[0].completed === false) {
                    const trueDataObject = tasks.makeTaskTrue(data[0].userId, data[0].task, data[0].date, true)
                    tasks.editTaskEntry(trueDataObject, id).then(() => {
                        // document.querySelector(newID).classList.toggle("checked")
                        getRenderTasks()
                    })
                } else {
                    const trueDataObject = tasks.makeTaskTrue(data[0].userId, data[0].task, data[0].date, false)
                    tasks.editTaskEntry(trueDataObject, id).then(() => {
                        getRenderTasks()
                    })
                }
            })
        }
    });

    //Toggle button to show completed tasks
    masterContainer.addEventListener("click", (event) => {
        if (event.target.id.startsWith("delete_completed")) {
            const completedTasks = document.querySelectorAll(".checked")
            console.log(completedTasks)
            completedTasks[0].classList.toggle("hidden")
        }

    })
    //* -----------------Begin News--------------------
    // ------------------Enter new News Article-------------------------
    let newNewsEntry = "";

    masterContainer.addEventListener("click", () => {
        if (event.target.id.startsWith("newsSubmit")) {
            const title = document.querySelector("#newsTitle");
            const synopsis = document.querySelector("#newsSynopsis");
            const url = document.querySelector("#newsURL");
            const newsUserID = parseInt(sessionStorage.getItem("userId"));
            const currentDate = new Date();
            const newsDateSubmitted = currentDate;
            // console.log(title);
            newNewsEntry = {
                title: title.value,
                synopsis: synopsis.value,
                url: url.value,
                userId: newsUserID,
                date: newsDateSubmitted,
            };
            // console.log(newNewsEntry)
            //* Display the new journal entry in the DOM
            news.saveNewsEntry(newNewsEntry).then(() => {
                getNewsByDate()
            })
        }
    });

    // --------------------Delete News Article--------------------------
    masterContainer.addEventListener("click", () => {
        if (event.target.id.startsWith("NewsArticleDelete")) {
            const newsArticleToDelete = event.target.id.split("--")[1];
            // console.log(newsArticleToDelete);
            //* to clear the DOM
            document.querySelector("#news__articles").innerHTML = "";
            //* delete article
            news.deleteNewsEntry(newsArticleToDelete);
            //* render json news array to DOM
            news.getNewsData().then(news.renderToDOM);
        }
    });

    // --------------------Edit News Article----------------------------
    masterContainer.addEventListener("click", () => {
        const modal = document.querySelector("#newsModal");
        const modalButton = document.querySelector("#editNewsSubmit");
        if (event.target.id.startsWith("NewsArticleEdit")) {
            const newsArticleToEdit = event.target.id.split("--")[1];
            const newsModal = document.querySelector("#newsModal");
            newsModal.innerHTML = modalNewsEdit();
            const newsModalBox = document.querySelector("#newsModalBox");
            newsModalBox.showModal();
            news.retrieveNewsEntry(newsArticleToEdit)
                .then(newsArticleObjectToEdit => {
                    const newsTitle = document.querySelector("#editNewsTitle");
                    const newsSynopsis = document.querySelector("#editNewsSynopsis");
                    const newsUrl = document.querySelector("#editNewsURL");
                    const newsDate = document.querySelector("#editNewsDate");
                    const newsUserId = document.querySelector("#editNewsUserId");
                    // console.table(newsArticleObjectToEdit);
                    newsTitle.value = newsArticleObjectToEdit.title;
                    newsSynopsis.value = newsArticleObjectToEdit.synopsis;
                    newsUrl.value = newsArticleObjectToEdit.url;
                    newsDate.value = newsArticleObjectToEdit.date;
                    newsUserId.value = newsArticleObjectToEdit.userId;
                })
                .then(
                    masterContainer.addEventListener("click", () => {
                        if (event.target.id.startsWith("editNewsSave")) {
                            const updatedNewsObject = {
                                date: document.querySelector("#editNewsDate").value,
                                userId: document.querySelector("#editNewsUserId").value,
                                title: document.querySelector("#editNewsTitle").value,
                                synopsis: document.querySelector("#editNewsSynopsis").value,
                                url: document.querySelector("#editNewsURL").value,
                            }
                            news.saveEditedNewsEntry(updatedNewsObject, newsArticleToEdit).then(getNewsByDate);
                            const newsModalBox = document.querySelector("#newsModalBox");
                            newsModalBox.close();
                        }
                    })
                );
        }
    });

    const modalNewsEdit = () => {
        return `<dialog id="newsModalBox">
        <input type="hidden" id="editNewsDate" value="" />
        <input type="hidden" id="editNewsUserId" value="" />
        <input name = "editNewsTitle" type = "text" id="editNewsTitle">
        <label for="editNewsTitle">Title</label>
        <textarea wrap="soft" name="editNewsSynopsis" id="editNewsSynopsis"></textarea>
        <input name = "editNewsURL" input type = "text" id="editNewsURL">
        <button id="editNewsSave" type="submit" value="Record News Entry">Save</button>
    </dialog>`
    };

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
