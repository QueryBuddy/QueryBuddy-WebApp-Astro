var firstGeolocation = true

var appsData = {
  weather: async function(latitude, longitude) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        if (!latitude) latitude = position.coords.latitude;
        if (!longitude) longitude = position.coords.longitude;

        goWeather(latitude, longitude)
      });
    }
    else {
      if (firstGeolocation) {
        newMessage('box', "I'm going to need to know your location to get the weather so I hope you've enabled it.", {variation: 'alert'})
        firstGeolocation = false
      }
      if (!navigator.geolocation) {
        newMessage('error', 'Geolocation is not supported by this browser.')
      }
      return
    }

    async function goWeather(latitude, longitude) {
      var response = await fetch(`/getWeather?lat=${latitude}&lon=${longitude}`)
      if (response.ok) {
        var weather = await response.json()
        newRequest('text', JSON.stringify(weather))
        // newMessage('app', weather, {isApp: true, appName: 'weather'})
      }
      else {
        newMessage('box', 'Unable to get weather.', {variation: 'alert'})
      }
    }
  },
  openLink: async function(links) {
    links.forEach(async link => {
      open(link)
      newMessage('app', `Opened "${link}".`, {appName: 'openLink'})
    })
  },
  createImage: async function(prompt) {
    newRequest('create-image', prompt)
  }, 
  transcribeAudio: async function(_) {
    if (!fnames) {
      var params = new URLSearchParams(window.location.search)
      var names = params.get('name')
      if (!!names) {
        if (names.includes(',')) names = names.split(',')
        else names = [names]
      }
    }

    fnames.forEach(async function(n, i) {
      newRequest('transcribe-audio', n)
    })
  },
  liveImage: async function(_) {
    this.takeLiveImage()
  },
  takeLiveImage: async function(_) {
    var dialog = document.querySelector('.live-photo')

    var iframe = dialog.querySelector('iframe')
    iframe.src = iframe.getAttribute('data-src')
    iframe.removeAttribute('data-src')

    dialog.showModal()
  },
  showHTML: async function(html) {
    var preview = document.querySelector('.html-preview')

    preview.srcdoc = html
  },
  sendLiveImage: async function(json) {
    var dialog = document.querySelector('.live-photo')
    dialog.close()

    var iframe = dialog.querySelector('iframe')
    iframe.setAttribute('data-src', iframe.src)
    iframe.src = ''


    lastMessage = lastMessage[lastMessage.length-1]
    var lastTextSpan = lastMessage.querySelector('.text__span')
    var lastMessageContent = lastTextSpan.innerHTML

    fnames = json.name
    filelocation = json.filelocation

    handleFiles()

    type = 'live-image-send'
    sendMessage(lastMessageContent)
  }
}

// appsData.takeLiveImage()