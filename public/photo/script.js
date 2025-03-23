var btn = document.querySelector('.take')
var blocker = document.querySelector('.blocker')

var searchParams = window.location.search
var queryParams = new URLSearchParams(searchParams)
var mode = queryParams.get('mode')

function secondTimer(ele, num, callback) {
  setTimeout(() => {
    ele.setAttribute('open', true)
    ele.textContent = num
    
    var i = 1
    var int = setInterval(() => {
      ele.textContent = num-i
  
      i++
      if (i >= num) {
        clearInterval(int)
        setTimeout(() => {
          ele.textContent = 'Taking Photo'
          setTimeout(() => {
            ele.textContent = ''
            ele.removeAttribute('open')
  
            callback()
          }, 2000)
        }, 1000)
      }
    }, 1000)
  }, 1000)
}

switch (mode) {
  case 'live-image':
    btn.onclick = uploadForLiveChat
    btn.style.display = 'none'

    window.addEventListener('DOMContentLoaded', () => secondTimer(blocker, 3, uploadForLiveChat))

    break
  default:
    btn.onclick = download
    break
}
        
var vdo = document.querySelector('video');
var img

if (navigator.mediaDevices.getUserMedia) {       
  navigator.mediaDevices.getUserMedia({video: true})
  .then(function(stream) {
    vdo.srcObject = stream;
  })
  .catch(function(error) {
    console.log('Something went wrong!');
  });
}

function captureVideo(video) {
  var canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  var canvasContext = canvas.getContext('2d');
  canvasContext.drawImage(video, 0, 0);
  return {canvas: canvas, url: canvas.toDataURL('image/png')}
}

function showImg() {
  var src = captureVideo(vdo).url
  vdo.setAttribute('hidden', '')
  if (!!img === false) {
    img = document.createElement('img')
  }
  else {
    img.removeAttribute('hidden')
  }
  img.src = src
  document.querySelector('video').prepend(img)

  btn.textContent = 'Download'
  btn.onclick = download
}

function download() {
  var src = captureVideo(vdo).url
  var a = document.createElement('a')
  a.style = 'width: 0; height: 0; display: none;'
  a.href = src;
  a.download = `Photo ${new Date().toISOString().replace(/:/g, '-')}.png`
  document.body.appendChild(a)
  a.click()
  window.parent.removeActive()
  location.href = '/upload'
}

function uploadForLiveChat() {
  var canvas = captureVideo(vdo).canvas

  canvas.toBlob(async blob => {
    const file = new File( [ blob ], `Photo ${new Date().toISOString().replace(/:/g, '-')}.png`, { type: 'image/png' } );
  
    const formData = new FormData();
    formData.append('image', file);

    var response = await fetch('/uploadFile?redirect=false', {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      var json = await response.json()
      console.log(json)
      if (parent !== window && parent.appsData) {
        if (parent.appsData.sendLiveImage) {
          parent.appsData.sendLiveImage([json])
        }
        else console.error('File upload failed');
      }
      else console.error('File upload failed');
    }
    else console.error('File upload failed');
  });
}