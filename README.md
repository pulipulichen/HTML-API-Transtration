# HTML-API-Transtration

````html
<script src="https://pulipulichen.github.io/puli-post-message-api/puli-post-message-api.min.js"></script>
<script>
(async function () {
  let api = PuliPostMessageAPI()

  let url = 'https://pulipulichen.github.io/HTML-API-Transtration/index.html'
  let data = {
    text: '待翻譯的文字',
    lang: 'en'
  }
  let result = await api.send(url, data)
})()
</script>
````

# Minify

https://www.toptal.com/developers/javascript-minifier/

# TODO

- HTML Cache