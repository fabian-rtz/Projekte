import {getPointsRaw,getPointsVisible,setPoints,addPoints,Points,canAfford,updateCPSFifty} from "../state.js";

import{setLevelAutoClickFifty,checkSkullGrinder} from "../stateArchievement.js";

import { updateColorOne } from "./levelAutoClickOne.js";
import { updateColorFive } from "./levelAutoClickFive.js";
import { updateColorTen } from "./levelAutoClickTen.js";
import { updateColorOneHundred } from "./levelAutoClickOneHundred.js";

const levelAutoClickerNumberFifty = document.getElementById("levelAutoClickerNumberFifty");
const levelAutoClickerSkullPointsFifty = document.getElementById("levelAutoClickerSkullPointsFifty");
const levelAutoClickFifty = document.getElementById("levelAutoClickFifty");

let autoInterval = null;

levelAutoClickFifty.addEventListener("click", () => {

    const cost = Math.floor(1000 * Math.pow(1.25, Number(levelAutoClickerNumberFifty.innerHTML)));

    if (!canAfford(cost)) return;

    updateCPSFifty((Number(levelAutoClickerNumberFifty.innerHTML)+1)* 50);

    setPoints(getPointsRaw() - cost);

    Points.innerHTML = `${getPointsVisible()}`;
    checkSkullGrinder(getPointsVisible());

    levelAutoClickerNumberFifty.innerHTML = Number(levelAutoClickerNumberFifty.innerHTML) + 1;

    const nextCost = Math.floor(1000 * Math.pow(1.25, Number(levelAutoClickerNumberFifty.innerHTML)));
    levelAutoClickerSkullPointsFifty.innerHTML = `Skull-Points: ${nextCost}`;

    setLevelAutoClickFifty(Number(levelAutoClickerNumberFifty.innerHTML));

    startAutoClicker();
});

function startAutoClicker() {

    
    if (autoInterval !== null) return;

    autoInterval = setInterval(() => {

        addPoints((Number(levelAutoClickerNumberFifty.innerHTML)* 50 ) / 20);

        Points.innerHTML = `${getPointsVisible()}`;

        updateColorOneHundred();
        updateColorFifty();
        updateColorTen();
        updateColorFive()
        updateColorOne();

    }, 50);
}
export function updateColorFifty() {
    const nextCost = Math.floor(1000 * Math.pow(1.25, Number(levelAutoClickerNumberFifty.innerHTML)));
    const newColor = getPointsRaw() >= nextCost ? "white" : "red";

    levelAutoClickerSkullPointsFifty.style.color = newColor;
}
