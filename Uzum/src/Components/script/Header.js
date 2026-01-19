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
          <div id="user-name"><a href="UserProfile.html">login</a></div>
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
  
  const keywordHints = {
    'мебель': 'Furniture',
    'аудотехника': 'Audio equipment',
    'Кухонная техника': 'Kitchen appliances',
    'ноутбук': 'Laptops',
    'компьютер': 'Computers ',
    'электроника': 'Electronics',
  };

  searchInput.addEventListener('input', function (e) {
    const value = e.target.value.toLowerCase().trim();
    
    if (value === '') {
      hintElement.style.display = 'none';
      return;
    }

    let foundHint = '';
    
    for (const [keyword, hint] of Object.entries(keywordHints)) {
      if (value.includes(keyword)) {
        foundHint = hint;
        break;
      }
    }

    if (foundHint) {
      hintElement.style.display = 'block';
      hintElement.textContent = `${foundHint}`;
    } else {
      hintElement.style.display = 'none';
    }
  });

  searchInput.addEventListener('blur', function () {
    setTimeout(() => {
      hintElement.style.display = 'none';
    }, 200);
  });

  searchInput.addEventListener('focus', function () {
    if (searchInput.value.trim() !== '') {
      searchInput.dispatchEvent(new Event('input'));
    }
  });
});

function updateLogo() {
  const logo = document.querySelector('#header_logo img');
  const link = document.querySelector('#header_logo a');
  
  if (window.innerWidth < 925) {
    logo.src = './public/icons/logo/logo2.png';
    logo.alt = 'Логотип для мобильных';
    logo.title = 'Мобильная версия';
  } else {
    logo.src = './public/icons/logo/logo.svg';
    logo.alt = 'Основной логотип';
    logo.title = 'Версия для ПК';
  }
}

// Обновляем логотип при загрузке
document.addEventListener('DOMContentLoaded', updateLogo);

// Обновляем логотип при изменении размера окна
window.addEventListener('resize', updateLogo);