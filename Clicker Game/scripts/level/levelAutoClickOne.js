import {getPointsRaw,getPointsVisible,setPoints,addPoints,Points,canAfford,updateCPSOne} from "../state.js";

import{setLevelAutoClickOne,checkSkullGrinder} from "../stateArchievement.js";

import { updateColorFive } from "./levelAutoClickFive.js";
import { updateColorTen } from "./levelAutoClickTen.js";
import { updateColorFifty } from "./levelAutoClickFifty.js";
import { updateColorOneHundred } from "./levelAutoClickOneHundred.js";

const levelAutoClickerNumberOne = document.getElementById("levelAutoClickerNumberOne");
const levelAutoClickerSkullPointsOne = document.getElementById("levelAutoClickerSkullPointsOne");
const levelAutoClickOne = document.getElementById("levelAutoClickOne");

let autoInterval = null;

levelAutoClickOne.addEventListener("click", () => {

    const cost = Math.floor(15 * Math.pow(1.15, Number(levelAutoClickerNumberOne.innerHTML)));

    if (!canAfford(cost)) return;

    updateCPSOne(Number(levelAutoClickerNumberOne.innerHTML)+1);

    setPoints(getPointsRaw() - cost);

    Points.innerHTML = `${getPointsVisible()}`;
    checkSkullGrinder(getPointsVisible());

    levelAutoClickerNumberOne.innerHTML = Number(levelAutoClickerNumberOne.innerHTML) + 1;

    const nextCost = Math.floor(15 * Math.pow(1.15, Number(levelAutoClickerNumberOne.innerHTML)));

    levelAutoClickerSkullPointsOne.innerHTML = `Skull-Points: ${nextCost}`;

    setLevelAutoClickOne(Number(levelAutoClickerNumberOne.innerHTML));

    startAutoClicker();
});

function startAutoClicker() {
    
    if (autoInterval !== null) return;

    autoInterval = setInterval(() => {

        addPoints(Number(levelAutoClickerNumberOne.innerHTML) / 20);

        Points.innerHTML = `${getPointsVisible()}`;
        checkSkullGrinder(getPointsVisible());
        
        updateColorOneHundred();
        updateColorFifty();
        updateColorTen();
        updateColorFive()
        updateColorOne();

    }, 50);
}

export function updateColorOne() {
    const nextCost = Math.floor(15 * Math.pow(1.15, Number(levelAutoClickerNumberOne.innerHTML)));
    const newColor = getPointsRaw() >= nextCost ? "white" : "red";

    levelAutoClickerSkullPointsOne.style.color = newColor;
}
