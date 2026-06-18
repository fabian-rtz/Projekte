import { addPoints, getPointsVisible, Points } from "./state.js";

import { tooglePopUp,toogleArchievement,checkSkullGrinder } from "./stateArchievement.js";

import { updateColorOne } from "./level/levelAutoClickOne.js";
import { updateColorFive } from "./level/levelAutoClickFive.js";
import { updateColorTen } from "./level/levelAutoClickTen.js";
import { updateColorFifty } from "./level/levelAutoClickFifty.js";
import { updateColorOneHundred } from "./level/levelAutoClickOneHundred.js";

let btnClick = document.getElementById("btnClick");

let picturePoints = 0;

const imgClick = document.getElementById("imgClick");

const imgPaths = [
    "img/Cat/Cat_1.png",
    "img/Dragon/Dragon_1.png",
    "img/Lizard/Lizard_1.png",
    "img/Octopus/Octopus_1.png",
    "img/Owl/Owl_1.png",
    "img/Pig/Pig_1.png",
    "img/Rabbit/Rabbit_1.png",
    "img/Rainbow/Rainbow_1.png",
    "img/Sheep/Sheep_1.png",
    "img/Unicorn/Unicorn_1.png"
];

btnClick.addEventListener("click", () => {

    picturePoints++;

    if(picturePoints === 1){
        toogleArchievement("FirstBlood");
        tooglePopUp();
    }
    if(picturePoints === 100){
        toogleArchievement("Collector");
        tooglePopUp();  

        toogleArchievement("NoviceClicker");
        tooglePopUp();         
    }
    if(picturePoints === 1000){
        toogleArchievement("ImageAddict");
        tooglePopUp();        
    }

    const path = imgClick.src.substring(imgClick.src.indexOf("img/"));
    const base = path.substring(0, path.indexOf("_"));

    imgClick.src = path.endsWith("_1.png") 
        ? `${base}_2.png`
        : `${base}_1.png`;

    addPoints(1);

    Points.innerHTML = `${getPointsVisible()}`;
    checkSkullGrinder(getPointsVisible());

    updateColorOne();
    updateColorFive();
    updateColorTen();
    updateColorFifty();
    updateColorOneHundred();
    

    if (picturePoints % 10 === 0) {
        imgClick.src = imgPaths[Math.floor(Math.random() * imgPaths.length)];
    }
});

