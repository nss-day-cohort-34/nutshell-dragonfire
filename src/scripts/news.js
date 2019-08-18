//* ------------------news---data.js---------------
const getNewsData = () => {
    return fetch("http://localhost:8088/news")
    .then(entries => entries.json())
}

const saveNewsEntry =
  function(newNewsEntry ) {
    return fetch("http://localhost:8088/news",{
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newNewsEntry)
    })
}

//* DELETE section
const deleteNewsEntry = (id) => {
    return fetch(`http://localhost:8088/news/${id}`,{
    method: "DELETE",
    })
    .then(response => response.json())
  }

//* ------------------news---factory.js------------
const createNewsArticleComponent = (object) => {
    return `
            <div class="newsArticle--${object.id}">
              <section>${object.title}</section>
              <section>${object.synopsis}</section>
              <section>URL: ${object.url}</section>
              <section>Submitted By: ${object.userID}</section>
              <button id="NewsArticleDelete--${object.id}">Delete News Article</button>
              <button id="NewsArticleEdit--${object.id}">Edit News Article</button>
            </div>`;
  };



  const renderToDOM = (newsArticles) => {
    const whereToDisplayNewsInTheDOM = document.querySelector("#news__articles");
    newsArticles.forEach(object => {
    //   console.table(object)
      const htmlRepresentation = createNewsArticleComponent(object);
      whereToDisplayNewsInTheDOM.innerHTML += htmlRepresentation
      });
  };


//* ------------------news---main.js-----------------------------------

// getNewsData().then(renderToDOM)

// ------------------Enter News-------------------------
// let newNewsEntry = ""

// masterContainer.addEventListener("click", () => {
//     if (event.target.id.startsWith("news__entry")) {
//         const title = document.querySelector("#newsTitle");
//         const synopsis = document.querySelector("#newsSynopsis");
//         const url = document.querySelector("#newsURL");
//         newNewsEntry = {
//             title: title.value,
//             synopsis: synopsis.value,
//             url: url.value,
//         }
//   //* Display the new journal entry in the DOM
//         saveNewsEntry(newNewsEntry)
//     }

// })


// document.querySelector("#news__entry").addEventListener("click", () => {
//   //* Capture the news entry with a factory function and save them to an array
//   const title = document.querySelector("#newsTitle");
//   const synopsis = document.querySelector("#newsSynopsis");
//   const url = document.querySelector("#newsURL");
//   newNewsEntry = {
//     title: title.value,
//     synopsis: synopsis.value,
//     url: url.value,
//     }
//   //* Display the new journal entry in the DOM
//   saveNewsEntry(newNewsEntry)
// });

export default {
    getNewsData, saveNewsEntry, deleteNewsEntry, renderToDOM, createNewsArticleComponent

}
