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


//Tasks API data here

// const getTasksData = () => {
//     return fetch("http://localhost:8088/tasks")
//         .then(data => data.json())
// }

// const postNewTask = (task) => {
//     return fetch("http://localhost:8088/tasks", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(task)
//     })
// }

// const deleteTaskEntry = (deleteBtnId) => {
//     return fetch(`http://localhost:8088/tasks/${deleteBtnId}`, {
//             method: "DELETE",
//         })
//         .then(response => response.json())
// }


// const editTaskEntry = (updatedObject, id) => {
//     return fetch(`http://localhost:8088/tasks/${id}`, {
//             "method": "PUT",
//             "headers": {
//                 "Content-Type": "application/json"
//             },
//             "body": JSON.stringify(updatedObject)

//         })
//         .then(response => response.json())
//     // .then(() => {
//     //   const hiddentaskId = document.querySelector("#taskId")
//     //   hiddentaskId.value = ""
//     // })
// }

export default {
    getData,
    register,
    searchAPI
}