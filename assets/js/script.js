"use strict";

/////////////////////////////////////////////////
// DOM Elements

const countriesContainer = document.querySelector(".countries");
const btn = document.querySelector(".btn-country");

/////////////////////////////////////////////////
// Functions

// Get user's current position using Geolocation API
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// Fetch JSON data from a given URL and handle errors
const getJSON = function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

// Render country data to the DOM
const renderCountry = function (data) {
  // Remove any existing country or error message
  document.querySelector(".country")?.remove();
  document.querySelector(".error-message")?.remove();

  const html = `
    <article class="country">
      <img class="country__img" src="${data.flags.png}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          data.population / 1000000
        ).toFixed(2)}M People</p>
        <p class="country__row"><span>🗣️</span>${
          Object.values(data.languages)[0]
        }</p>
        <p class="country__row"><span>💰</span>${
          Object.values(data.currencies)[0].name
        } (${Object.values(data.currencies)[0].symbol})</p>
      </div>
    </article>
    `;

  countriesContainer.insertAdjacentHTML("beforeend", html);
};

// Render error message to the DOM
const renderError = function (msg) {
  // Remove any existing country or error message
  document.querySelector(".error-message")?.remove();
  document.querySelector(".country")?.remove();

  const html = `
    <div class="error-message">
      ${msg}
    </div>
  `;

  countriesContainer.insertAdjacentHTML("beforeend", html);
};

///////////////////////////////////////
// Event Handler

const whereAmI = async function () {
  try {
    // Get user's position
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    // Reverse geocode to get the country name
    const { countryName } = await getJSON(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      "Problem with geocoding"
    );

    // Fetch country data using the country name
    const [data] = await getJSON(
      `https://restcountries.com/v3.1/name/${countryName}`,
      "Country not found"
    );

    // Render country
    renderCountry(data);
  } catch (error) {
    console.error(`${error} 💥`);
    renderError(`💥 ${error.message}`);
  } finally {
    countriesContainer.style.opacity = 1;
  }
};

///////////////////////////////////////
// Event Listener

// Start the geolocation process when the button is clicked
btn.addEventListener("click", whereAmI);
