var keepValue = !!keepValue ? keepValue : false

var type = 'text'
var useAmt = 0
var maxUses = 10
var maxMessage = `You will now exceed ${maxUses} continuous messages. Please <a href="javascript:location.reload()">Start a New Conversation</a> to send more messages.`
var messageSpeed = 1

var toolbar
var chatElement
var langElement
var sendBtn
var checkForSend = e => {
  if (e.keyCode === 13 && !e.shiftKey && chatElement.value !== '\n') {
    e.preventDefault()
    sendMessage()
  }
}

var queryString
var urlParams
var filelocation = ''

var urls = []
var fnames = ''
var nameStr = ''

var specialActs4Conv = function(x,y,z) {}

var lastAnswer = ''
var lastQuestion = ''

var finaValu = ''
var prevValu = ''
var currValu = ''
var oSpeechRecognizer = null

function handleUpload(query) {
  query = query ?? queryString ?? window.location.search
  var params = new URLSearchParams(query)

  fnames = params.get('name')
  filelocation = params.get('filelocation')

  handleFiles()
}

function addToPrompt(prompt) {
  if (prompt.endsWith('\n')) {
    prompt = prompt.slice(0, -1)
  }
  if (prompt.endsWith(' ')) {
    prompt = prompt.slice(0, -1)
  }
  if (
    !prompt.endsWith('.') && 
    !prompt.endsWith('?') && 
    !prompt.endsWith('!') && 
    nameStr
  ) prompt += '.'
  if (nameStr) prompt += ` ${nameStr}`
  if (prompt.endsWith(' ')) {
    prompt = prompt.slice(0, -1)
  }
  if (prompt.endsWith(' ')) {
    prompt = prompt.slice(0, -1)
  }
  if (
    !prompt.endsWith('.') && 
    !prompt.endsWith('?') && 
    !prompt.endsWith('!') && 
    nameStr
  ) prompt += '.'
  if (prompt.endsWith(' ')) {
    prompt = prompt.slice(0, -1)
  }
  prompt = prompt.replaceAll('  ', ' ')
  return prompt
}

function sendMessage(prompt, showUserMessage=true) {
  sendBtn.removeEventListener('click', sendMessage)
  chatElement.removeEventListener('input', checkForSend)
  if (!!prompt === false) prompt = chatElement.value

  var lPrompt = prompt.toLowerCase()
  lPrompt = lPrompt.replaceAll(' ', ' ')

  if (lPrompt === 'tryagain') {
    if (lastQuestion) prompt = lastQuestion
  }
  else {
    lastQuestion = prompt
  }
  prompt = addToPrompt(prompt)

  if (prompt.toLowerCase().startsWith('continue')) {
    var lastMessage = document.querySelectorAll('.messages > .message.user')
    lastMessage = lastMessage[lastMessage.length-1]
    var lastTextSpan = lastMessage.querySelector('.text__span')
    var lastMessageContent = lastTextSpan.innerHTML
    var newMessageContent = lastAnswer
    if (newMessageContent.startsWith(lastMessageContent)) {
      newMessageContent = newMessageContent.substring(lastMessageContent.length)
    }
    newMessage('ai', newMessageContent)
    return
  }
  else {
    var newPrompt = prompt
    prompt = prompt.replaceAll('  ', ' ')
    if (!!urls) {
      newPrompt += '<div class="chat-imgs">'
      urls.forEach(function(u, i) {
        newPrompt += `<img class="input-image" src="${u}" alt="Image #${i+1}">`
      })
      newPrompt += '</div>'
    }
    if (showUserMessage) newMessage('user', newPrompt)
    type = !!type ? type : !!urls ? 'image' : 'text'
    newRequest(type, prompt, filelocation=filelocation)
  }
  if (!keepValue) chatElement.value = ''
}

function ChangeLang(e) {
  if (oSpeechRecognizer) {
    oSpeechRecognizer.lang = langEle.value;
    //SpeechToText()
  }
}

function handleFiles() {
  if (!!fnames) {
    if (!type) type = 'image'
    if (fnames.includes(',')) fnames = fnames.split(',')
    else fnames = [fnames]
  }
  if (!!urls) {
    type = 'image'
    if (typeof urls === 'string') {
      if (urls.includes(',')) urls = urls.split(',')
      else urls = [urls]
    }
    urls.forEach(function(u, i) {
      urls[i] = urls = decodeURIComponent(u)
    })
  }
  else if (!!fnames) urls = []
  if (filelocation == 'temp-storage') {
    nameStr += ` The names of the files are [`
    fnames.forEach(function(n, i) {
      urls.push(`${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}/temp/${n}`)
      if (i !== 0) nameStr += `, `
      nameStr += `"${n}"`
    })
    nameStr = `${nameStr}].`.toString()
    nameStr = nameStr.replaceAll('  ', ' ')
  }
}

