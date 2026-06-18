let ItemContainer = document.getElementById("ItemContainer");
let QuickAccess = document.querySelector(".QuickAccessContainer");
let Character = document.querySelector(".CharacterItems");
let ClickItemSlot = document.getElementsByClassName("imgItem");

let selected = null;

fetch("./JSON/items.json")
  .then((response) => response.json())
  .then((items) => {
    showItems(items);
    setupDragAndDrop();
    itemInfo(items);
  });

function showItems(items) {
  let html = "";
  items.forEach((item) => {
    html += `
          <div class="ItemSlot">
              <img class="imgItem" src="${item.img_path}" draggable="true" data-item-type="${item.wearable_as[0]}" alt="${item.name}">
          </div>
        `;
  });
  ItemContainer.innerHTML = html;
}

function setupDragAndDrop() {
  let items = ItemContainer.getElementsByClassName("ItemSlot");
  let quickSlots = QuickAccess.getElementsByClassName("ItemSlot");
  let CharacterItems = Character.getElementsByClassName("ItemSlot");

  // Drag von der "Alle Items" Liste
  for (let item of items) {
    item.addEventListener("dragstart", function (e) {
      if (e.target.tagName === 'IMG') {
        selected = e.target.cloneNode(true);
      }
    });
  }

  // Drag & Drop für Schnellzugriff
  for (let slot of quickSlots) {
    slot.addEventListener("dragstart", function (e) {
      if (e.target.tagName === 'IMG') {
        selected = e.target;
      } else {
        e.preventDefault(); // Verhindert das Ziehen von leeren Slots
      }
    });

    slot.addEventListener("dragover", function (e) {
      e.preventDefault();
    });

    slot.addEventListener("drop", function (e) {
      e.preventDefault();
      if (selected && this.children.length === 0) {
        this.appendChild(selected);
        selected = null;
      }
    });
  }

  // Drag & Drop für Charakter-Slots
  for (let characteritem of CharacterItems) {
    characteritem.addEventListener("dragstart", function (e) {
      if (e.target.tagName === 'IMG') {
        selected = e.target;
      } else {
        e.preventDefault(); 
      }
    });

    characteritem.addEventListener("dragover", function (e) {
      e.preventDefault();
    });

    characteritem.addEventListener("drop", function (e) {
      e.preventDefault();
      if (selected && this.children.length === 0) {
        let itemType = selected.getAttribute("data-item-type");
        let slotType = this.getAttribute("data-slot-type");

        if (itemType === slotType) {
          this.appendChild(selected);
          selected = null;
        }
      }
    });
  }
}

function itemInfo(items) {
  let ItemInfoContainer = document.getElementById("ItemInfoContainer");

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("imgItem")) {
      let itemName = e.target.alt;

      for (let i = 0; i < items.length; i++) {
        if (itemName === items[i].name) {
          ItemInfoContainer.style.display = "block";
          ItemInfoContainer.innerHTML = `
              <h2 id="ItemInfoName">${items[i].name}</h2>
              <p id="ItemInfoDescription">Beschreibung:${items[i].description}</p>
              <p id="ItemInfoCost">Kosten:${items[i].cost_in_gold}\Gold</p>
              <p id="ItemInfoWearable">Tragbar on-${items[i].wearable_as}</p>
          `;
          break;
        }
      }
    }
  });
}