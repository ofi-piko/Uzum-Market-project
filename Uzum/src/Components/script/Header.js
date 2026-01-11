export const header = document.getElementById("header");

header.innerHTML = `
<div id="header_content">
      <div id="header_left">
        <div id="header_logo">
          <a href="./index.html">
            <img src="./public/icons/logo/logo.svg" alt="">
          </a>
        </div>
        <br>
        <div id="katalog">
          <a href="#" class="katalog-btn">Каталог</a>
        </div>

        <div id="screach_holder">
          <input type="search" placeholder="Искать товары">
        </div>
      </div>

      <div id="need-content">
        <div id="user-content">
          <img src="./public/icons/logo/user.png" alt="">
          <div id="user-name">ofi_piko</div>
        </div>

        <div id="saved">
          <a href="./favirite.html">Избранное</a>
        </div>

        <div id="cart">
          <a href="./cart">Корзина</a>
          <div id="cart-number">3</div>
        </div>
      </div>

    </div>
    <br>
    <br>
`;

document.addEventListener('DOMContentLoaded', function () {
  const searchHolder = document.getElementById('screach_holder');
  const hintElement = document.createElement('div');
  hintElement.className = 'hint';
  searchHolder.appendChild(hintElement);

  const searchInput = searchHolder.querySelector('input[type="search"]');

  searchInput.addEventListener('input', function (e) {
    const value = e.target.value.toLowerCase();
    const phoneKeywords = ['тел', 'телефон', 'phone', 'смартфон', 'мобильный'];
    const isPhoneSearch = phoneKeywords.some(keyword => value.includes(keyword));

    if (isPhoneSearch && value.trim() !== '') {
      hintElement.style.display = 'block';
      hintElement.textContent = 'Телефон';
    } else {
      hintElement.style.display = 'none';
    }
  });
});
