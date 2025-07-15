document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("search-input");
    const searchResult = document.getElementById("search-result");
    const searchButton = document.getElementById("search-button");

    let keyword = "";
    let page = 1;

    async function searchImages(event) {
        if (event) {
            event.preventDefault(); // Prevent default form submission behavior
        }
        keyword = searchInput.value;
        const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=VPyXg79PqAh44fJQrrwRdbP833GOkherjs8OluboNbc`;
    
        const response = await fetch(url);
        const data = await response.json();
    
        const results = data.results;

        searchResult.innerHTML = '';
   // Begrenze die Anzahl der anzuzeigenden Bilder auf 9
    for (let i = 0; i < Math.min(results.length, 9); i++) {
        const result = results[i];
        const image = document.createElement("img");
        image.src = result.urls.small;
        const imageLink = document.createElement("a");
        imageLink.href = result.links.html;
        imageLink.target = "_blank";

        imageLink.appendChild(image);
        searchResult.appendChild(imageLink);
    }

    // Ändere die Höhe des Containers basierend auf dem Inhalt
    
}

    searchButton.addEventListener("click", (e) =>{
        e.preventDefault();
        page =1;
        searchImages(e); 
    });
});