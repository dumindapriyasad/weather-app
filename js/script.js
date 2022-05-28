/*
# Weather App
# Developed by Duminda Priyasad
*/

/* Main Weather Object */
const weather = {
    apiKeyGeolocation: "13841960-bf98-11ec-bdc4-5134c1fdde2f",
    
    apiKeyWeather: "3e8a0bbe211322aafb5fdd50c0c3150e",

    /* Display Weather */
    displayWeather: (data) => {
        // Get date and time
        const getDateTime = (timestamp) => {
            const dateTime = {};
            const milliseconds = timestamp * 1000;
            const dateObject = new Date(milliseconds);
            const weekDay = dateObject.toLocaleString("en-US", {weekday: "short"});
            const day = dateObject.toLocaleString("en-US", {day: "numeric"});
            const month = dateObject.toLocaleString("en-US", {month: "short"});
            const time = dateObject.toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"});
            dateTime.date = `${weekDay}, ${month} ${day}`;
            dateTime.time = time;
            return dateTime;
        }

        const {name} = data;
        const {date} = getDateTime(data.dt);
        const {description, icon} = data.weather[0];
        const {temp, feels_like, temp_min, temp_max, pressure, humidity} = data.main;
        const sunrise = getDateTime(data.sys.sunrise).time;
        const sunset = getDateTime(data.sys.sunset).time;
        const {speed} = data.wind;
        const {all} = data.clouds;

        document.querySelector(".city").innerText = `Weather in ${name}`;
        document.querySelector(".date").innerText = date;
        document.querySelector(".temp").innerText = `${Math.round(temp)}°C`;
        document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}.png`;
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp-min-max .min").innerText = `${Math.round(temp_min)}°C`;
        document.querySelector(".temp-min-max .max").innerText = `${Math.round(temp_max)}°C`;
        document.querySelector(".feels").innerText = `Feels like: ${Math.round(feels_like)}°C`;
        document.querySelector(".sunrise").innerText = `Sunrise: ${sunrise}`;
        document.querySelector(".sunset").innerText = `Sunset: ${sunset}`;
        document.querySelector(".wind").innerText = `Wind speed: ${speed.toFixed(1)}m/s`;
        document.querySelector(".pressure").innerText = `Pressure: ${pressure}hPa`;
        document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
        document.querySelector(".clouds").innerText = `Clouds: ${all}%`;
        document.querySelector(".help-text").innerText = "The sunrise and sunset times are based on your local time.";
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.background = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://source.unsplash.com/random/?${name}')`;
    },
    
    /* Get Weather */
    getWeather: (lat, lon) => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weather.apiKeyWeather}`)
        .then((response) => {
            if(!response.ok) {
                alert("No weather information found, Please try again.");
            }
            return response.json();
        })
        .then((data) => weather.displayWeather(data))
        .catch((error) => {
            alert("No weather information found, Please try again.");
        });
    },

    /* Get City Coordinate */
    getCityCoordinate: (city) => {
        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weather.apiKeyWeather}`)
        .then((response) => {
            if(!response.ok) {
                alert("No city found, Please try again.");
            }
            return response.json();
        })
        .then((data) => weather.getWeather(data[0].lat, data[0].lon))
        .catch((error) => {
            alert("No city found, Please try again.");
        });
    },

    /* Get User Geolocation by IP Address */
    getGeolocationByIP: () => {
        fetch(`https://api.ipbase.com/json/?apikey=${weather.apiKeyGeolocation}`)
        .then((response) => {
            if(!response.ok) {
                alert("No city found, Please enter your city.");
            }
            return response.json();
        })
        .then((data) => weather.getWeather(data.latitude, data.longitude))
        .catch((error) => {
            alert("No city found, Please enter your city.");
        });
    },

    /* Get User Geolocation by GPS */
    getGeolocationByGPS: () => {
        const onSuccess = (position) => {
            const {latitude, longitude} = position.coords;
            weather.getWeather(latitude, longitude);
        }

        const onError = () => {
            // If gps occur errors call getGeolocationByIP
            weather.getGeolocationByIP();
        }

        if(!navigator.geolocation) {
            // If gps not support call getGeolocationByIP
            weather.getGeolocationByIP();
        } else {
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        }
    }
}

/* Validate City Text Field */
const validate = (val) => {
    // Check empty value
    if(val.length == 0) {
        alert("Please enter a city");
    } else {
        // Check not only letters and spaces contain
        if((/^[A-Za-z\s]*$/.test(val)) == false) {
            alert("Please enter correct city name");
        } else {
            // Remove city text field value and call getCityCoordinate if value is clear
            document.querySelector(".search-field").value = "";
            weather.getCityCoordinate(val);
        }
    }
}

/* Default Function */
weather.getGeolocationByGPS();

/* Search Button Event */
document.querySelector(".search-btn").addEventListener("click", () => {
    validate(document.querySelector(".search-field").value);
});

/* Enter Key Event */
document.querySelector(".search-field").addEventListener("keyup", (event) => {
    if(event.key == "Enter") {
        validate(document.querySelector(".search-field").value);
    }
});