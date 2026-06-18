import {checkDoubleTrouble} from "./stateArchievement.js";

export let iRaw = 0;
export let iVisible = 0;

export let lastColorOne = null;
export let lastColorFive = null;
export let lastColorTen = null;
export let lastColorFifty = null;
export let lastColorOneHundred = null;

let CPSOne = 0;
let CPSFive = 0;
let CPSTen = 0;
let CPSFifty = 0;
let CPSOneHundred = 0;

export const Points = document.getElementById("Points");
const ClicksPerSecond = document.getElementById("ClicksPerSecond");

export function updateCPSOne(value){
    CPSOne = value;
    updateCPS();
}
export function updateCPSFive(value){
    CPSFive = value;
    updateCPS();
}
export function updateCPSTen(value){
    CPSTen = value;
    updateCPS();
}
export function updateCPSFifty(value){
    CPSFifty = value;
    updateCPS();
}
export function updateCPSOneHundred(value){
    CPSOneHundred = value;
    updateCPS();
}

function updateCPS(){
    ClicksPerSecond.innerHTML = `CPS : ${CPSOne + CPSFive + CPSTen + CPSFifty + CPSOneHundred}`;
    checkDoubleTrouble(CPSOne + CPSFive + CPSTen + CPSFifty + CPSOneHundred);
}

export function addPoints(amount) {
    iRaw += amount;
    iVisible = Math.floor(iRaw);
}

export function setPoints(newValue) {
    iRaw = newValue;
    iVisible = Math.floor(iRaw);
}

export function getPointsVisible() {
    return iVisible;
}

export function getPointsRaw() {
    return iRaw;
}

export function canAfford(cost) {
    return getPointsRaw() >= cost;  
}
