function getWindDirection(degree) {
      const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      return directions[Math.round(degree / 45) % 8];
    }

    function findWeather() {
      const apiKey = '45bc2825d14d0228edeffef6a13f18cb'; // Replace with your valid API key
      const city = document.querySelector('.textInput').value.trim();
      const info = document.querySelector('.weatherInfo');

      if (city === "") {
        info.innerHTML = `<p style="color: red;">Please enter a city name.</p>`;
        info.style.display = 'block';
        return;
      }

      info.innerHTML = `<p>Loading...</p>`;
      info.style.display = 'block';

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error("City not found or API error.");
          }
          return response.json();
        })
        .then(data => {
          const temp = data.main.temp;
          const windSpeed = data.wind.speed;
          const windDeg = data.wind.deg;
          const windDir = getWindDirection(windDeg);
          const pressure = data.main.pressure;
          const humidity = data.main.humidity;
          const country = data.sys.country;
          const icon = data.weather[0].icon;
          const description = data.weather[0].description;
          const weatherMain = data.weather[0].main.toLowerCase();
          const localTime = new Date((data.dt + data.timezone) * 1000);
          const localTimeString = localTime.toUTCString().replace("GMT", "");

          let conditionIcon = "";
          if (weatherMain.includes("rain")) {
            conditionIcon = "🌧️ Rainy";
          } else if (weatherMain.includes("cloud")) {
            conditionIcon = "☁️ Cloudy";
          } else if (weatherMain.includes("clear")) {
            conditionIcon = "☀️ Clear";
          } else if (weatherMain.includes("snow")) {
            conditionIcon = "❄️ Snowy";
          } else if (weatherMain.includes("thunderstorm")) {
            conditionIcon = "⛈️ Thunderstorm";
          } else {
            conditionIcon = "🌡️ Weather";
          }

          info.innerHTML = `
            <h2>${data.name}, ${country}</h2>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
            <p><strong>${temp}°C</strong> - ${description} (${conditionIcon})</p>
            <p>Wind: ${windSpeed} m/s (${windDir})</p>
            <p>Pressure: ${pressure} hPa</p>
            <p>Humidity: ${humidity}%</p>
            <p>Local Time: ${localTimeString}</p>
          `;
        })
        .catch(error => {
          console.error("Error:", error);
          info.innerHTML = `<p style="color: red;">${error.message}</p>`;
        });

      // Change Submit button to clicked style
      document.querySelectorAll('.click').forEach(btn => {
        if (btn.innerText === 'Submit') {
          btn.classList.remove('click');
          btn.classList.add('clicked');
        }
      });
    }

    function resetWeather() {
      document.querySelector('.textInput').value = '';
      const info = document.querySelector('.weatherInfo');
      info.style.display = 'none';
      info.innerHTML = '';

      // Reset all buttons to default style
      document.querySelectorAll('.click, .clicked').forEach(btn => {
        btn.classList.remove('clicked');
        btn.classList.add('click');
      });

      // Change Reset button to clicked style
      document.querySelectorAll('.click').forEach(btn => {
        if (btn.innerText === 'Reset') {
          btn.classList.remove('click');
          btn.classList.add('clicked');
        }
      });

      // Optional: Revert back after 1 second
      setTimeout(() => {
        document.querySelectorAll('.clicked').forEach(btn => {
          btn.classList.remove('clicked');
          btn.classList.add('click');
        });
      }, 1000);
    }