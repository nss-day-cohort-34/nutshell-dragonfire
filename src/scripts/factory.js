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
<div id="friendDialogBox"></div>
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
  <div id="tasksFormField">
  <input type="hidden" id="taskID" value="">
  <fieldset>
  <legend>Tasks:</legend>
  <input type="text" name="tasksText" id="tasksText" size="50" placeholder="Enter task here" autofocus>
  </fieldset>
  <fieldset>
  <legend>Due Date:</legend>
  <input type="date" name="dueDate" id="taskDueDate">
  </fieldset>
  <fieldset><input type="submit" id="submit_button" value="Add">
    <input type="submit" id="delete_completed" value="Toggle Completed">
  </fieldset>
  <h3>Your Tasks:</h3></div>

  <div id="tasksRender">
  </div>
  <div id="completedTasks"></div>
  </article>

  <article class="container events__container" id="events__container">
  <h3>Events</h3>
  </article>
  <article class="container friends__container">
  <header id="friendHeader">
  <h3>Friends</h3>
  <div id="addFriendContainer"></div>
  <button id="searchFriend">Add Friend</button>
  </header>
  <ul id="friends__container"></ul>
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
  createLogin,
  createRegister,
  makeUserObject,
  renderHomepage,
  renderLogin
}