let api = PuliPostMessageAPI()

api.addReceiveListener(async function ({text, lang}) {
  //console.log('收到')
  
  setSource(text)
  setGoogleTransCookie(lang)
  
  return await googleTranslateElementInit()
})