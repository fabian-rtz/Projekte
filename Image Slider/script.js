let ImageIndex = 1, IntervalID;



const autoSlide = () => {
intervalID = setInterval(() =>slideImage(++ImageIndex),2000)
}

const slideImage = () => {
    console.log(ImageIndex);  
    if((ImageIndex < 5)){
        document.querySelectorAll(".img-slider img").forEach((img) => {
            img.style.transform = `translateX(-${100*ImageIndex}%)`;
        });
    } 
    else{
        ImageIndex = 0;
        document.querySelectorAll(".img-slider img").forEach((img, index) => {
            img.style.transform = `translateX(0%)`;
        });
    }
}
autoSlide();

