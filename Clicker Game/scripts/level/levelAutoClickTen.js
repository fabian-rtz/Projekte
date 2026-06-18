import {getPointsRaw,getPointsVisible,setPoints,addPoints,Points,canAfford,updateCPSTen} from "../state.js";

import{setLevelAutoClickTen,checkSkullGrinder} from "../stateArchievement.js";

import { updateColorOne } from "./levelAutoClickOne.js";
import { updateColorFive } from "./levelAutoClickFive.js";
import { updateColorFifty } from "./levelAutoClickFifty.js";
import { updateColorOneHundred } from "./levelAutoClickOneHundred.js";

const levelAutoClickerNumberTen = document.getElementById("levelAutoClickerNumberTen");
const levelAutoClickerSkullPointsTen = document.getElementById("levelAutoClickerSkullPointsTen");
const levelAutoClickTen = document.getElementById("levelAutoClickTen");

let autoInterval = null;

levelAutoClickTen.addEventListener("click", () => {

    const cost = Math.floor(180 * Math.pow(1.20, Number(levelAutoClickerNumberTen.innerHTML)));

    if (!canAfford(cost)) return;

    updateCPSTen((Number(levelAutoClickerNumberTen.innerHTML)+1)* 10);

    setPoints(getPointsRaw() - cost);

    Points.innerHTML = `${getPointsVisible()}`;
    checkSkullGrinder(getPointsVisible());

    levelAutoClickerNumberTen.innerHTML = Number(levelAutoClickerNumberTen.innerHTML) + 1;

    const nextCost = Math.floor(180 * Math.pow(1.20, Number(levelAutoClickerNumberTen.innerHTML)));
    levelAutoClickerSkullPointsTen.innerHTML = `Skull-Points: ${nextCost}`;

    setLevelAutoClickTen(Number(levelAutoClickerNumberTen.innerHTML));

    startAutoClicker();
});

function startAutoClicker() {

    
    if (autoInterval !== null) return;

    autoInterval = setInterval(() => {

        addPoints((Number(levelAutoClickerNumberTen.innerHTML)* 10 ) / 20);

        Points.innerHTML = `${getPointsVisible()}`;
        checkSkullGrinder(getPointsVisible());

        updateColorOneHundred();
        updateColorFifty();
        updateColorTen();
        updateColorFive()
        updateColorOne();

    }, 50);
}

export function updateColorTen() {
    const nextCost = Math.floor(180 * Math.pow(1.20, Number(levelAutoClickerNumberTen.innerHTML)));
    const newColor = getPointsRaw() >= nextCost ? "white" : "red";

    levelAutoClickerSkullPointsTen.style.color = newColor;
}
