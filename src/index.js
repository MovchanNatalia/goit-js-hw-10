import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputElem = document.querySelector('#search-box');
const listElem = document.querySelector('.country-list');
const infoElem = document.querySelector('.country-info');

inputElem.addEventListener(
  'input',
  debounce(renderInfoCountry, DEBOUNCE_DELAY)
);

function renderInfoCountry() {
  const inputValue = inputElem.value.trim();
  cleanHtml();
  if (inputValue !== '') {
    fetchCountries(inputValue)
      .then(country => {
        if (country.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (country.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        } else if (country.length >= 2 && country.length <= 10) {
          renderCountryList(country);
        } else if (country.length === 1) {
          renderOneCountry(country);
        }
      })
      .catch(err => {
        if (err.message === '404') {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        }
      });
  }
}

function renderCountryList(country) {
  const markup = country
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="60" hight="30">
         <h2>${country.name.official}</h2>
                </li>`;
    })
    .join('');
  listElem.innerHTML = markup;
}

function renderOneCountry(country) {
  const markup = country
    .map(country => {
      return `<li >
      <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="30" hight="20">
         <b>${country.name.official}</b></p>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)} </p>
                </li>`;
    })
    .join('');
  listElem.innerHTML = markup;
}

function showError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function cleanHtml() {
  listElem.innerHTML = '';
  infoElem.innerHTML = '';
}
