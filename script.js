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
  countriesContainer.style.opacity = 1;
};

//export to other js file
export { renderCountry, btn, countriesContainer };

const request = fetch(
  'https://countries-api-836d.onrender.com/countries/name/portugal',
);

const getCountryDataPromise = function (country) {
  fetch(`https://countries-api-836d.onrender.com/countries/name/${country}`)
    .then(
      response => response.json(),
      err => alert(err),
    )
    .then(data => {
      renderCountry(data[0]);
      const neighbor = data[0].borders?.[0];

      return fetch(
        `https://countries-api-836d.onrender.com/countries/alpha/${neighbor}`,
      );
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      renderCountry(data, 'neighbor');
    });
};

btn.addEventListener('click', function () {
  getCountryDataPromise('portugal');
});
