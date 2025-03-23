var photoBtn = document.querySelector('.photo')
var photoArea = document.querySelector('.iframe-area.photo')
var form = document.querySelector('form')

photoBtn.onclick = function(e) {
  photoArea.querySelector('iframe').src = '/photo/take'
  if (photoArea.classList.contains('active')) {
    photoArea.querySelector('iframe').src = ''
  }
  photoArea.classList.toggle('active')
}

var queryString = window.location.search
var urlParams = new URLSearchParams(queryString)

var uQuerys = ''

var sucess = urlParams.get('success') === 'true' ? true : false
if (sucess && window.parent !== window && window.parent.handleUpload) {
  window.parent.handleUpload(location.search)
}
else {
  var prompt = urlParams.get('prompt')
  if (!!prompt) {
    if (!uQuerys) uQuerys += '?'
    else uQuerys += '&'
    uQuerys += prompt
  }
  var type = urlParams.get('type')
  if (!!type) {
    if (!uQuerys) uQuerys += '?'
    else uQuerys += '&'
    uQuerys += type
  }

  var isBulk = urlParams.get('isBulk') === 'true' ? true : false
  if (isBulk) {
    if (!uQuerys) uQuerys += '?'
    else uQuerys += '&'
    uQuerys += isBulk
  }
}

var submitBtn = document.querySelector('input[type="submit"]')

submitBtn.addEventListener('click', async e => {
  var files = document.querySelector('input[type="file"]').files
  var file = files[0]

  const formData = new FormData();
  formData.append('image', file);

  var response = await fetch(`/uploadFile`, {
    method: 'POST',
    body: formData
  })

  if (response.ok) {
    var json = await response.json()
    console.log(json)
    // if (parent !== window) {
    //   if (parent.handleUpload) {
    //     parent.handleUpload(location.search)
    //   }
    //   else {
    //     console.error('File upload failed');
    //   }
    // }
  
    // if (parent !== window && parent.appsData) {
    //   if (parent.appsData.sendLiveImage) {
    //     parent.appsData.sendLiveImage([json])
    //   }
    //   else console.error('File upload failed');
    // }
    // else console.error('File upload failed');
  }
})

function removeActive() {
  photoArea.classList.remove('active')
  photoArea.querySelector('iframe').src = ''
}