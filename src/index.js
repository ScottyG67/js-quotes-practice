const BASE_URL = "http://localhost:3000/quotes?_embed=likes"

document.addEventListener('DOMContentLoaded',()=> {
    console.log("Dom Loaded")

    fetchQuotes()

    let quoteForm = document.getElementById('new-quote-form')
        quoteForm.addEventListener('submit',newQuote)

    
})

const fetchQuotes = () => {
    fetch(BASE_URL).then(res=>res.json()).then(quotes => quotes.forEach(renderQuote))
}

const renderQuote = (quote) => {

    let likesNumber = quote.likes.length ? quote.likes.length:0
    const list = document.getElementById('quote-list')
    const blockquote = document.createElement('blockquote')
        blockquote.className = "blockquote"
        blockquote.dataset.quoteId = quote.id
    const quoteP = document.createElement('p')
        quoteP.innerText = quote.quote
        quoteP.className = 'mb-0'
    const footer = document.createElement('footer')
        footer.className = 'blockquote-booter'
        footer.innerText = quote.author
    const br = document.createElement('br')
    const likesBtn = document.createElement('button')
        likesBtn.className = "btn-success"
        likesBtn.innerHTML = `Likes: <span>${likesNumber}</span>`
        likesBtn.dataset.quoteId = quote.id
        likesBtn.addEventListener('click',likeQuote)
    const deleteBtn = document.createElement('button')
        deleteBtn.className = 'btn-danger'
        deleteBtn.innerText = "Delete"
        deleteBtn.dataset.quoteId = quote.id
        deleteBtn.addEventListener('click',deleteQuote)
    
    blockquote.append(quoteP,footer,br,likesBtn,deleteBtn)
    list.appendChild(blockquote)
    
}

const likeQuote = (e) => {
    
    quoteId = parseInt(e.target.dataset.quoteId)
    let currentNumberLikes = parseInt(e.target.innerHTML.split("<span>")[1].split("</span>")[0])
    
    console.log(currentNumberLikes)

    likeObj = {
        "quoteID": quoteId,
        "createdAt": Date.now()
    }
    reqObj = {
        headers: {"Content-Type":"application/json"},
        method: "POST",
        body: JSON.stringify(likeObj)
    }
    console.log(reqObj)
    fetch("http://localhost:3000/likes",reqObj)
    .then(res=>res.json()).then(updatedLike => {
        e.target.innerHTML = `Likes: <span>${currentNumberLikes+1}</span>`})
}

const deleteQuote = (e) => {
    quoteId = parseInt(e.target.dataset.quoteId)
    console.log(quoteId)

    reqObj={
        method:"DELETE",
        headers: {'Content-Type': 'application/json'}
    }
    
    fetch("http://localhost:3000/quotes/"+quoteId,reqObj).then(res => res.json()).then(quote => {
        document.querySelector(`blockquote[data-quote-Id="${quoteId}"]`).innerHTML=""})
}

function newQuote(e) {
    e.preventDefault()
    console.log(e.target.quote.value)
    
    quote = {
        "quote":e.target.quote.value,
        "author":e.target.author.value
    }

    reqObj = {
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(quote)
    }

    fetch(BASE_URL,reqObj).then(res=>res.json()).then(savedQuote => {
        fetchQuotes()
        document.getElementById('new-quote-form').reset()})
}
