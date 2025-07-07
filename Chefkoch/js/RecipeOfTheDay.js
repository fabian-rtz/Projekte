function loadRecipeFromUrlParams() { 
    const urlParams = new URLSearchParams(window.location.search);
    const recipe = urlParams.get('recipe');

    switch (recipe) {
        case 'pancake':              
            setObjectForRecipePancake();    
            setTableDataForRecipePancake();
            setImgForRecipe('../img/Pfannkuchen.png');
            break;
        case 'RedLenses':              
            setObjectForRecipeRedLenses();  
            setTableDataForRecipeRedLenses();
            setImgForRecipe('../img/RedLenses.png');
            break;
        case 'CheeseS':         
            setObjectForRecipeCheeseS();
            setTableDataForRecipeCheeseS();      
            setImgForRecipe('../img/CheeseS.png');   
            break;
        case 'Hamburger':       
            setObjectForRecipeHamburger();
            setTableDataForRecipeHamburger();    
            setImgForRecipe('../img/Hamburger.png');             
            break;
        case 'salat':
            setTableDataForRecipeSalat();     
            setImgForRecipe('../img/RecipeOfTheDay.png');                      
            break;  
    }
    createTableElement(tableData);
}

function setObjectForRecipePancake() {
    let test = {
        recipe: 'Pfannkuchen',
        minutes: '20min',
        difficulty: 'simpel',
        minutesapprox: 'ca 20 Min',
        overalltime: 'Gesamtzeit ca. 20 Minuten',        
        preparation: `
        Vermische das Mehl in einer Schüssel mit Eiern und Milch, bis ein geschmeidiger Teig entsteht. 
        Lasse diesen Teig für etwa 10 Minuten ruhen, damit sich die Aromen gut verbinden können. 
        Erhitze dann eine Pfanne bei mittlerer Hitze und gib etwas Butter oder Öl hinzu, um ein Ankleben zu verhindern. 
        Gieße eine kleine Menge Teig in die Pfanne und verteile ihn gleichmäßig. Brate die Pfannkuchen 
        auf beiden Seiten goldbraun, bis sie eine perfekte Textur und Farbe haben. Staple sie auf einem Teller, 
        garniere nach Belieben und serviere sie warm. So kannst du deine selbstgemachten Pfannkuchen mit Ahornsirup,
        frischen Früchten oder anderen Lieblingstoppings genießen!`
    }
    parseInformationforRecipe(test);
}

function setTableDataForRecipePancake() {
    tableData = [
        { quantity: 200, einheit: "g", description: "Mehl" },
        { quantity: 2, einheit: null, description: "Eier" },
        { quantity: 250, einheit: "ml", description: "Milch" },
        { quantity: 1, einheit: "Prise", description: "Salz" },
        { quantity: 1, einheit: "TL", description: "Zucker" },
        { quantity: '', einheit: '', description: "Butter zum Braten" }
    ];
}

function setObjectForRecipeRedLenses() {
    let test = {
        recipe: 'Rote Linsen Kokos Suppe',
        minutes: '30 Min',
        difficulty: 'simpel',
        minutesapprox: 'ca 30 Min',
        overalltime: 'Gesamtzeit ca. 40 Minuten',        
        preparation: `
        Um Rote Linsen Kokos Suppe zuzubereiten, Zwiebel und Knoblauch anbraten, 
        Karotten, Süßkartoffeln, Linsen, Kokosmilch, Gemüsebrühe und Gewürze hinzufügen, 
        köcheln lassen. Pürieren, abschmecken, mit frischem Koriander garnieren. 
        Perfekt für kalte Tage, mit Brot oder Reis servieren. Guten Appetit!`
    }
    parseInformationforRecipe(test);
}

function setTableDataForRecipeRedLenses() {
    tableData = [
        { quantity: 1, einheit: "Tasse(n)", description: "rote Linsen" },
        { quantity: 1, einheit: '', description: "Zwiebel(n), gehackt" },
        { quantity: 2, einheit: "Knoblauchzeh(en)", description: "gehackt" },
        { quantity: 1, einheit: '', description: "Karotte(n), gewürfelt" },
        { quantity: 1, einheit: '', description: "Süßkartoffel(n), gewürfelt" },
        { quantity: 1, einheit: "Dose(n)", description: "Kokosmilch" },
        { quantity: 4, einheit: "Tasse(n)", description: "Gemüsebrühe" },
        { quantity: 1, einheit: "EL", description: "Currypulver" },
        { quantity: 1, einheit: "TL", description: "Kreuzkümmel" },
        { quantity: '', einheit: '', description: "Salz und Pfeffer" },
        { quantity: '', einheit: '', description: "Frischer Koriander oder Petersilie zum Garnieren" }
    ];
}

function setObjectForRecipeCheeseS() {
    let test = {
        recipe: 'Käsespätzle',
        minutes: '30 Min',
        difficulty: 'simple',
        minutesapprox: 'ca 30 Min',
        overalltime: 'Gesamtzeit ca. 40 Minuten',        
        preparation: `
        Um Käsespätzle zuzubereiten, zunächst Spätzle kochen. 
        In einer Pfanne Zwiebeln anbraten. Spätzle mit Zwiebeln und geriebenem Käse schichten, 
        bis alle Zutaten aufgebraucht sind. Mit gerösteten Zwiebeln garnieren und servieren. 
        Ein köstliches und herzhaftes Gericht für alle Käseliebhaber!`
    }
    parseInformationforRecipe(test);
}

