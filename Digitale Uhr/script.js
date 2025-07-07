document.addEventListener('DOMContentLoaded', function() {
    setInterval(() => {
        let currentTimeDate = new Date();
        let hrs = currentTimeDate.getHours() < 10 ? "0" + currentTimeDate.getHours() : currentTimeDate.getHours();
        let min = currentTimeDate.getMinutes() < 10 ? "0" + currentTimeDate.getMinutes() : currentTimeDate.getMinutes();
        let sec = currentTimeDate.getSeconds() < 10 ? "0" + currentTimeDate.getSeconds() : currentTimeDate.getSeconds();

        document.getElementById("time").innerHTML = hrs + ":" + min + ":" + sec;
    }, 1000);
});
