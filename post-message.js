let api = PuliPostMessageAPI()

api.addReceiveListener(async function ({text, lang}) {
  //console.log('收到')
  let filteredText = filterText(text)
  if (filteredText === false) {
    return text
  }
  
  let cahcedText = hasCachedText(text, lang)
  if (cahcedText !== false) {
    return cahcedText
  }
  
  text = filteredText
  
  setSource(text)
  setGoogleTransCookie(lang)
  let isArray = Array.isArray(text)
  
  let result = await googleTranslateElementInit()
  if (!isArray) {
    result = result[0]
  }
  return result
})