function setTableDataForRecipeCheeseS() {
    tableData = [
        { quantity: 500, einheit: "g", description: "Spätzle" },
        { quantity: 200, einheit: "g", description: "Emmentaler Käse, gerieben" },
        { quantity: 2, einheit: '', description: "Zwiebel(n), in Ringe geschnitten" },
        { quantity: 1, einheit: '', description: "Karotte(n), gewürfelt" },
        { quantity: 2, einheit: "EL", description: "Butter" },
        { quantity: '', einheit: '', description: "Salz und Pfeffer" },
        { quantity: 100, einheit: "g", description: "Bergkäse, gerieben für zusätzlichen Geschmack" }
    ];
}

function setObjectForRecipeHamburger() {
    let test = {
        recipe: 'Hamburger',
        minutes: '20 min',
        difficulty: 'medium',
        minutesapprox: 'ca 20 Min',
        overalltime: 'Gesamtzeit ca. 30 Minuten',        
        preparation: `
        Um Hamburger zuzubereiten, würzen Sie 500g Rinderhackfleisch 
        mit Salz und Pfeffer, formen Patties und braten sie auf mittlerer Hitze. 
        Toasten Sie die Burgerbrötchen, belegen Sie sie mit Belägen und servieren 
        Sie sie heiß. Mit Ketchup, Senf oder Mayonnaise nach Geschmack verfeinern. 
        Schnell, einfach und köstlich!`
    }
    parseInformationforRecipe(test);
}

function setTableDataForRecipeHamburger() { 
    tableData = [
        { quantity: 500, einheit: "g", description: "Rinderhackfleisch" },
        { quantity: 4, einheit: '', description: "Burger-Brötchen" },
        { quantity: 4, einheit: "Blatt/Blätter", description: "Salat" },
        { quantity: 1, einheit: '', description: "Tomate(n)" },
        { quantity: 1, einheit: '', description: "Zwiebel(n)" },
        { quantity: 4, einheit: "Scheiben", description: "Käse" },
        { quantity: 4, einheit: "Esslöffel", description: "Mayonnaise oder Burger-Sauce" },
        { quantity: 2, einheit: "Esslöffel", description: "Ketchup" },
        { quantity: 2, einheit: "Esslöffel", description: "Senf" },
        { quantity: '', einheit: '', description: "Salz und Pfeffer" },
        { quantity: 2, einheit: "Esslöffel", description: "Öl zum Braten" }
    ];
}

function setTableDataForRecipeSalat() {
    tableData = [
        { quantity: 1, einheit: '', description: "Salzgurke(n)" },
        { quantity: 2, einheit: '', description: "Paprikaschote(n), rot und grün" },
        { quantity: 500, einheit: "g", description: "Tomate(n)" },
        { quantity: 2, einheit: '', description: "Zwiebel(n)" },
        { quantity: 200, einheit: "g", description: "Schafskäse(n)" },
        { quantity: 1, einheit: "Glas/Gläser", description: "Oliven" },
        { quantity: '', einheit: '', description: "Salz und Pfeffer" },
        { quantity: 1, einheit: '', description: "Zitrone(n)" },
        { quantity: 125, einheit: "ml", description: "Olivenöl" },
        { quantity: '', einheit: '', description: "Oregano" }
    ];
}

function setImgForRecipe(imgSrc) {
    let img = document.createElement('img');
    img.src = imgSrc; 
    img.classList.add('RecipePic'); 
    let imageContainer = document.getElementById('imageContainer'); 
    imageContainer.appendChild(img);
}

function checkInputquantity() {
    let portionElement = document.getElementById('portion');
    
    if (portionElement.value !== '') {          
        portionElement.classList.remove('red-color');    
    } 
}

function parseInformationforRecipe(test) {
    let heading = document.getElementById('heading');
    heading.textContent = test.recipe;
    let MinutesTop = document.getElementById('MinutesTop');
    MinutesTop.textContent = test.minutes;
    let difficultyTop = document.getElementById('difficultyTop');
    difficultyTop.textContent = test.difficulty;
    let MinutesBottomOne = document.getElementById('MinutesBottomOne');
    MinutesBottomOne.textContent = test.minutesapprox;
    let MinutesBottomTwo = document.getElementById('MinutesBottomTwo');     
    MinutesBottomTwo.textContent = test.overalltime;       
    let preparationText = document.getElementById('preparationText');     
    preparationText.textContent = test.preparation;
}

function createTableElement(tableData) {
    let portion = document.getElementById('portion').value;
    let table = document.getElementById('dynamic-table');
    table.innerHTML = `
        <tr>
            <th class="hMenge">
                Menge
            </th>         
            <th class="hZutat">
                Zutat
            </th>
        </tr>
            
        `;
    for (let i = 0; i < tableData.length; i++) {
        const element = tableData[i];

        table.innerHTML += `
            <tr>
                <td class="quantitycolm">
                    ${portion * element.quantity} ${element.einheit}
                </td>
                <td class="elementcolm">
                    ${element.description}
                </td>
            </tr>
        
        `
    }   
}


