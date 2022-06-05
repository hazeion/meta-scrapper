
// Creates jpeg image from ArrayBuffer data - found this 
function bufferToImageUrl(buffer) {

    const arrayBufferView = new Uint8Array(buffer);
    const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
    const urlCreator = window.URL || window.webkitURL;
    const imageURL = urlCreator.createObjectURL(blob);

    return imageURL;
}

// Takes value in form and assigns it to pageToScreenshot for the fetch POST
async function clickPost(e) {

    document.getElementById('title').innerHTML = "";
    document.getElementById('description').innerHTML = "";

    e.preventDefault();

    const pageToScreenshot = document.getElementById('page').value;


    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ pageToScreenshot: pageToScreenshot })

    }
    document.getElementById('result').textContent = "Please Wait...";

    const response = await fetch('.netlify/functions/take-screenshot', options);
    const data = await response.json();
    console.log("this is the buffer " + data)
    
        // assigns the data from the json to title and page description
        const titleName = await `<h2>${data.page.title}</h2>`;
        const pageDescription = await data.page.description;

        // creates image element and convert / injects buffer to image src.
        const img = document.createElement('img');
        img.src = bufferToImageUrl(data.buffer.data);

        //sets the div for the title and the description
        const titleDiv = document.getElementById('title');
        const descripDiv = await document.getElementById('description');

        // assigns title, image, and description information

        titleDiv.innerHTML = titleName;
        document.getElementById('result').innerHTML = img.outerHTML;

        descripDiv.innerHTML = pageDescription;

}

/* */

document.getElementById('submit').addEventListener("click", clickPost);