window.addEventListener('DOMContentLoaded', function (e) {
  queryString = window.location.search;
  urlParams = new URLSearchParams(queryString);
  filelocation = urlParams.get('filelocation');

  type = !!urlParams.get('type') ? urlParams.get('type') : type
  fnames = urlParams.get('name');
  urls = urlParams.get('url');

  handleFiles()
  
  if (!!lastAnswer !== false) {
    if (type === 'makeai') location.href = `https://ImaGPT.adarshrkumar.dev/create?prompt=${lastAnswer}`
  }
  else {
    setInterval(function() {
      if (!!lastAnswer !== false) {
        if (type === 'makeai') location.href = `https://ImaGPT.adarshrkumar.dev/create?prompt=${lastAnswer}`
      }
    }, 100)
  }

  langElement = document.getElementById('selLang')
  if (!!langElement) {
    langElement.addEventListener('change', ChangeLang)
  }
  if ('webkitSpeechRecognition' in window) {
  } 
  else {
    //speech to text not supported
    if (!!document.querySelector('label.dictate')) {
      document.querySelector('label.dictate').style.display = 'none';
    }
  }
  var dictChk = document.getElementById('chkSpeak')
  if (!!dictChk) {
    dictChk.addEventListener('change', SpeechToText)
  }

  toolbar = document.querySelector('.toolbar')
  chatElement = toolbar.querySelector('.input')

  var supportsAutosize = CSS.supports("field-sizing: content");
  if (!supportsAutosize) {
    chatElement.addEventListener('input', (e) => {
      e.target.style.height = "";
      e.target.style.height = `${e.target.scrollHeight}px`
    })
  }

  sendBtn = toolbar.querySelector('.send-btn')

  chatElement.focus()
  sendBtn.addEventListener('click', sendMessage)
  chatElement.addEventListener('keypress', checkForSend)

  newRequest(
    'text', startingPrompt, null, null, 
    'box', {variation: 'info', name: 'welcome'}
  )
});

async function newRequest(type, prompt, voice, filelocation, messageType, moreParams={}) {
  var isAtMax = useAmt >= maxUses
  useAmt++

  var model = document.getElementById('model').value

  if (type == 'create-image') {
    prompt = prompt.replaceAll(' \n ', '\n')
    prompt = prompt.replaceAll(' \n', '\n')
    prompt = prompt.replaceAll('\n ', '\n')
  }

  var reqObj = {p: prompt, type: type, model: model}

  if (!!thread) reqObj.thread = thread
  if (!!filelocation) reqObj.fl = filelocation
  if (!!urls && Array.isArray(urls) && urls.length > 0) reqObj.urls = urls
  if (!!voice) reqObj.systemid = voice
    if (messageType == 'box') {
    if (!!moreParams) {
      if (!!moreParams.name) {
        if (moreParams.name == 'welcome') {
          reqObj.startingmessage = true
        }
      }
    }
  }

  if (isAtMax) {
    moreParams.maxMessages = true
  }

  var response = await fetch('/sendRequest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqObj),
  });

  var output = await response.text()

  var role = 'ai'
  if (messageType) role = messageType
  if (
    (
      output.startsWith('{') && 
      output.endsWith('}')
    ) || 
    (
      output.startsWith('[') && 
      output.endsWith(']')
    )
  ) {
    output = JSON.parse(output)
  }
  if (typeof output === 'object') {
    role = output.status.toLowerCase()
    if (role === 'ok') role = 'ai'
    else if (role === 'appok') {
      messageType = 'box'
      moreParams = {variation: 'appInfo', isApp: true}
    }
    else if (role === 'error') {}
    else if (messageType !== 'box') {
      messageType = 'box'
      moreParams = {variation: role}
      if (isAtMax) {
        moreParams.maxMessages = true
      }
    }

    if (output?.isApp) {
      output = {name: output.name, args: output.args}
    }
    else output = output.content
  }
  
  switch (type) {
    case 'create-image':
      output = `<img src="${output}" alt="Generated Image">` 
      break;
    case 'create-audio': 
      output = `<video src="${output}" alt="Generated Audio" autoplay>` 
      break;
  }
  
  if (messageType === 'box') {
    newMessage(messageType, output, moreParams)
  }
  else {
    newMessage(role, output, moreParams)
    lastAnswer = output
  }
}

