function showToast(msg, imgsrc) {
    let toastBox = document.getElementById('toastbox');

    let toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerHTML = msg;

    let toastimg = document.createElement('img');
    toastimg.src = `./img/${imgsrc}`;
    toastimg.id = 'toastboximg';
    toast.appendChild(toastimg);

    toastBox.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000); 
}