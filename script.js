'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

//render HTML of queried country and insert it into HTML document
const renderCountry = function (data, className = '') {
  const html = `
     <article class="country ${className}">
        <img class="country__img" src="${data.flag}" />
        <div class="country__data">
          <h3 class="country__name">${data.name}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${(
            +data.population / 1000000
          ).toFixed(1)}</p>
          <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
          <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
        </div>
      </article>
    `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};

//export to other js file
export { renderCountry, btn, countriesContainer, getCountryDataPromise2 };

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};

//helper function
const getJSON = function (url, errorMsg = 'Something went wrong.') {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`${errorMsg} (${response.status})`);
    }
    console.log(response);
    return response.json();
  });
};

//without helper function
const getCountryDataPromise = function (country) {
  fetch(`https://countries-api-836d.onrender.com/countries/name/${country}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Country not found (${response.status})`);
      }
      console.log(response);
      return response.json();
    })
    .then(data => {
      renderCountry(data[0]);
      const neighbor = data[0].borders?.[0];

      if (!neighbor) return;

      return fetch(
        `https://countries-api-836d.onrender.com/countries/alpha/${neighbor}`,
      );
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Country not found (${response.status})`);
      }
      return response.json();
    })
    .then(data => {
      renderCountry(data, 'neighbor');
    })
    .catch(err => {
      console.error(`${err}`);
      renderError(`Something went wrong. ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

//with helper function
const getCountryDataPromise2 = function (country) {
  getJSON(
    `https://countries-api-836d.onrender.com/countries/name/${country}`,
    'Country not found!',
  )
    .then(data => {
      renderCountry(data[0]);
      const neighbor = data[0].borders?.[0];

      if (!neighbor) {
        throw new Error('No neighbor found!');
      }

      return getJSON(
        `https://countries-api-836d.onrender.com/countries/alpha/${neighbor}`,
        'Country not found!',
      );
    })
    .then(data => {
      renderCountry(data, 'neighbor');
    })
    .catch(err => {
      console.error(`${err}`);
      renderError(`Something went wrong. ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

console.log("HELLO world");
btn.addEventListener('click', function () {
  getCountryDataPromise2('portugal');
  count;
});
