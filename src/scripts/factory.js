const createLogin = () => {
  return ` <section>
    <h2 class="Login_Text">Please Login</h2>
    <input type="text" placeholder="Username" id = "loginUsername">
    <input type="text" placeholder="Email" id = "loginEmail">
    <button id="signOnUser">Login</button>
  </section>`;
};

const createRegister = () => {
  return ` <section>
    <h2 class="Login_Text">Please Register</h2>
    <input type="text" placeholder="Enter a Username" id = "registerUsername">
    <input type="text" placeholder="Enter an Email" id = "registerEmail">
    <button id = "createUser">Submit</button>
  </section>`;
};

const makeUserObject = (username, email) => {
  return {
    username: username,
    email: email
  };
};


const renderHomepage = () => {
  return `<header>
  <img src="src/img/Nutshell_logo.png" ALT="some text" WIDTH=230 HEIGHT=60><button id="signOut" class="signOut">Log Out</button>
</header>
<div id="flex_container">

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
    <div id="newsModal"></div>
    <section id="news__entry">
      <fieldset>
        <input type="hidden" id="newsHiddenid" value=""/>
        Title<input name = "newsTitle" input type = "text" id="newsTitle">
        Synopsis<textarea wrap="soft" name="newsSynopsis" id="newsSynopsis"></textarea>
        URL<input name = "newsURL" input type = "text" id="newsURL">
        <button id="newsSubmit" type="submit" value="Record News Entry">Submit</button>
      </fieldset>
    </section>
    <section id="news__articles"></section>
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
  <h4>Your Tasks:</h4></div>

  <div id="tasksRender">
  </div>
  <div id="completedTasks"></div>
  </article>

  <article class="container events__container" id="events__container">

  <h3>Events</h3>
  <div id="eventsFormField">
  <input type="hidden" value="" id="eventsId">
    <fieldset>
        <label for="eventDate">Event Date</label>
        <input type="date" name="eventDate" id="eventDate">
    </fieldset>
    <fieldset>
        <label for="eventDate">Event Name</label>
        <input type="text" name="eventName" id="eventName" placeholder="Enter the Event Name">
    </fieldset>
    <fieldset>
        <label for="eventLocation">Event Location</label>
        <input type="text" name="eventName" id="eventLocation" placeholder="Enter the Event Location">
    </fieldset>
    <button id="submitButton">Save</button>
    </div>
    <div id="eventRender"></div>
  </article>
  <article class="container friends__container">
  <header id="friendHeader">
  <h3>Friends</h3>

  <div id="addFriendContainer"></div>
  <button id="searchFriend">Add Friend</button>
  </header>
  <ul id="friends__container"></ul>
  </article>
</div>
</div>`

}

const renderLogin = () => {
  return `<header id="welcome_page"><h1 id="welcome_h1">Welcome to</h1><a href="index.html"><img src="src/img/Nutshell_logo.png" ALT="some text" width=600 height=150></a></header>
  <article id="loginContainer">
    <button id="loginButton" class="button">Login</button>
    <button id="registerButton" class="button">Register</button>
  </article>`;
};

//events factory function that will create the object into the DOM
const createEventsHTML = (eventObject) => {
  return ` <section id="eventRenderContainer">
  <h1>Event Name: ${eventObject.eventName}</h1>
  <p>Date: ${eventObject.date}</p>
  <p>Location: ${eventObject.location}</p>
  <button id="deleteEvent--${eventObject.id}">Delete Event</button>
  <button id="editEvent--${eventObject.id}">Edit Event</button>
</section>`
}




//events render function that will display the events object into the DOM
const renderEvents = (events) => {
  const renderEventLocation = document.querySelector("#eventRender")
  renderEventLocation.innerHTML = ""
  events.forEach(event => {
    const renderLocation = createEventsHTML(event)
    renderEventLocation.innerHTML += renderLocation
  });

}





export default {
  createLogin,
  createRegister,
  makeUserObject,
  renderHomepage,
  renderLogin,
  createEventsHTML,
  renderEvents
}