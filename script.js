/* global google */

let isOK = false
function ok() {
  isOK = true
}

let originalSource
let SourceContainer = document.querySelector('#SourceContainer')
let isFirstTranslate = true

function setSource(text) {
  if (typeof(text) === 'string') {
    text = [text.trim()]
  }
  else if (Array.isArray(text)) {
    text = text.map(t => t.trim())
  }
  else {
    return false
  }
  
  
  if (hasTranslated()) {
    document.body.innerHTML = `<div id="SourceContainer"></div>
  <div id="google_translate_element"></div>`
    SourceContainer = document.querySelector('#SourceContainer')
  }

  text.forEach(t => {
    let span = document.createElement("span")
    span.innerText = t
    SourceContainer.appendChild(span)
  })
  
  //source.innerText = text.trim()
  originalSource = text
}

let currentTarget

function setGoogleTransCookie(target) {
  if (currentTarget !== target) {
    //if (document.cookie === '') {
    document.cookie = 'googtrans=/auto/' + target
    //console.log(document.cookie)
    //}
    currentTarget = target
  }
}

async function googleTranslateElementInit() {
  //console.log(isOK)
  while (isOK === false) {
    await sleep(1000)
  }
  //console.log(isOK)

  
  //setGoogleTransCookie()

  new google.translate.TranslateElement({
    //pageLanguage: 'zh_TW',
    autodisplay: false,
    //autodisplay: true,
    layout: google.translate.TranslateElement.FloatPosition.TOP_LEFT
  }, 'google_translate_element')
  
  return new Promise((resolve) => {
//    console.log(document.getElementById("source"))
//    setTimeout(() => {
//      console.log(document.getElementById("source"))
//    }, 1000)
    let firstSpan = SourceContainer.firstChild
    //console.log(firstSpan)
    
    let hasCalled = false
    firstSpan.addEventListener("DOMSubtreeModified", async () => {
      if (hasCalled === true) {
        return false
      }
      hasCalled = true
      let result = await callbackToOpener()
      //console.log(result)
      resolve(result)
    }, false);
  })
  
}

function sleep (ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function hasTranslated() {
  if (isFirstTranslate === false) {
    return true
  }
  
  return (document.querySelectorAll('.goog-te-combo').length > 0)
}

async function callbackToOpener() {
  //console.log('a')
  while (hasTranslated() === false) {
    await sleep(100)
  }
  
  let firstSpan = SourceContainer.firstChild
  let firstSpanOutput = firstSpan.innerText.trim()
  while (firstSpanOutput === originalSource[0]) {
    await sleep(100)
    firstSpan = SourceContainer.firstChild
    firstSpanOutput = firstSpan.innerText.trim()
  }
  
  let output = []
  document.querySelectorAll('#SourceContainer span').forEach(span => {
    output.push(span.innerText.trim())
  })
  
  isFirstTranslate = false
  
  return output
}

/*
setTimeout(() => {
  setGoogleTransCookie('en')
  googleTranslateElementInit()
}, 1000)
*/