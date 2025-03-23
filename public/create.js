var imagesAmt = 4
var gridCols = 4
var gridRows = Math.ceil(imagesAmt / gridCols)
document.querySelector('.images').style.setProperty('--cols', gridCols)
document.querySelector('.images').style.setProperty('--rows', gridRows)

var i = 0
var p
var u
var t = 'create-image'
var chatElement
var queryString
var urlParams

window.addEventListener('DOMContentLoaded', function (e) {
  queryString = window.location.search;
  urlParams = new URLSearchParams(queryString);

  p = urlParams.get('prompt')
  u = urlParams.get('urls')

  chatElement = document.querySelector('.input-parent .input')
  chatElement.focus()
  chatElement.addEventListener('keyup', function(e) {
    p = chatElement.value
    if (e.keyCode === 13 && chatElement.value !== '') {
      sendMessages(p, imagesAmt, t, u)
    }
  })
  chatElement.parentNode.querySelector('.send-btn').addEventListener('click', function(e) {
    sendMessages(p, imagesAmt, t, u)
  })
});

function sendMessages(prompt, amt, type, urls) {
  chatElement.value = prompt
  if (type === 'starting') type = t
  else chatElement.value = ''
  for (var i = 0; i < amt; i++) {
    newRequest(type, prompt, urls)
  }
}

function newRequest(type, prompt, urls, messageType, moreParams) {
  var reqUrl = `/sendRequest?p=${prompt}&t=${type}&urls=${urls}`
  
  var xhr = new XMLHttpRequest();
  xhr.open('GET', reqUrl);
  xhr.addEventListener('load', function () {
    var response = this.responseText;
    var role = 'ai'
    if (messageType === 'box') {
      newMessage(messageType, response, moreParams)
    }
    else {
      newMessage(role, response)
    }
  });
  xhr.send();
}

function newMessage(role, resp, moreParams) {
  var status = 'Error'
  var eMessage = 'An Unknown Error Occured'
  if (resp.startsWith('{') || resp.startsWith('[')) {
    resp = JSON.parse(resp)
    if (resp.status) {
      status = resp.status
      if (status === 'Error') {
        if (!!resp.message) {
          eMessage = resp.message
        }
      }
    }
  }
  else {
    eMessage = resp
  }
  var src = ''
  if (status !== 'Error') {
    src = resp.url
  }

  var message = document.createElement('a');
  message.classList.add('image');
  message.href = `/viewImage?u=${btoa(src)}&p=${p}`
  if (role === 'box') {
    variation = moreParams.variation
    if (!!variation === false) variation = 'info'
    message.classList.add(variation)
  }
  message.classList.add('message');

  var imageEle = 'img'
  if (role === 'box' || status === 'Error') {
    imageEle = 'span'
  }
  var img = document.createElement(imageEle);
  img.classList.add('img');
  img.src = src

  var eleNode = message
  if (status === 'Error') {
    img.innerHTML = eMessage
    eleNode = img
  }
  else {
    message.appendChild(img);
  }

  addToImgGroup(eleNode)
}

function addToImgGroup(element) {
  if ((i+1)%imagesAmt === 1 || i < 1) {
    var newGroup = document.createElement('div')
    newGroup.classList.add('image-group')
    document.querySelector('.images').prepend(newGroup)
  }
  var imgGroup = document.querySelector('.image-group')
  imgGroup.appendChild(element)
  i++
}