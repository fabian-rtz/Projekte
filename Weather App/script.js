
const apiKey = "44513c071fbd90447067b9d1dfbaee1a";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";



async function checkWeather(){
    let response = null;
    var CityName = document.getElementById('Searchcity');

   
    if(CityName !=null){     
        if(CityName.value != ""){     
          
            response = await fetch(apiUrl + `&q=${CityName.value}` + `&appid=${apiKey}`);                
        }
        else{         
            response = await fetch(apiUrl + `&q=Biedenkopf`+`&appid=${apiKey}`);          
        }    
    }
    else{
        response = await fetch(apiUrl + `&q=Biedenkopf`+`&appid=${apiKey}`);
    }
    
    var data = await response.json();
   
    
    updateWeather(data);
    
}
function updateWeather(data){
   
 
    if (data.main !== undefined) {
        document.getElementById('city').innerHTML = data.name;
        document.getElementById('temp').innerHTML = Math.round(data.main.temp) + "°C";
        document.getElementById('percentage').innerHTML = data.main.humidity + " %"; 
        document.getElementById('kmh').innerHTML = Math.round(data.wind.speed) + " km/h"; 
       
        switch (data.weather[0].main) {
            case "Clouds":
                document.getElementById('imgTemp').src = "./img/clouds.png";
                break;
            case "Clear":
                document.getElementById('imgTemp').src = "./img/clear.png";
                break;
            case "Rain":
                document.getElementById('imgTemp').src = "./img/rain.png";
                break;
            case "Drizzle":
                document.getElementById('imgTemp').src = "./img/drizzle.png";
                break;
            case "Mist":
                document.getElementById('imgTemp').src = "./img/mist.png";
                break;
            default:
                break;
        }

    }
    else{
        alert("Stadt wurde nicht gefunden!");
    }
   
    
}

checkWeather();