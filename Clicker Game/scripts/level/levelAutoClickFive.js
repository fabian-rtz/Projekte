import {getPointsRaw,getPointsVisible,setPoints,addPoints,Points,canAfford,updateCPSFive} from "../state.js";

import{setLevelAutoClickFive,checkSkullGrinder} from "../stateArchievement.js";

import { updateColorOne } from "./levelAutoClickOne.js";
import { updateColorTen } from "./levelAutoClickTen.js";
import { updateColorFifty } from "./levelAutoClickFifty.js";
import { updateColorOneHundred } from "./levelAutoClickOneHundred.js";

const levelAutoClickerNumberFive = document.getElementById("levelAutoClickerNumberFive");
const levelAutoClickerSkullPointsFive = document.getElementById("levelAutoClickerSkullPointsFive");
const levelAutoClickFive = document.getElementById("levelAutoClickFive");

let autoInterval = null;

levelAutoClickFive.addEventListener("click", () => {

    const cost = Math.floor(75 * Math.pow(1.17, Number(levelAutoClickerNumberFive.innerHTML)));

    if (!canAfford(cost)) return;

    updateCPSFive((Number(levelAutoClickerNumberFive.innerHTML)+1)*5);

    setPoints(getPointsRaw() - cost);

    Points.innerHTML = `${getPointsVisible()}`;
    checkSkullGrinder(getPointsVisible());

    levelAutoClickerNumberFive.innerHTML = Number(levelAutoClickerNumberFive.innerHTML) + 1;

    const nextCost = Math.floor(75 * Math.pow(1.17, Number(levelAutoClickerNumberFive.innerHTML)));
    levelAutoClickerSkullPointsFive.innerHTML = `Skull-Points: ${nextCost}`;

    setLevelAutoClickFive(Number(levelAutoClickerNumberFive.innerHTML));



    startAutoClicker();
});

function startAutoClicker() {

    if (autoInterval !== null) return;

    autoInterval = setInterval(() => {

        addPoints((Number(levelAutoClickerNumberFive.innerHTML)* 5 ) / 20);

        Points.innerHTML = `${getPointsVisible()}`;
        checkSkullGrinder(getPointsVisible());

        updateColorOneHundred();
        updateColorFifty();
        updateColorTen();
        updateColorFive()
        updateColorOne();

    }, 50);
}
export function updateColorFive() {
    const nextCost = Math.floor(75 * Math.pow(1.17, Number(levelAutoClickerNumberFive.innerHTML)));
    const newColor = getPointsRaw() >= nextCost ? "white" : "red";

    levelAutoClickerSkullPointsFive.style.color = newColor;

}
