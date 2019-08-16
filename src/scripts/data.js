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






export default {
    getData, register, searchAPI
}