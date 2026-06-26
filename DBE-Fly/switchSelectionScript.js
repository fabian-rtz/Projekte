const btnFlight = document.getElementById("btnFlight");
const btnFlightHotel = document.getElementById("btnFlightHotel");
const btnVehicle = document.getElementById("btnVehicle");
const btnHotel = document.getElementById("btnHotel");

const SelectedContainerFlight = document.getElementById("SelectedContainerFlight");
const SelectedContainerFlightHotel = document.getElementById("SelectedContainerFlightHotel");
const SelectedContainerVehicle = document.getElementById("SelectedContainerVehicle");
const SelectedContainerHotel = document.getElementById("SelectedContainerHotel");

const inputAdults = document.getElementById("inputAdults");
const btnPlus = document.getElementById("plus");
const btnMinus = document.getElementById("minus");

const btnSwitch = document.getElementById("btnSwitch");
const inputFromAirport = document.getElementById("inputFromAirport");
const inputToAirport = document.getElementById("inputToAirport");

btnSwitch.addEventListener("click", () => {
    let valueFromAirport = inputFromAirport.value;

    inputFromAirport.value = inputToAirport.value;
    inputToAirport.value = valueFromAirport;
});

btnPlus.addEventListener("click", () => {
  let value = parseInt(inputAdults.value) || 0;
  inputAdults.value = value + 1;
});

btnMinus.addEventListener("click", () => {
  let value = parseInt(inputAdults.value) || 0;
  if (value > 0) inputAdults.value = value - 1; 
});

function showSection(activeButton, activeSection) {

    btnFlight.classList.remove("active");
    btnFlightHotel.classList.remove("active");
    btnVehicle.classList.remove("active");
    btnHotel.classList.remove("active");

    SelectedContainerFlight.style.display = "none";
    SelectedContainerFlightHotel.style.display = "none";
    SelectedContainerVehicle.style.display = "none";
    SelectedContainerHotel.style.display = "none";

    document.getElementById("imgFlight").src = "img/Flight_White.png";
    document.getElementById("imgFlightHotel").src = "img/Flight & Hotel_White.png";
    document.getElementById("imgVehicle").src = "img/Vehicle_White.png";
    document.getElementById("imgHotel").src = "img/Bed_White.png";

    activeButton.classList.add("active");
    activeSection.style.display = "flex";

    const img = activeButton.querySelector("img");
    const src = img.src;

    if (activeButton === btnFlight) {
        document.getElementById("imgFlight").src = "img/Flight_Green.png";
    } else if (activeButton === btnFlightHotel) {
        document.getElementById("imgFlightHotel").src = "img/Flight & Hotel_Green.png";
    } else if (activeButton === btnVehicle) {
        document.getElementById("imgVehicle").src = "img/Vehicle_Green.png";
    } else if (activeButton === btnHotel) {
        document.getElementById("imgHotel").src = "img/Bed_Green.png";
    }
}

  btnFlight.onclick = () => showSection(btnFlight, SelectedContainerFlight);
  btnFlightHotel.onclick = () => showSection(btnFlightHotel, SelectedContainerFlightHotel);
  btnVehicle.onclick = () => showSection(btnVehicle, SelectedContainerVehicle);
  btnHotel.onclick = () => showSection(btnHotel, SelectedContainerHotel);

  showSection(btnFlight, SelectedContainerFlight);