let api = PuliPostMessageAPI()

api.addReceiveListener(async function ({text, lang}) {
  //console.log('收到')
  
  if (setSource(text) === false) {
    return text
  }
  setGoogleTransCookie(lang)
  let isArray = Array.isArray(text)
  
  let result = await googleTranslateElementInit()
  if (!isArray) {
    result = result[0]
  }
  return result
})