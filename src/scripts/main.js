import factory from "./factory.js";
import API from "./data.js";
import messages from "./messages.js";
import news from "./news.js";

const masterContainer = document.querySelector("#masterContainer");
let users = [];

API.getData().then(parsedData => {
  users.push(parsedData);
});
masterContainer.innerHTML = factory.renderLogin();

//prevent refresh
if (sessionStorage.length > 0) {
  masterContainer.innerHTML = "";
  masterContainer.innerHTML = factory.renderHomepage();
  news.getNewsData().then(news.renderToDOM);
}
//click login button
masterContainer.addEventListener("click", () => {
  if (event.target.id.startsWith("loginButton")) {
    const loginContainer = document.querySelector("#loginContainer");
    loginContainer.innerHTML = "";
    loginContainer.innerHTML = factory.createLogin();
  }
});
//click register button
masterContainer.addEventListener("click", () => {
  if (event.target.id.startsWith("registerButton")) {
    const loginContainer = document.querySelector("#loginContainer");
    loginContainer.innerHTML = "";
    loginContainer.innerHTML = factory.createRegister();
  }
});
// verify user in database
masterContainer.addEventListener("click", () => {
  if (event.target.id.startsWith("signOnUser")) {
    const username = document.querySelector("#loginUsername");
    const email = document.querySelector("#loginEmail");
    API.searchAPI(username.value, email.value).then(data => {
      if (data.length === 0) {
        window.alert("Not a vaild Login");
      } else if (data.length > 0) {
        sessionStorage.setItem("userId", JSON.stringify(data[0].id));
        console.log(sessionStorage.userId);
        masterContainer.innerHTML = "";
        masterContainer.innerHTML = factory.renderHomepage();
        news.getNewsData().then(news.renderToDOM);
      }
    });
  }
});
//verify it is a new user and register
masterContainer.addEventListener("click", () => {
  if (event.target.id.startsWith("create")) {
    const username = document.querySelector("#registerUsername");
    const email = document.querySelector("#registerEmail");
    const userObject = factory.makeUserObject(username.value, email.value);
    API.searchAPI(username.value, email.value).then(data => {
      if (data.length > 0) {
        window.alert("Already a Valid Username or Email");
      } else if (data.length === 0) {
        API.register(userObject).then(() => {
          API.getData().then(parsedData => {
            const registeredUser = parsedData.find(
              item => item.username === username.value
            );
            sessionStorage.setItem("userId", JSON.stringify(registeredUser.id));
            users = [];
            users.push(parsedData);
            masterContainer.innerHTML = "";
            masterContainer.innerHTML = factory.renderHomepage();
            news.getNewsData().then(news.renderToDOM);
          });
        });
      }
    });
  }
});

masterContainer.addEventListener("click", () => {
  if (event.target.id.startsWith("signOut")) {
    sessionStorage.clear();
    masterContainer.innerHTML = "";
    masterContainer.innerHTML = factory.renderLogin();
  }
});
//messages

//* -----------------Begin News--------------------
// ------------------Enter new News Article-------------------------
let newNewsEntry = "";

masterContainer.addEventListener("click", () => {
  if (event.target.id.startsWith("newsSubmit")) {
    const title = document.querySelector("#newsTitle");
    const synopsis = document.querySelector("#newsSynopsis");
    const url = document.querySelector("#newsURL");
    const newsUserID = parseInt(sessionStorage.getItem("user"));
    const newsDateSubmitted = "";
    console.log(newsUserID);
    console.log(title);
    newNewsEntry = {
      title: title.value,
      synopsis: synopsis.value,
      url: url.value,
      userID: newsUserID,
      date: newsDateSubmitted
    };
    //* Display the new journal entry in the DOM
    news.saveNewsEntry(newNewsEntry);
  }
});

// --------------------Delete News Article--------------------------
masterContainer.addEventListener("click", () => {
  if (event.target.id.startsWith("NewsArticleDelete")) {
    const newsArticleToDelete = event.target.id.split("--")[1];
    console.log(newsArticleToDelete);
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
    console.log("newsArticleToEdit  ", newsArticleToEdit);
    console.log(modalNewsEdit())
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
        console.table(newsArticleObjectToEdit);
        console.log(newsArticleObjectToEdit.date)
        newsTitle.value = newsArticleObjectToEdit.title;
        newsSynopsis.value = newsArticleObjectToEdit.synopsis;
        newsUrl.value = newsArticleObjectToEdit.url;
        newsDate.value = newsArticleObjectToEdit.date;
        newsUserId.value = newsArticleObjectToEdit.userId;
        console.log(newsArticleObjectToEdit);
      })
      .then(
        masterContainer.addEventListener("click", () => {
          if (event.target.id.startsWith("editNewsSave")) {
            const updatedNewsObject = {
                date: document.querySelector("#editNewsDate"),
                userId: document.querySelector("#editNewsUserId"),
                title: document.querySelector("#editNewsTitle").value,
                synopsis: document.querySelector("#editNewsSynopsis").value,
                url: document.querySelector("#editNewsURL")
            }
            console.log(updatedNewsObject)
            console.log(newsArticleToEdit)

            news.saveEditedNewsEntry(updatedNewsObject, newsArticleToEdit)
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

//* -----------------End News----------------------
