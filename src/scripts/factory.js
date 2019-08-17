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
  <article class="messages__container" id="messages__container">
  <h3>Messages</h3>
  </article>
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
  <fieldset><input type="submit" id="submit_button" value="Add"></fieldset>
  <h3>Your Tasks:</h3></div>
  <div id="tasksRender"
  
  </div>
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

//Tasks Functionality Here

// const createFormField = () => {

//   return `
//   <div id="tasksFormField">
//   <fieldset>
//   <legend>Tasks:</legend>
//   <input type="text" name="tasksText" id="tasksText" size="50" placeholder="Enter task here">
//   </fieldset>
//   <fieldset>
//   <legend>Due Date:</legend>
//   <input type="date" name="dueDate" id="taskDueDate">
//   </fieldset>
//   <fieldset><input type="submit" class="submit_button" value="Submit"></fieldset>
//   </div>`
// }

// const tasksHTML = (id, task, date) => {
//   return `
//   <article id="taskField--${id}" class="taskField">
//   <input type="checkbox">
//   <span>${task}</span>
//   <p>Due Date: ${date}</p>
//   <button class="edit-button" id="edit_Entry--${id}">Edit Task</button>
//   <button class="delete-button" id="delete_Entry--${id}">Delete Task</button>
//   <br>
//   <hr>
//   </article>`
// }

// const makeTasksObject = (task, date) => {
//   return {
//     task: task,
//     date: date
//   }
// }

export default {
  createLogin,
  createRegister,
  makeUserObject,
  renderHomepage,
  renderLogin
}