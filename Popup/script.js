
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#Submit').addEventListener('click', function() {
        document.querySelector('.Popup').style.transform = 'scale(1)';
    });
    
    document.querySelector('#btnOK').addEventListener('click', function() {
        document.querySelector('.Popup').style.transform = 'scale(0)';
    });
});