let inputPortion = document.getElementById("inputPortion");
let mengenZelle = document.querySelectorAll("table tr td:last-child");

let infoButton = document.getElementById("infobutton");
let exit = document.getElementById("exit");
let overlay = document.getElementById("overlay");
let infoDescription = document.getElementById("infoDescription");

const Ingredients = [
    {
        "Zutatenname": "Huhn",
        "Menge": 1,
        "Einheit": "Stk."
    },
    {
        "Zutatenname": "Currypulver",
        "Menge": 10,
        "Einheit": "g"
    },
    {
        "Zutatenname": "Kokosmilch",
        "Menge": 250,
        "Einheit": "ml"
    },
    {
        "Zutatenname": "Ingwer",
        "Menge": 2,
        "Einheit": "ml"
    },
    {
        "Zutatenname": "Zwiebel",
        "Menge": 1,
        "Einheit": "Stk."
    },
    {
        "Zutatenname": "Reis",
        "Menge": 200,
        "Einheit": "g"
    },
    {
        "Zutatenname": "Zitronensaft",
        "Menge": 20,
        "Einheit": "ml"
    },
    {
        "Zutatenname": "Chili",
        "Menge": 0.5,
        "Einheit": "g"
    }
];

inputPortion.addEventListener("keydown", (event) => {
    let portionsMenge = inputPortion.value;
    
    if (event.key === "Enter") {
        if(portionsMenge <= 0){
            alert("Die angegebene Portionsmenge ist ungültig!");
        }
        else{
            mengenZelle.forEach((zelle, i) => {
                zelle.innerHTML = Ingredients[i].Menge * portionsMenge + " "+Ingredients[i].Einheit;   
            });
        }
    }
});

infoButton.addEventListener("click", () => {
    overlay.classList.toggle("active");
    infoDescription.classList.toggle("active");
});

exit.addEventListener("click", () => {
    overlay.classList.remove("active");
    infoDescription.classList.remove("active");
});

