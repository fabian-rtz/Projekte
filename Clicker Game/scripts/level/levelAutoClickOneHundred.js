import {getPointsRaw,getPointsVisible,setPoints,addPoints,Points,canAfford,updateCPSOneHundred} from "../state.js";

import{setLevelAutoClickOneHundred,checkSkullGrinder} from "../stateArchievement.js";

import { updateColorOne } from "./levelAutoClickOne.js";
import { updateColorFive } from "./levelAutoClickFive.js";
import { updateColorTen } from "./levelAutoClickTen.js";
import { updateColorFifty } from "./levelAutoClickFifty.js";

const levelAutoClickerNumberOneHundred = document.getElementById("levelAutoClickerNumberOneHundred");
const levelAutoClickerSkullPointsOneHundred = document.getElementById("levelAutoClickerSkullPointsOneHundred");
const levelAutoClickOneHundred = document.getElementById("levelAutoClickOneHundred");

let autoInterval = null;

levelAutoClickOneHundred.addEventListener("click", () => {

    const cost = Math.floor(2500 * Math.pow(1.28, Number(levelAutoClickerNumberOneHundred.innerHTML)));

    if (!canAfford(cost)) return;

    updateCPSOneHundred((Number(levelAutoClickerNumberOneHundred.innerHTML)+1)* 100);

    setPoints(getPointsRaw() - cost);

    Points.innerHTML = `${getPointsVisible()}`;
    checkSkullGrinder(getPointsVisible());

    levelAutoClickerNumberOneHundred.innerHTML = Number(levelAutoClickerNumberOneHundred.innerHTML) + 1;

    const nextCost = Math.floor(2500 * Math.pow(1.28, Number(levelAutoClickerNumberOneHundred.innerHTML)));
    levelAutoClickerSkullPointsOneHundred.innerHTML = `Skull-Points: ${nextCost}`;

    setLevelAutoClickOneHundred(Number(levelAutoClickerNumberOneHundred.innerHTML));

    startAutoClicker();
});

function startAutoClicker() {

    
    if (autoInterval !== null) return;

    autoInterval = setInterval(() => {

        addPoints((Number(levelAutoClickerNumberOneHundred.innerHTML)* 100 ) / 20);

        Points.innerHTML = `${getPointsVisible()}`;

        updateColorOneHundred();
        updateColorFifty();
        updateColorTen();
        updateColorFive()
        updateColorOne();

    }, 50);
}
export function updateColorOneHundred() {
    const nextCost = Math.floor(2500 * Math.pow(1.28, Number(levelAutoClickerNumberOneHundred.innerHTML)));
    const newColor = getPointsRaw() >= nextCost ? "white" : "red";

    levelAutoClickerSkullPointsOneHundred.style.color = newColor;
}
