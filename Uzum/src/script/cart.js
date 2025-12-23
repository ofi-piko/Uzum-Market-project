document.addEventListener('DOMContentLoaded', () => {
  const korzinaEl = document.getElementById("korzina");

  if (!korzinaEl) return;

  let rfr = localStorage.getItem('product');
  let korzinaData;

  try {
    korzinaData = JSON.parse(rfr);
  } catch {
    korzinaData = null;
  }

  const hasProducts = (data) => {
    if (!data) return false;
    if (Array.isArray(data)) return data.length > 0 && data.some(item => item && item.name);
    return !!data.name;
  };

  if (hasProducts(korzinaData)) {
    let productsHTML = '';

    if (Array.isArray(korzinaData)) {
      productsHTML = korzinaData.map(item => `
        <div class="product">
          <div class="part1">
            <div class="product-img">
              <img src="${item.image || 'https://i.pinimg.com/1200x/87/ea/ac/87eaac4f32f29defe44bf3d8de752903.jpg'}" alt="${item.name}">
            </div>
          </div>
          <div class="part2">
            <div class="product-name">
              <h2>${item.name || 'Товар без названия'}</h2>
            </div>
            <div class="product-price">
              <h2>${formatPrice(item.price)}</h2>
            </div>
            <div class="product-number">
              <div class="counter">
                <button type="button" class="decrease">−</button>
                <input type="number" class="count" value="${item.quantity || 1}" min="1" />
                <button type="button" class="increase">+</button>
              </div>
            </div>
            <div class="product-button">
              <button type="button" class="delete-btn" data-id="${item.id || ''}">Удалить</button>
            </div>
          </div>
        </div>
      `).join('');
    } else {
      const item = korzinaData;
      productsHTML = `
        <div class="product">
          <div class="part1">
            <div class="product-img">
              <img src="${item.image || 'https://i.pinimg.com/1200x/87/ea/ac/87eaac4f32f29defe44bf3d8de752903.jpg'}" alt="${item.name}">
            </div>
          </div>
          <div class="part2">
            <div class="product-name">
              <h2>${item.name || 'Товар без названия'}</h2>
            </div>
            <div class="product-price">
              <h2>${formatPrice(item.price)}</h2>
            </div>
            <div class="product-number">
              <div class="counter">
                <button type="button" class="decrease">−</button>
                <input type="number" class="count" value="${item.quantity || 1}" min="1" />
                <button type="button" class="increase">+</button>
              </div>
            </div>
            <div class="product-button">
              <button type="button" class="delete-btn" data-id="${item.id || ''}">Удалить</button>
            </div>
          </div>
        </div>
      `;
    }

    korzinaEl.innerHTML = `
      <div class="korzina-container">
        <div class="products">
          ${productsHTML}
        </div>
        <div class="final-product">
          <div class="final-product__price">${calculateTotalPrice(korzinaData)}</div>
          <div class="final-product__currency">Итого</div>
          <div class="final-product__info">
            <div class="final-product__row"><b>Товары:</b> ${Array.isArray(korzinaData) ? korzinaData.length : 1}</div>
          </div>
          <button class="final-product__btn">Оформить заказ</button>
        </div>
      </div>
    `;

    initCounters();
    initDeleteButtons();
  } else {
    korzinaEl.innerHTML = `
      <div class="not-full-cart">
        <div class="cat-content">
          <div class="cat-img">
            <img src="./public/icons/img/shopocat1.png" alt="Корзина пуста">
          </div>
          <div class="cat-text">
            <h2>В корзине пока нет товаров</h2>
            <h5>Начните с подборок на главной странице или найдите нужный товар через поиск</h5>
          </div>
        </div>
      </div>
    `;
  }
});

function formatPrice(price) {
  if (typeof price === 'number') return price.toLocaleString('ru-RU') + ' сум';
  if (typeof price === 'string') {
    const numericPrice = price.replace(/\D/g, '');
    return parseInt(numericPrice || 0).toLocaleString('ru-RU') + ' сум';
  }
  return '0 сум';
}

function calculateTotalPrice(data) {
  if (!data) return '0 сум';
  if (!Array.isArray(data)) data = [data];
  const total = data.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : parseInt((item.price || '0').replace(/\D/g, '')) || 0;
    const quantity = item.quantity || 1;
    return sum + price * quantity;
  }, 0);
  return total.toLocaleString('ru-RU') + ' сум';
}

function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  counters.forEach(counter => {
    const input = counter.querySelector('.count');
    const decreaseBtn = counter.querySelector('.decrease');
    const increaseBtn = counter.querySelector('.increase');
    const MIN = 1;

    decreaseBtn.addEventListener('click', () => {
      let val = Number(input.value);
      if (val > MIN) input.value = val - 1;
      updateCartItemQuantity(input);
    });

    increaseBtn.addEventListener('click', () => {
      input.value = Number(input.value) + 1;
      updateCartItemQuantity(input);
    });

    input.addEventListener('input', () => {
      if (isNaN(input.value) || Number(input.value) < MIN) input.value = MIN;
      updateCartItemQuantity(input);
    });

    input.addEventListener('change', () => {
      if (input.value === '' || Number(input.value) < MIN) input.value = MIN;
      updateCartItemQuantity(input);
    });
  });
}

function updateCartItemQuantity(input) {
  const productElement = input.closest('.product');
  const productId = productElement.querySelector('.delete-btn').dataset.id;
  const newQuantity = parseInt(input.value);

  let cartData = JSON.parse(localStorage.getItem('korzina')) || [];

  if (Array.isArray(cartData)) {
    const idx = cartData.findIndex(item => item.id === productId);
    if (idx !== -1) cartData[idx].quantity = newQuantity;
  } else if (cartData.id === productId) {
    cartData.quantity = newQuantity;
  }

  localStorage.setItem('korzina', JSON.stringify(cartData));

  const totalEl = document.querySelector('.final-product__price');
  if (totalEl) totalEl.textContent = calculateTotalPrice(cartData);
}

function initDeleteButtons() {
  const deleteButtons = document.querySelectorAll('.delete-btn');

  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;
      const productElement = button.closest('.product');

      let cartData = JSON.parse(localStorage.getItem('korzina')) || [];
      if (Array.isArray(cartData)) {
        cartData = cartData.filter(item => item.id !== productId);
      } else if (cartData.id === productId) {
        cartData = null;
      }

      localStorage.setItem('korzina', JSON.stringify(cartData));
      productElement.remove();

      const totalEl = document.querySelector('.final-product__price');
      if (totalEl) totalEl.textContent = calculateTotalPrice(cartData);

      const productsContainer = document.querySelector('.products');
      if (!productsContainer || productsContainer.children.length === 0) {
        const korzinaEl = document.getElementById("korzina");
        korzinaEl.innerHTML = `
          <div class="not-full-cart">
            <div class="cat-content">
              <div class="cat-img">
                <img src="./public/icons/img/shopocat1.png" alt="Корзина пуста">
              </div>
              <div class="cat-text">
                <h2>В корзине пока нет товаров</h2>
                <h5>Начните с подборок на главной странице или найдите нужный товар через поиск</h5>
              </div>
            </div>
          </div>
        `;
      }
    });
  });
}
