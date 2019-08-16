

const createLogin = () => {
    return ` <section>
    <h2>Please Login</h2>
    <input type="text" placeholder="Username" id = "loginUsername">
    <input type="text" placeholder="Email" id = "loginEmail">
    <button id="signOnUser">Login</button>
  </section>`
}

const createRegister = () => {
    return ` <section>
    <h2>Please Register</h2>
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

const renderHomepage = () => {
  return `<header>
  <h1>Nutshell</h1> <button id="signOut" class="signOut">Log Out</button>
</header>
<div class="rightSideContainer">
<h3>Messages</h3>
  <article class="messages__container" id="messages__container">
  </article>
  <section class="messages" id="messages">
    <input class="messages__input" id="messages__input" type="text" placeholder="Enter a Message">
    <button class="messages__submit" id="messages__submit">Submit</button>
</section>
</div>
<div class="leftSideContainer">
  <article class="container news__container" id="news__container">
  <h3>News</h3>
  </article>
  <article class="container tasks__container" id="tasks__container">
  <h3>To-Dos</h3>
  </article>
  <article class="container events__container" id="events__container">
  <h3>Events</h3>
  </article>
  <article class="container friends__container" id="friends__container">
  <h3>Friends</h3>
  </article>
</div>`
}

const renderLogin = () => {
  return `<h1>Welcome to Nutshell!</h1>
  <article id="loginContainer">
    <button id="loginButton" class="button">Login</button>
    <button id="registerButton" class="button">Register</button>
  </article>`
}

export default {
    createLogin, createRegister, makeUserObject, renderHomepage, renderLogin
}