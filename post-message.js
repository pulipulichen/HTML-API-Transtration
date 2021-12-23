let api = PuliPostMessageAPI()

api.addReceiveListener(async function ({text, lang}) {
  //console.log('收到')
  
  let isArray = Array.isArray(text)
  let filteredText = filterText(text)
  if (filteredText === false) {
    return text
  }
  
  let cachedText = hasCachedText(text, lang)
  
  if (cachedText !== false) {
    return cachedText
  }
  //console.log(filteredText)
  text = filteredText
  
  setSource(text)
  setGoogleTransCookie(lang)
  
  let result = await googleTranslateElementInit()
  //console.log(result)
  if (!isArray) {
    result = result[0]
  }
  return result
})