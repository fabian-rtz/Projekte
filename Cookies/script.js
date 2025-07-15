document.addEventListener("DOMContentLoaded", () => {
  const cookieBox = document.querySelector(".wrapper");
  const acceptBtn = cookieBox.querySelector(".btnWrapper button");

  acceptBtn.onclick = () => {
    document.cookie = "CookieBy=Fabian; max-age=" + 60 * 60 * 24 * 30;
    if (document.cookie) {
      cookieBox.classList.add("hide");
    } else {
      alert("Cookie kann nicht gesetzt werden!");
    }
  };
  let checkCookie = document.cookie.indexOf("CookieBy=Fabian");
  checkCookie != -1 ? cookieBox.classList.add("hide"): cookieBox.classList.remove("hide");
});
