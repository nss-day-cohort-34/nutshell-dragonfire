import factory from "./factory.js"
import API from "./data.js"

const loginButton = document.querySelector("#loginButton")
const registerButton = document.querySelector("#registerButton")
const loginContainer = document.querySelector("#loginContainer")
let users = []
let currentUser = 0

API.getData().then(parsedData => {
    users.push(parsedData)
})
loginButton.addEventListener("click", () => {
    loginContainer.innerHTML = ""
    loginContainer.innerHTML = factory.createLogin()
})

registerButton.addEventListener("click", () => {
    loginContainer.innerHTML = ""
    loginContainer.innerHTML = factory.createRegister()
})

loginContainer.addEventListener("click", () => {
    if (event.target.id.startsWith("sign")) {
        const username = document.querySelector("#loginUsername")
        const email = document.querySelector("#loginEmail")
        API.searchAPI(username.value, email.value).then(data => {
            if (data.length === 0) {
                window.alert("Not a vaild Login")
            } else if (data.length > 0) {
                window.location.href = "src/homepage.html"
            }
        })
    }
})

loginContainer.addEventListener("click", () => {
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
                        users = []
                        users.push(parsedData)
                        window.location.href = "src/homepage.html"
                    })
                })
            }
        })
    }
})

