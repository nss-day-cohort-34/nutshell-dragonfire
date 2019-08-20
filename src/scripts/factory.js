

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
    createLogin, createRegister, makeUserObject, renderHomepage, renderLogin, createEventsHTML, renderEvents
}