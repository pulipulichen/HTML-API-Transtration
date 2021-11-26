# HTML-API-Transtration


https://pulipulichen.github.io/puli-post-message-api/puli-post-message-api.min.js

````
let api = PuliPostMessageAPI()

let url = 'index.html'
let data = {
  text: '待翻譯的文字',
  lang: 'en'
}
let result = await api.send(url, data)
````