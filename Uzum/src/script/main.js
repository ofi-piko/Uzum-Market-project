import axios from "axios";

import "../Components/script/Header.js";
import "../Components/script/footer.js";
import "../Components/script/swiper.js";

import "../styles/main.css";
import "../styles/cart.css";
import "../styles/one-product.css";
import "../styles/product.css";
import "../styles/tovar.css";
import "../styles/favorite.css";

import "../Components/style/footer.css";
import "../Components/style/swiper.css";

import "../script/cart.js";
import "../script/one-product.js";
import "../script/tovar.js";
import "../script/screach.js";
import "../script/backend.js";
import "../script/product.js";
import "../script/favorite.js";

const header = document.getElementById("header");
const liked = document.getElementById("liked");

/*----------------------------------------------*/

const kategorias = document.getElementsByClassName("katalog-btn");
const topMenuEl = document.getElementById("top-menu");

Array.from(kategorias).forEach(el => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    topMenuEl.style.display = topMenuEl.style.display === "block" ? "none" : "block";
  });
});



document.addEventListener('DOMContentLoaded', function () {
  const searchHolder = document.getElementById('screach_holder');
  const searchInput = searchHolder.querySelector('input[type="search"]');

  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'search-results';
  resultsContainer.style.cssText = 'margin-top: 10px; background: white; border: 1px solid #ddd; border-radius: 4px; max-height: 300px; overflow-y: auto; display: none;';
  searchHolder.appendChild(resultsContainer);

  let debounceTimer;

  async function searchOnBackend(query) {
    if (!query.trim()) {
      resultsContainer.style.display = 'none';
      return;
    }

    try {
      const response = await fetch(`https://ваш-бекенд.ru/api/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error('Ошибка сети');
      }

      const data = await response.json();
      displayResults(data);

    } catch (error) {
      console.error('Ошибка поиска:', error);
      resultsContainer.innerHTML = '<div style="padding: 10px; color: red;">Ошибка соединения с сервером</div>';
      resultsContainer.style.display = 'block';
    }
  }

  function displayResults(results) {
    if (!results || results.length === 0) {
      resultsContainer.innerHTML = '<div style="padding: 10px; color: #666;">Ничего не найдено</div>';
      resultsContainer.style.display = 'block';
      return;
    }

    let html = '';

    results.forEach(item => {
      if (item.type === 'phone' || item.category === 'phones') {
        html += `
          <div class="result-item" style="padding: 10px; border-bottom: 1px solid #eee; cursor: pointer;">
            <div style="font-weight: bold;">${item.name || 'Телефон'}</div>
            ${item.description ? `<div style="font-size: 12px; color: #666;">${item.description}</div>` : ''}
            ${item.price ? `<div style="color: green; margin-top: 5px;">${item.price} ₽</div>` : ''}
          </div>
        `;
      }
    });

    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'block';

    document.querySelectorAll('.result-item').forEach(item => {
      item.addEventListener('click', function () {
        searchInput.value = this.querySelector('div:first-child').textContent;
        resultsContainer.style.display = 'none';
      });
    });
  }

  searchInput.addEventListener('input', function (e) {
    const query = e.target.value;

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      searchOnBackend(query);
    }, 300);
  });

  document.addEventListener('click', function (e) {
    if (!searchHolder.contains(e.target)) {
      resultsContainer.style.display = 'none';
    }
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      resultsContainer.style.display = 'none';
    }
  });
});