
 let totalDelay = 2 * 1000 + 450; 
 let hallId = localStorage.getItem("selectedHallID");

 setTimeout(() => {
  window.location.href = `Saal_${hallId}.html`;
 }, totalDelay);