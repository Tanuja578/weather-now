async function getWeather() {
  const city = document.getElementById("city").value.trim();
  const resultEl = document.getElementById("result");
  const errorEl = document.getElementById("error");

  // Reset
  resultEl.classList.add("hidden");
  errorEl.textContent = "";

  if (!city) {
    errorEl.textContent = "Please enter a city name.";
    return;
  }

  try {
    // Step 1: Get city coordinates
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city
      )}`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      errorEl.textContent = "City not found. Please try again.";
      return;
    }

    // ✅ properly closed above try + if now

    // Step 2: Fetch weather data
    const { latitude, longitude, name, country } = geoData.results[0];
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const weatherData = await weatherRes.json();

    // Step 3: Display result
    const { temperature, windspeed } = weatherData.current_weather;

    resultEl.innerHTML = `
        <h3>${name}, ${country}</h3>
        <p>🌡️ Temperature: ${temperature}°C</p>
        <p>💨 Wind Speed: ${windspeed} km/h</p>
      `;
    resultEl.classList.remove("hidden");
  } catch (error) {
    console.error("Error:", error);
    errorEl.textContent = "Error fetching weather data. Try again.";
  }
}
