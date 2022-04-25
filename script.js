/* global google */

let isOK = false
function ok() {
  isOK = true
}

let originalSource
let SourceContainer = document.querySelector('#SourceContainer')
let isFirstTranslate = true

function filterText(text) {
  if (typeof(text) === 'string') {
    text = [text.trim()]
  }
  else if (Array.isArray(text)) {
    text = text.map(t => t.trim())
  }
  else {
    return false
  }
  return text
}

function hasCachedText(text, lang) {
  let cachedTextList = []
  for (let i = 0; i < text.length; i++) {
    let key = `trans[${lang}]:` + text[i]
    let value = localStorage.getItem(key)
    
    if (typeof(value) === 'string'
            && value !== '') {
      cachedTextList.push(value)
    }
    else {
      return false
    }
  }
  return cachedTextList
}

function removeControlCharacter(str) {
  return str.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
}

function setSource(text) {
  
  if (hasTranslated()) {
    document.body.innerHTML = `<div id="SourceContainer"></div>
  <div id="google_translate_element"></div>`
    SourceContainer = document.querySelector('#SourceContainer')
  }

  text.forEach(t => {
    let span = document.createElement("div")
    span.innerText = removeControlCharacter(t)
    SourceContainer.appendChild(span)
  })
  
  //source.innerText = text.trim()
  originalSource = text
}

let currentTarget

function setGoogleTransCookie(target) {
  //console.log(target, currentTarget)
  if (currentTarget !== target) {
    //if (document.cookie === '') {
    document.cookie = 'googtrans=/auto/' + target
    //console.log(document.cookie)
    //}
    currentTarget = target

    setTimeout(() => {
      let selector = document.querySelector(".goog-te-combo")
      if (selector && selector.value !== target) {
        selector.value = target
        selector.dispatchEvent(new Event("change"));
      }
    }, 3000)
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
    /*
    let firstSpan = SourceContainer.lastChild
    console.log(firstSpan)
    
    let hasCalled = false
    firstSpan.addEventListener("DOMSubtreeModified", async () => {
      if (hasCalled === true) {
        return false
      }
      hasCalled = true
      let result = await callbackToOpener()
      
      saveToLocalStorage(result)
      
      //console.log(result)
      resolve(result)
    }, false);
    */
    let collection = SourceContainer.children;
    let hasCalled = false
    for (let i = 0; i < collection.length; i++) {
      let span = collection[i]
      span.setAttribute('data-index', i)
      //console.log(span)
    }
    
    let loop = async function () {
      let span = document.querySelector('div[data-index]')
      //console.log(span)
      if (span) {
        //span.scrollIntoView({block: 'center'})
        window.scroll({
          top: span.offsetTop
        })
        //console.log(span, 'scroll', span.offsetTop)
        
        span.removeAttribute('data-index')
        
        setTimeout(() => {
          loop()
        }, 500)
      }
      else {
        if (hasCalled === true) {
          return false
        }
        hasCalled = true
        let result = await callbackToOpener()

        saveToLocalStorage(result)

        //console.log(result)
        resolve(result)

      }
    }
    loop()
  })
  
}

function saveToLocalStorage (result) {
  // originalSource
  for (let i = 0; i < result.length; i++) {
    let key = `trans[${currentTarget}]:` + originalSource[i]
    let value = result[i]
    
    
    try {
      localStorage.setItem(key, value)
    }
    catch (e) {
      console.error(e)
      removeOldestItem()
      return saveToLocalStorage(result)
    }
  }
}

function removeOldestItem () {
  for (let i = 0; i < 100; i++) {
    let key = localStorage.key(0)
    if (!key) {
      return true
    }
    
    localStorage.removeItem(localStorage.key(0))
  }
  
  return true
}

function localStorageUsageSpace() {
    var data = '';

    //console.log('Current local storage: ');

    for(var key in window.localStorage){
        if(window.localStorage.hasOwnProperty(key)){
            data += window.localStorage[key];
            //console.log( key + " = " + ((window.localStorage[key].length * 16)/(8 * 1024)).toFixed(2) + ' KB' );
        }
    }

    return ((data.length * 16)/(8 * 1024)).toFixed(2)
    //console.log(data ? '\n' + 'Total space used: ' + ((data.length * 16)/(8 * 1024)).toFixed(2) + ' KB' : 'Empty (0 KB)');
    //console.log(data ? 'Approx. space remaining: ' +  + ' KB' : '5 MB');
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
  document.querySelectorAll('#SourceContainer div').forEach(span => {
    let trans = span.innerText.trim()
    if (trans.startsWith('"') && trans.endsWith('"')) {
      trans = trans.slice(1, -1)
    }
    output.push(trans)
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
