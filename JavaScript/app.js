let container = document.getElementById("container");
let searchForm = document.getElementById("searchSubmit");
let searchInput = document.getElementById("searchInput");
let btn = document.getElementById("btn");
let temperaturaDegree;
let weatherIcon;
let weatherDescription;
let city;
let date;
let min;
let wet;

/*AQUI EL USUARIO BUSCA LA CIUDAD */
searchForm.addEventListener("submit", e => {
    e.preventDefault();
    //verificar si no esta vacio el input
    if (searchInput.value == "") {
        alert("Enter your city, please");
    } else {
        getWeatherData(searchInput.value);
        /*getWeatherDataWeek(searchInput.value);*/
    }
})

window.onload = () => {
    getWeatherData("New York");
}

/**********************************************FUNCION PRINCIPAL */
getWeatherData = async(city) => {
        //Hacer Request a la API y obtener un objeto que contega los datos
    //Fetch
    const res = await fetch(`https://community-open-weather-map.p.rapidapi.com/find?q=${city}&units=metric`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "f1c4b3b521msh8248e71e60e0da9p1b03d5jsn70ec269be27c",
		"x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
        }
    });
    const data = await res.json();
    //Verificar si encontró la ciudad
    if (data.count == 0) {
        alert("City not Found");
    }else{
        getWeatherDataWeek(city);

        //Cambiar las Imagenes del Weather Principal
        displayBackgroundImage(data);

        //Mostrar los Datos en pantalla
        displayData(data);
    }
}
getWeatherDataWeek = async(city) => {
    const resWeek = await fetch(`https://community-open-weather-map.p.rapidapi.com/forecast/daily?q=${city}&cnt=7&units=metric`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "f1c4b3b521msh8248e71e60e0da9p1b03d5jsn70ec269be27c",
		"x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
        }
    });  
    const dataWeek = await resWeek.json();
    dataWeek.list.splice(0,1);
    displayDataWeek(dataWeek);
}
/* ***************************************MOSTRAMOS LA INFOMRMACION */
displayData = (data) =>{
    const mainWeather = document.getElementById("main-weather");
    mainWeather.innerHTML = "";

    let dateWeek = new Date(data.list[0].dt *1000).toLocaleDateString("en-Us", {
        dateStyle: "long",
    });

    mainWeather.innerHTML = `
        <h2 id="city">${data.list[0].name + ", " + data.list[0].sys.country}</h2>
        <h3>${dateWeek}</h3>
        <img src="icons/${data.list[0].weather[0].icon}.png" alt="" id="icon">
        <h3>${data.list[0].weather[0].description.charAt(0).toUpperCase()+
            data.list[0].weather[0].description.slice(1)}</h3>
        <h2 class="grades">${Math.floor(data.list[0].main.temp)}°</h2>
        <div class="minmax">
            <h4 class="min">Min <span>${Math.floor(data.list[0].main.temp_min)}°</span></h4 ><h4 class="max">Max <span>${Math.floor(data.list[0].main.temp_max)}°</span></h4>
        </div>
        <div class="data">
            <img src="icons/humidity.png" alt=""><h4>Clouds: ${data.list[0].clouds.all}%</h4>
            <img src="icons/precipitation.png" alt=""><h4>Humidity: ${data.list[0].main.humidity}%</h4>
            <img src="icons/wind.png" alt=""><h4>Wind Speed: ${data.list[0].wind.speed}m/s</h4>
        </div>
    `;
    displayBackgroundImage(data);
}
displayDataWeek = (data) =>{
    WeekWeather = document.getElementById("weekWeather");
    WeekWeather.innerHTML = "";            
    
    data.list.forEach(list => {
        let dateDay = new Date(list.dt * 1000).toLocaleString("en-Us", {
        weekday: "long",
    });
    WeekWeather.innerHTML += `
            <div class="day">
            <h3>${dateDay}</h3>
            <img src="icons/${list.weather[0].icon}.png" alt="" id="icon2">
            <h3>${list.weather[0].description.charAt(0).toUpperCase()+
                list.weather[0].description.slice(1)}</h3>
            <h2 >${Math.floor(list.temp.day)}° C</h2>
            <div class="data2">
                <img src="icons/morning.png" alt=""><h4>Morning: ${Math.floor(list.temp.morn)}° C</h4>
                <img src="icons/evening.png" alt=""><h4>Evening: ${Math.floor(list.temp.eve)}° C</h4>
                <img src="icons/night.png" alt=""><h4>Night: ${Math.floor(list.temp.night)}° C</h4>
            </div>
        </div>
    `;
    });
}
displayBackgroundImage = (data) => {
       let isDay = data.list[0].weather[0].icon.charAt(2);
        if (isDay === 'd') {
            container.className = "container backgroundDay";
            document.body.classList.remove("whiteLetters");
            searchInput.classList.remove("whiteLetters");
            btn.classList.remove("whiteLetters");
        }else{
            document.body.classList.add("whiteLetters");
            searchInput.classList.add("whiteLetters");
            btn.classList.add("whiteLetters");
            container.className = "container backgroundNight"
        }
}