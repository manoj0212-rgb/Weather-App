let isCelsius = true;
let currentTempCelsius = 0; // store to support accurate toggle
let map;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("getWeatherBtn").addEventListener("click", getweather);
    document.getElementById("toggleTempbtn").addEventListener("click", toggleTempUnit);

    document.getElementById("city").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission or reload
        getweather();
    }
});
});

async function getweather() {
    const city = document.getElementById("city").value;
    const apiKey = "78ad43f3a643f15bac93f20ad35547a1";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        displayWeather(data);
        updateMap(data.coord.lat, data.coord.lon , data.name);
    } catch (err) {
        alert("❌ " + err.message);
    }
}

function displayWeather(data) {
    document.getElementById("weatherInfo").classList.remove("hidden");
    document.getElementById("weatherInfo").style.display = "block";

    currentTempCelsius = data.main.temp;

    document.getElementById("cityName").textContent = `📍 ${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = `🌡️ Temp: ${currentTempCelsius.toFixed(1)}°C`;
    document.getElementById("condition").textContent = `🌥️ Weather: ${data.weather[0].description}`;
    document.getElementById("humidity").textContent = `💧 Humidity: ${data.main.humidity}%`;
    document.getElementById("wind").textContent = `🌬️ Wind: ${data.wind.speed} m/s`;

    const iconCode = data.weather[0].icon;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById("weatherIcon").alt = data.weather[0].main;
}

function toggleTempUnit() {
    const tempEl = document.getElementById("temperature");
    const toggleBtn = document.getElementById("toggleTempbtn");

    if (isCelsius) {
        const f = (currentTempCelsius * 9) / 5 + 32;
        tempEl.textContent = `🌡️ Temp: ${f.toFixed(1)}°F`;
        toggleBtn.textContent = "Switch to °C";
    } else {
        tempEl.textContent = `🌡️ Temp: ${currentTempCelsius.toFixed(1)}°C`;
        toggleBtn.textContent = "Switch to °F";
    }

    isCelsius = !isCelsius;
}

function updateMap(lat, lon , city) {
    if (!map) {
        map = L.map("map").setView([lat, lon], 10);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    } else {
        map.setView([lat, lon], 10);
    }

    L.marker([lat, lon]).addTo(map).bindPopup(`📍 ${city}`).openPopup();
}
