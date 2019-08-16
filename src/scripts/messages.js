// const rightSide = document.querySelector(".rightSideContainer")
// const messagesContainer = document.querySelector("#messages__container")


//factory function to render input field

const makeMessagesInput = () => {
    return `<section class="messages" id="messages">
    <input class="messages__input" id="messages__input" type="text" placeholder="Enter a Message">
    <button class="messages__submit" id="messages__submit">Submit</button>
</section>`
}

export default {
    makeMessagesInput
}