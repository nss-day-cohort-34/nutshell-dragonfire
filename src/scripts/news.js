//* ------------------news---data.js---------------
const getNewsData = () => {
    return fetch("http://localhost:8088/news?_expand=user")
    .then(entries => entries.json())
}

const saveNewsEntry = (newNewsEntry ) => {
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

//* Retrieve the specific news article for editing
const retrieveNewsEntry = (id) => {
    return fetch(`http://localhost:8088/news/${id}`)
    .then(response => response.json())
}
//* Posting edited object
const saveEditedNewsEntry = (updatedNewsObject, id) => {
    return fetch(`http://localhost:8088/news/${id}` ,{
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedNewsObject)
    })
    .then(updatedNewsObject => updatedNewsObject.json())
}


//* ------------------news---factory.js------------
const createNewsArticleComponent = (object) => {
    return `
            <div class="newsArticle--${object.id}">
              <section>${object.title}</section>
              <section>${object.synopsis}</section>
              <section>URL: ${object.url}</section>
              <section>Submitted By: ${object.userId}</section>
              <input type="hidden" id="hiddenId" value=""/>
              <button id="NewsArticleDelete--${object.id}">Delete News Article</button>
              <button id="NewsArticleEdit--${object.id}">Edit News Article</button>
            </div>`;
};
//-------------------------------

// news.sort(compare)
//----------------------------------
const renderToDOM = (newsArticles) => {
const whereToDisplayNewsInTheDOM = document.querySelector("#news__articles");
newsArticles.forEach(object => {
//   console.table(object)
    const htmlRepresentation = createNewsArticleComponent(object);
    whereToDisplayNewsInTheDOM.innerHTML += htmlRepresentation
    });
};


export default {
    getNewsData, saveNewsEntry, deleteNewsEntry, retrieveNewsEntry, saveEditedNewsEntry, renderToDOM, createNewsArticleComponent

}
