document.addEventListener('DOMContentLoaded', () => {
    const likedEl = document.getElementById("liked");

    if (!likedEl) return;

    let rfr = localStorage.getItem('product');
    let likedData;

    try {
        likedData = JSON.parse(rfr);
    } catch {
        likedData = null;
    }

    const hasProducts = (data) => {
        if (!data) return false;
        if (Array.isArray(data)) return data.length > 0 && data.some(item => item && item.name);
        return !!data.name;
    };

    if (hasProducts(likedData)) {
        let productsHTML = '';

        if (Array.isArray(likedData)) {
            productsHTML = likedData.map(item => `
        <div class="liked-product">
          <div class="liked-product-img">
            <img src="${item.image || 'https://i.pinimg.com/1200x/87/ea/ac/87eaac4f32f29defe44bf3d8de752903.jpg'}" alt="${item.name}">
          </div>
          <div class="liked-product-info">
            <div class="liked-product-name">${item.name || 'Товар без названия'}</div>
            <div class="liked-product-price">${formatPrice(item.price)}</div>
            <div class="liked-product-actions">
              <button type="button" class="liked-cart-btn" data-id="${item.id || ''}" title="Добавить в корзину">
                <img src="https://cdn-icons-png.flaticon.com/512/34/34568.png" alt="Корзина">
              </button>
              <button type="button" class="liked-delete-btn" data-id="${item.id || ''}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `).join('');
        } else {
            const item = likedData;
            productsHTML = `
        <div class="liked-product">
          <div class="liked-product-img">
            <img src="${item.image || 'https://i.pinimg.com/1200x/87/ea/ac/87eaac4f32f29defe44bf3d8de752903.jpg'}" alt="${item.name}">
          </div>
          <div class="liked-product-info">
            <div class="liked-product-name">${item.name || 'Товар без названия'}</div>
            <div class="liked-product-price">${formatPrice(item.price)}</div>
            <div class="liked-product-actions">
              <button type="button" class="liked-cart-btn" data-id="${item.id || ''}" title="Добавить в корзину">
                <img src="https://cdn-icons-png.flaticon.com/512/34/34568.png" alt="Корзина">
              </button>
              <button type="button" class="liked-delete-btn" data-id="${item.id || ''}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
        }

        likedEl.innerHTML = `
      <div class="liked-container">
        <div class="liked-header">
          <h1>Избранное</h1>
          <div class="liked-count">${Array.isArray(likedData) ? likedData.length : 1} товар${Array.isArray(likedData) && likedData.length !== 1 ? 'а' : ''}</div>
        </div>
        <div class="liked-products-grid">
          ${productsHTML}
        </div>
      </div>
    `;

        initDeleteButtons();
        initCartButtons();
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

function initDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.liked-delete-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.id;
            const productElement = button.closest('.liked-product');

            let likedData = JSON.parse(localStorage.getItem('liked')) || [];
            if (Array.isArray(likedData)) {
                likedData = likedData.filter(item => item.id !== productId);
            } else if (likedData.id === productId) {
                likedData = null;
            }

            localStorage.setItem('liked', JSON.stringify(likedData));
            productElement.remove();

            const productsContainer = document.querySelector('.liked-products-grid');
            if (!productsContainer || productsContainer.children.length === 0) {
                const likedEl = document.getElementById("liked");
                likedEl.innerHTML = `
      
            <div class="not-full-cart">
                <div class="cat-content">
                    <div class="cat-img">
                        <img src="./public/icons/img/hearts.png" alt="">
                    </div>
                    <div class="cat-text">
                        <h2>Здесь сохраним ваши любимые товары</h2>
                        <h5>Нажмите ♡ в товарах, которые обычно заказываете или хотите купить позже

                        </h5>
                    </div>
                </div>
            </div>
        </div>
    `;
            } else {
                const likedCountEl = document.querySelector('.liked-count');
                if (likedCountEl) {
                    likedCountEl.textContent = `${Array.isArray(likedData) ? likedData.length : (likedData ? 1 : 0)} товар${Array.isArray(likedData) && likedData.length !== 1 ? 'а' : ''}`;
                }
            }
        });
    });
}

function initCartButtons() {
    const cartButtons = document.querySelectorAll('.liked-cart-btn');

    cartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.id;
            const productElement = button.closest('.liked-product');
            const productName = productElement.querySelector('.liked-product-name').textContent;
            const productPrice = productElement.querySelector('.liked-product-price').textContent;
            const productImage = productElement.querySelector('.liked-product-img img').src;

            let likedData = JSON.parse(localStorage.getItem('liked')) || [];
            let productData;

            if (Array.isArray(likedData)) {
                productData = likedData.find(item => item.id === productId);
            } else if (likedData.id === productId) {
                productData = likedData;
            }

            let cartData = JSON.parse(localStorage.getItem('korzina')) || [];

            if (productData) {
                const existingItemIndex = cartData.findIndex(item => item.id === productId);

                if (existingItemIndex === -1) {
                    cartData.push({
                        ...productData,
                        quantity: 1
                    });

                    const img = button.querySelector('img');
                    const originalSrc = img.src;
                    img.src = 'https://cdn-icons-png.flaticon.com/512/34/34568.png';
                    button.style.backgroundColor = '#4CAF50';

                    setTimeout(() => {
                        img.src = originalSrc;
                        button.style.backgroundColor = '';
                    }, 1000);
                } else {
                    cartData[existingItemIndex].quantity += 1;

                    const img = button.querySelector('img');
                    const originalSrc = img.src;
                    img.src = 'https://cdn-icons-png.flaticon.com/512/34/34568.png';
                    button.style.backgroundColor = '#2196F3';

                    setTimeout(() => {
                        img.src = originalSrc;
                        button.style.backgroundColor = '';
                    }, 1000);
                }

                localStorage.setItem('korzina', JSON.stringify(cartData));
            }
        });
    });
}