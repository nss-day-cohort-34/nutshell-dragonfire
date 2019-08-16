//* ------------------news---data.js---------------
const getNewsData = () => {
    return fetch("http://localhost:8088/news")
    .then(entries => entries.json())
}



//* ------------------news---factory.js------------
const createNewsArticleComponent = (object) => {
    return `<div class="newsArticle--${object.id}">
              <h3>${object.date}</h3>
              <section>${object.title}</section>
              <section>${object.synopsis}</section>
              <section>URL: ${object.url}</section>
              <section>Presented By: ${object.userId}</section>
              <button id="articleSave--${object.id}">Save News Article</button>
          </div>`;
  };

  const whereToDisplayNewsInTheDOM = document.querySelector(
    "#news__container"
  );

  const renderToDOM = (newsArticles) => {
    newsArticles.forEach(object => {
      console.table(object)
      const htmlRepresentation = createNewsArticleComponent(object);
      console.log(object)
      console.log(htmlRepresentation)
      whereToDisplayNewsInTheDOM.innerHTML += htmlRepresentation;
      }); 
  };


//* ------------------news---main.js-----------------------------------

getNewsData().then(renderToDOM)

// ------------------Enter News-------------------------
let newNewsEntry = ""
document.querySelector("#news__entry").addEventListener("click", event => {
  //* Capture the new journal entry with a factory function and save them to an array
  const date = document.querySelector("#newsDate");
  const title = document.querySelector("#newsTitle");
  const synopsis = document.querySelector("#newsSynopsis");
  const url = document.querySelector("#newsURL");
  
  
  newJournalEntry = {
    date: date.value,
    concept: concept.value,
    content: content.value,
    mood: mood.value, 
  }
  //* Display the new journal entry in the DOM
  saveJournalEntry(newJournalEntry)
  .then (() => {
    entries.push({date, concept, content, mood})
  })
  
});