let LevelAutoClickOne = 0;
let LevelAutoClickFive = 0;
let LevelAutoClickTen = 0;
let LevelAutoClickFifty = 0;
let LevelAutoClickOneHundred = 0;

let DoubleTroubleUnlocked = false;
let GettingStartedUnlocked = false;
let FirstUpgradeUnlocked = false;
let AutoArmyUnlocked = false;
let UpgradeSpecialistUnlocked = false;
let SkullGrinderUnlocked = false;

export function tooglePopUp() {
    const container = document.getElementById("PopUpContainer");

    container.innerHTML += `
        <div class="PopUp show">
            <img src="/img/erfolg.png" alt="">
            <p>Du hast eine Errungenschaft freigeschaltet!</p>
        </div>
    `;
    
    setTimeout(() => {
        const popup = container.querySelector(".PopUp");
        if (popup) popup.remove();
    }, 2000);
}

export function toogleArchievement(archievement){
    document.getElementById(`${archievement}`).classList.add("archieved");
}





export function setLevelAutoClickOne(value){
    LevelAutoClickOne = value;
    checkGettingStarted();
    checkFirstUpgrade();
    checkAutoArmy();
    checkUpgradeSpecialist();
}

export function setLevelAutoClickFive(value){
    LevelAutoClickFive = value;
    checkGettingStarted();
    checkFirstUpgrade();
    checkAutoArmy();
    checkUpgradeSpecialist();
}

export function setLevelAutoClickTen(value){
    LevelAutoClickTen = value;
    checkGettingStarted();
    checkFirstUpgrade();
    checkAutoArmy();
    checkUpgradeSpecialist();
}

export function setLevelAutoClickFifty(value){
    LevelAutoClickFifty = value;
    checkGettingStarted();
    checkFirstUpgrade();
    checkAutoArmy();
    checkUpgradeSpecialist();
}

export function setLevelAutoClickOneHundred(value){
    LevelAutoClickOneHundred = value;
    checkGettingStarted();
    checkFirstUpgrade();
    checkAutoArmy();
    checkUpgradeSpecialist();
}





function checkGettingStarted() {

    if(GettingStartedUnlocked) return;

    if (LevelAutoClickOne == 1 || LevelAutoClickFive == 1 || LevelAutoClickTen == 1 || LevelAutoClickFifty == 1 || LevelAutoClickOneHundred == 1){
        tooglePopUp();
        toogleArchievement("GettingStarted");
        GettingStartedUnlocked = true;
    }
}

function checkFirstUpgrade() {

    if(FirstUpgradeUnlocked) return;

    if (LevelAutoClickOne == 5 || LevelAutoClickFive == 5 || LevelAutoClickTen == 5 || LevelAutoClickFifty == 5 || LevelAutoClickOneHundred == 5){
        tooglePopUp();
        toogleArchievement("FirstUpgrade");
        FirstUpgradeUnlocked = true;
    }
}

function checkUpgradeSpecialist() {

    if(UpgradeSpecialistUnlocked) return;

    if (LevelAutoClickOne == 25 || LevelAutoClickFive == 25 || LevelAutoClickTen == 25 || LevelAutoClickFifty == 25 || LevelAutoClickOneHundred == 25){
        tooglePopUp();
        toogleArchievement("UpgradeSpecialist");
        UpgradeSpecialistUnlocked = true;
    }
}

function checkAutoArmy(){

    if(AutoArmyUnlocked) return;

    let sum = LevelAutoClickOne + LevelAutoClickFive + LevelAutoClickTen + LevelAutoClickFifty + LevelAutoClickOneHundred;
    if (sum == 10){
        tooglePopUp();
        toogleArchievement("AutoArmy");  
        AutoArmyUnlocked = true;
    }
}
export function checkDoubleTrouble(cps){

    if(DoubleTroubleUnlocked) return;

    if(cps >= 2 ) {
        tooglePopUp();
        toogleArchievement("DoubleTrouble");
        DoubleTroubleUnlocked = true;
    }
}
export function checkSkullGrinder(points){
    if(SkullGrinderUnlocked) return;

    if(points >= 1000) {
        tooglePopUp();
        toogleArchievement("SkullGrinder");
        SkullGrinderUnlocked = true;  
    }
}