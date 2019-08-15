

const createLogin = () => {
    return ` <section>
    <input type="text" placeholder="Username" id = "loginUsername">
    <input type="text" placeholder="Email" id = "loginEmail">
    <button id="signOnUser">Login</button>
  </section>`
}

const createRegister = () => {
    return ` <section>
    <input type="text" placeholder="Enter a Username" id = "registerUsername">
    <input type="text" placeholder="Enter an Email" id = "registerEmail">
    <button id = "createUser">Submit</button>
  </section>`
}

const makeUserObject = (username, email) => {
    return {
        username: username,
        email: email
    }
}

export default {
    createLogin, createRegister, makeUserObject
}