function newMessage(role, content, moreParams={}) {
  var interval = null
  var message = document.createElement('div');
  message.classList.add('message');
  message.classList.add(role);
  switch (role) {
    case 'box': 
      variation = moreParams.variation
      if (!!variation === false) variation = 'info'
      message.classList.add(variation)

      if (moreParams?.isApp && typeof content === 'object') {
        checkIfApp(content, moreParams);
        return
      }
      break
    case 'app': 
      var appName = moreParams.appName
      message.classList.add(appName)
      break
  }

  if (role !== 'error' && role !== 'box') {
    let image = document.createElement('div');
    image.classList.add('image');
    message.appendChild(image);
  }

  var text = document.createElement('span');
  text.classList.add('text');

  let textSpan = document.createElement('span');
  textSpan.classList.add('text__span');
  text.appendChild(textSpan);

  message.appendChild(text);

  document.querySelector('.messages').appendChild(message)

  var staggerRoles = [
    'ai', 
    'app', 
    'error', 
    'box', 
  ]

  var isRole = staggerRoles.filter(r => role === r).length > 0
  if (isRole) {
    var sI = 0;
    if (!!content) {
      // content = content.replaceAll('&lt;', '<').replaceAll('&gt;', '>')
      doActs();
      interval = setInterval(doActs, messageSpeed);
    }
    else {
      textSpan.innerHTML = 'Unknown Error'

      sendBtn.addEventListener('click', sendMessage)
      chatElement.addEventListener('keypress', checkForSend)
    
      setScrollPos()
    }
    function doActs() {
      if (sI < content.length) {
        sendBtn.removeEventListener('click', sendMessage)
        chatElement.removeEventListener('keypress', checkForSend)
      
        textSpan.innerHTML = marked.parse(content.slice(0, sI+1))
        // textSpan.innerHTML = textSpan.innerHTML.replaceAll('&lt;', '<').replaceAll('&gt;', '>')
        sI++;
      }
      else {
        clearInterval(interval);
        specialActs4Conv(role, content, moreParams)

        sendBtn.addEventListener('click', sendMessage)
        chatElement.addEventListener('keypress', checkForSend)
      
        if (moreParams?.isApp) {
          var newContent = content
          if (moreParams?.modelContent) newContent = moreParams.modelContent
        }
    
        if (moreParams?.maxMessages && !moreParams?.isApp && !moreParams?.maxMessage) {
          chatElement.disabled = true
          sendBtn.removeEventListener('click', sendMessage)
          chatElement.removeEventListener('keypress', checkForSend)
        
          newMessage('error', maxMessage, {maxMessage: true})
        }
      }
    }
    setScrollPos()
  } 
  else {
    textSpan.innerHTML = content  

    sendBtn.addEventListener('click', sendMessage)
    chatElement.addEventListener('keypress', checkForSend)
  
    setScrollPos()
  }
}

function checkIfApp(app, moreParams) {
  if (moreParams?.isApp && typeof app === 'object' && appsData) {
    var args = Object.values(app.args)

    appsData[app.name](...args)
  }
}

function setScrollPos() {
  var element = document.querySelector('.messages');
  element.scrollTop = element.scrollHeight;
}

function SpeechToText() {
  chatElement.disabled = false
  sendBtn.addEventListener('click', sendMessage)
  chatElement.addEventListener('keypress', checkForSend)

  if (oSpeechRecognizer) {
    if (chkSpeak.checked) {
      oSpeechRecognizer.start();
    } 
    else {
      oSpeechRecognizer.stop();
    }
    return;
  } 

  oSpeechRecognizer = new webkitSpeechRecognition();
  oSpeechRecognizer.continuous = true;
  oSpeechRecognizer.interimResults = true;
  oSpeechRecognizer.lang = selLang.value;
  oSpeechRecognizer.start();

  oSpeechRecognizer.onresult = function (e) {
    chatElement.disabled = true
    sendBtn.removeEventListener('click', sendMessage)
    chatElement.removeEventListener('keypress', checkForSend)
  
    var interimTranscripts = '';
    for (var i = e.resultIndex; i < e.results.length; i++) {
      var transcript = e.results[i][0].transcript;
      if (e.results[i].isFinal) {
        prevValu += currValu
        finaValu += currValu
        chatElement.value = finaValu
        currValu = ''

        chatElement.disabled = false
        sendBtn.addEventListener('click', sendMessage)
        chatElement.addEventListener('keypress', checkForSend)
      }
      else {
        interimTranscripts += transcript;
        currValu = interimTranscripts
        prevValu = finaValu + interimTranscripts
        chatElement.value = prevValu
      }

      chatElement.disabled = false
      sendBtn.addEventListener('click', sendMessage)
      chatElement.addEventListener('input', checkForSend)
    }
  };

  oSpeechRecognizer.onerror = function (e) {};
}