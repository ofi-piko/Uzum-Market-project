async function getAllProducts() {
    const container = document.getElementById('product');

    container.innerHTML = '<div class="loading">Загрузка товаров...</div>';

    try {
        const res = await fetch(
            `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/main/products`
        );

        if (!res.ok) {
            throw new Error(`Ошибка сервера: ${res.status}`);
        }

        const data = await res.json();
        renderProducts(data);
    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div class="error">
                <h3>Ошибка загрузки</h3>
                <p>${error.message} или сервер не запущен</p>
                <button id="retry">Попробовать снова</button>
            </div>
        `;

        document.getElementById('retry')
            .addEventListener('click', getAllProducts);
    }
}

function renderProducts(products) {
    const container = document.getElementById('product');
    const productsArray = Array.isArray(products) ? products : [];

    if (!productsArray.length) {
        container.innerHTML = `
            <div class="empty">
                Товары не найдены. Иди пока на <a href="https://uzum.uz">uzum</a>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="products-header">
            <h1>Популярное</h1>
        </div>

        <div class="products-grid">
            ${productsArray.map(product => `
                <div class="product-card">
                    <div class="product-image-container">
                        ${product.media?.[0]
            ? `<img src="${product.media[0]}" class="product-image">`
            : `<div class="no-image">Нет изображения</div>`
        }

                        <button 
                            class="product-wishlist-btn"
                            data-id="${product.id}"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </button>
                    </div>

                    <div class="product-content">
                        <h3 class="product-title">
                            ${escapeHTML(product.title || product.name || 'Без названия')}
                        </h3>

                        <p class="product-price">
                            ${product.price
            ? `${product.price.toLocaleString('uz-UZ')} сум`
            : 'Цена не указана'}
                        </p>

                        <button class="product-cart-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/* Делегирование кликов */
document.addEventListener('click', (e) => {
    const wishlistBtn = e.target.closest('.product-wishlist-btn');
    if (!wishlistBtn) return;

    wishlistBtn.classList.toggle('active');
    console.log('wishlist:', wishlistBtn.dataset.id);
});

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', getAllProducts);
