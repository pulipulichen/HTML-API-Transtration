let isOK = false
function ok() {
  isOK = true
}

function setGoogleTransCookie(target) {
  //if (document.cookie === '') {
  document.cookie = 'googtrans=/auto/' + target;
  //}
}

function googleTranslateElementInit() {
  console.log(isOK)
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
  }, 'google_translate_element');
  document.getElementById("source").addEventListener("DOMSubtreeModified", callbackToOpener, false);
}
function callbackToOpener() {
  setTimeout(function () {
    let output = $('#source').text()
    // let originalSource = $('#originalSource').val()

    if ($('.goog-te-combo').length === 0) {
      callbackToOpener()
      return true
    }

    let originalSource = $('#originalSource').val()
    if (output === originalSource) {
      callbackToOpener()
      return true
    }

    console.log(output)
    return false

    let note = window.top.$(window.top.document.body).find('.wait-trans')
    note.val(output)
    note.trigger("autosize.resize")
    setTimeout(() => {
      //note.focus()
      note.removeClass('wait-trans')
      note.removeClass('loading')

      /*
       let offset = note.offset()
       if (offset !== undefined) {
       let top = offset.top
       //console.log(top)
       //window.top.document.body.scrollTo(0, top)
       }
       */
      //window.close()
      location.reload()
    }, 0)

  }, 500)
}

setTimeout(() => {
  setGoogleTransCookie('en')
  googleTranslateElementInit()
}, 1000)
