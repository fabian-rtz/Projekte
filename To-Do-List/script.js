function addTask(){
    const inputBox = document.getElementById("task");
    const listContainer = document.getElementById("list-container");

    if(inputBox.value === ''){
        alert("Du musst etwas schreiben!");
    }
    else{
        let liTask = document.createElement("li");
        liTask.textContent = inputBox.value; // Use textContent instead of innerHTML for security
        listContainer.appendChild(liTask);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        liTask.appendChild(span);
    }

   inputBox.value = "";

   // Move the event listener here to ensure listContainer is defined before using it
   listContainer.addEventListener("click",function(e){     
        if(e.target.tagName ==="SPAN"){
            e.target.parentElement.remove();
        }
   },false);
}