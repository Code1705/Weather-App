const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const placeEl = document.getElementById("place");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const API_KEY = "c520069418ab473597263fd8fc8fd1c4";

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML = `${
    hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat
  }:${minutes < 10 ? "0" + minutes : minutes} <span id="am-pm">${ampm}</span>`;
  dateEl.innerHTML = `${days[day]}, ${date} ${months[month]}`;
}, 1000);

getWeatherData();

function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    // console.log(success);

    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
}

function showWeatherData(data) {
  const main = data.main;
  const wind = data.wind;
  const sys = data.sys;
  let humidity = main.humidity;
  let pressure = main.pressure;
  let sunrise = sys.sunrise;
  let sunset = sys.sunset;
  let wind_speed = wind.speed;
  const timezoneOffsetMinutes = data.timezone / 60;
  const hours = Math.floor(timezoneOffsetMinutes / 60);
  const minutes = timezoneOffsetMinutes % 60;
  const formattedTimezone = `UTC${hours >= 0 ? "+" : "-"}${Math.abs(
    hours
  )}:${minutes.toString().padStart(2, "0")}`;

  timezone.innerHTML = `
    <i class="fas fa-clock"></i> <strong>Timezone:</strong> ${formattedTimezone}
`;

  countryEl.innerHTML = `
    <i class="fas fa-map-marker-alt"></i> 
    <strong>Coordinates:</strong> ${data.coord.lat.toFixed(
      2
    )}°N, ${data.coord.lon.toFixed(2)}°E
`;

  placeEl.innerHTML = `
        <i class="fas fa-map-pin"></i> 
        <strong>Location:</strong> ${data.name}, ${sys.country}
    `;

  currentWeatherItemsEl.innerHTML = `
      <div class="weather-item">
          <div>Humidity</div>
          <div>${humidity}%</div>
      </div>
      <div class="weather-item">
          <div>Pressure</div>
          <div>${pressure} hPa</div>
      </div>
      <div class="weather-item">
          <div>Wind Speed</div>
          <div>${wind_speed} m/s</div>
      </div>
      <div class="weather-item">
          <div>Sunrise</div>
          <div>${new Date(sunrise * 1000).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}</div>
      </div>
      <div class="weather-item">
          <div>Sunset</div>
          <div>${new Date(sunset * 1000).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}</div>
      </div>
    `;
  let otherDayForecast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTempEl.innerHTML = `
        <img src="http://openweathermap.org/img/wn/${
          day.weather[0].icon
        }@4x.png" alt="weather-icon" class="w-icon">
        <div class="others">
            <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
            <div class="temp">Night - ${day.temp.night}&#176;C</div>
            <div class="temp">Day - ${day.temp.day}&#176;C</div>
        </div>
      `;
    } else {
      otherDayForecast += `
        <div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
            <img src="http://openweathermap.org/img/wn/${
              day.weather[0].icon
            }@2x.png" alt="weather-icon" class="w-icon">
            <div class="temp">Night - ${day.temp.night}&#176;C</div>
            <div class="temp">Day - ${day.temp.day}&#176;C</div>
        </div>
      `;
    }
  });

  weatherForecastEl.innerHTML = otherDayForecast;
}
