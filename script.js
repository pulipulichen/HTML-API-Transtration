let isOK = false
function ok() {
  isOK = true
}

let originalSource
let source = document.querySelector('#source')

function setSource(text) {
  source.innerText = text.trim()
  originalSource = text.trim()
}

function setGoogleTransCookie(target) {
  //if (document.cookie === '') {
  document.cookie = 'googtrans=/auto/' + target;
  //}
}

function googleTranslateElementInit() {
  //console.log(isOK)
  if (isOK === false) {
    setTimeout(() => {
      googleTranslateElementInit()
    }, 1000)
    return true
  }

  //setGoogleTransCookie()

  new google.translate.TranslateElement({
    //pageLanguage: 'zh_TW',
    autodisplay: false,
    //autodisplay: true,
    layout: google.translate.TranslateElement.FloatPosition.TOP_LEFT
  }, 'google_translate_element')
  
  return new Promise((resolve) => {
    document.getElementById("source").addEventListener("DOMSubtreeModified", () => {
      let result = callbackToOpener()
      resolve(result)
    }, false);
  })
  
}

function sleep (ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callbackToOpener() {
  while (document.querySelectorAll('.goog-te-combo').length === 0) {
    await sleep(100)
  }
  
  let output = source.innerText.trim()
  while (output === originalSource) {
    await sleep(100)
    output = source.innerText.trim()
  }
  
  return output
}

/*
setTimeout(() => {
  setGoogleTransCookie('en')
  googleTranslateElementInit()
}, 1000)
*/