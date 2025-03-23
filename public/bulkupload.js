var amount = prompt('How many files do you want to upload?')
amount = !isNaN(amount) ? parseInt(amount) : 0

var iframe = document.querySelector('.iframe-area iframe')
var i = 0
var names = []


function queNextFileActs(fName) {
  names.push(fName)
  i++
  if (i < amount) {
    iframe.src = '/upload?isBulk=true'
  }
  else {
    names = names.join(',')
    location.href = `/chat?filelocation=temp-storage&name=${names}`
  }
}

