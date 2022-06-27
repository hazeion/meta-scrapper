// Creates jpeg image from ArrayBuffer data - found this
function bufferToImageUrl (buffer) {
  const arrayBufferView = new Uint8Array(buffer)
  const blob = new Blob([arrayBufferView], { type: 'image/jpeg' })
  const urlCreator = window.URL || window.webkitURL
  const imageURL = urlCreator.createObjectURL(blob)

  return imageURL
}

// Takes value in form and assigns it to pageToScreenshot for the fetch POST
async function clickPost () {
  try {
    const pageToScreenshot = document.getElementById('page').value

    if (!pageToScreenshot.includes('https://') && !pageToScreenshot.includes('http://')) {
      document.getElementById('result').textContent =
        'Not valid website.. did you include http(s):// ?'
    } else {
      const titleDiv = document.getElementById('title')
      const descripDiv = document.getElementById('description')

      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ pageToScreenshot })
      }

      document.getElementById('result').textContent = 'Please Wait...'

      // fetch meta information in the form of json
      const response = await fetch('.netlify/functions/take-screenshot', options)
      const data = await response.json()

      // assigns the data from the json to title and page description
      const titleName = await data.page.title
      const urlName = await data.page.url
      const pageDescription = await data.page.description

      // creates image element and convert / injects buffer to image src & assigns the link to the .
      const a = document.createElement('a')
      const img = document.createElement('img')
      a.href = await urlName
      img.src = bufferToImageUrl(data.buffer.data)
      a.appendChild(img)

      // assigns title, image, and description information

      titleDiv.innerHTML = titleName
      document.getElementById('result').innerHTML = a.outerHTML
      descripDiv.innerHTML = pageDescription
    }
  } catch (error) {
    console.log(error)
    document.getElementById('result').textContent = `Error: ${error.toString()}`
  }
}

document.getElementById('submit').addEventListener('click', (event) => {
  event.preventDefault()
  document.getElementById('title').innerHTML = ''
  document.getElementById('description').innerHTML = ''
  clickPost()
})
