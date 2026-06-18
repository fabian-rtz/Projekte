function getNews(){
    showLoader();
    fetch(`${MMA_API}?action=news`)
        .then(res => res.json())
        .then(data => {setNews(data)});
}

function setNews(data){
    let newsOuterContainer = document.getElementById('news-outer-container');
    let HTML = "";

    newsOuterContainer.innerHTML = "";
    data.forEach(element => {
       HTML += `
        <div class="news-container">
            <div class="date-header">
                <p class="pLastModified">${new Date(element.lastModified).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                })}</p>
                <hr>
            </div>
            <div class="news">
                <p class="icon">●</p>
                <div class="info-container">
                    <p class="pNewsHeadline">${element.headline}</p>
                    <p class="pNewsDescription">${element.description}</p>
                </div>
            </div>
        </div>`;
    });
    hideLoader();
    newsOuterContainer.innerHTML = HTML;
}
function showLoader() {
    document.querySelector('.lds-ring').style.display = 'inline-block';
}

function hideLoader() {
    document.querySelector('.lds-ring').style.display = 'none';
}

getNews();

