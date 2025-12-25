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
        console.log('Полученные данные:', data);
        
        renderProducts(data);
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        container.innerHTML = `
            <div class="error">
                <h3>Ошибка загрузки</h3>
                <p>${error.message} или сервер не был запущен</p>
                <button onclick="getAllProducts()">Попробовать снова</button>
            </div>
        `;
    }
}

function renderProducts(products) {
    const container = document.getElementById('product');
    
    const productsArray = Array.isArray(products) ? products : [];
    
    if (productsArray.length === 0) {
        container.innerHTML = '<div class="empty">Товары не найдены и идине в настоящий <a href="uzum.uz">uzum</a></div>';
        return;
    }
    
    container.innerHTML = `
        <div class="products-header">
            <h1>Популярное</h1>
        </div>
        
        <div class="products-grid">
            ${productsArray.map(product => `
                <div class="product-card">
                    ${product.salePercentage ? `
                        <div class="product-sale-badge">
                            Скидка ${product.salePercentage}%
                        </div>
                    ` : ''}
                    
                    <div class="product-image-container">
                        ${product.media && product.media.length > 0 ? `
                            <img src="${product.media[0]}" 
                                 alt="${product.title || product.name || 'Товар'}" 
                                 class="product-image"
                                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjJGNUY3Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTAwIDgwLjU2MjkgOTEuNTYyOSA4OSA4MSA4OUM3MC40MzcxIDg5IDYyIDgwLjU2MjkgNjIgNzBDNjIgNTkuNDM3MSA3MC40MzcxIDUxIDgxIDUxQzkxLjU2MjkgNTEgMTAwIDU5LjQzNzEgMTAwIDcwWiIgZmlsbD0iI0Q4RDlEQiIvPgo8cGF0aCBkPSJNMjQ0Ljg3NyAxMTQuODc3QzI0NC44NzcgMTIxLjQxOCAyMzkuNDE4IDEyNi44NzcgMjMyLjg3NyAxMjYuODc3QzIyNi4zMzYgMTI2Ljg3NyAyMjAuODc3IDEyMS40MTggMjIwLjg3NyAxMTQuODc3QzIyMC44NzcgMTA4LjMzNiAyMjYuMzM2IDEwMi44NzcgMjMyLjg3NyAxMDIuODc3QzIzOS40MTggMTAyLjg3NyAyNDQuODc3IDEwOC4zMzYgMjQ0Ljg3NyAxMTQuODc3WiIgZmlsbD0iI0Q4RDlEQiIvPgo8cGF0aCBkPSJNMTYwIDUyTDE3OC41IDEwMC41TDIxNSA3OEwyNDcuNSAxMDUuNUwyNzAuNSA1MkwxNDUgMTM3LjVMMTQwLjUgMTI4TDE2MCA1MloiIGZpbGw9IiNEOEQ5REIiLz4KPC9zdmc+'">
                        ` : `
                            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #000000ff;">
                                Изображение отсутствует
                            </div>
                        `}
                        
                        <button class="product-wishlist-btn" onclick="toggleWishlist(${product.id || 'null'})">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="product-content">
                        <h3 class="product-title">
                            ${product.isBlackFriday ? '<span class="black-friday-badge">Black Friday</span>' : ''}
                            ${escapeHTML(product.title || product.name || 'Без названия')}
                        </h3>
                        
                        <div class="product-price-container">
                            <p class="product-price">
                                ${product.price ? `
                                    ${product.salePercentage ? `
                                        <span class="product-old-price">
                                            ${Math.round(product.price * 100 / (100 - product.salePercentage)).toLocaleString('ru-RU')} Сум
                                        </span>
                                    ` : ''}
                                    ${product.price.toLocaleString('uz-UZ')} Cум
                                ` : 'Цена не указана'}
                            </p>
                            
                            ${product.salePercentage ? `
                                <p class="product-discount">
                                    Экономия ${Math.round((product.price * product.salePercentage / (100 - product.salePercentage))).toLocaleString('ru-RU')} ₽
                                </p>
                            ` : ''}
                        </div>
                        
                        <div class="product-card-footer">
                            <button class="product-cart-btn" onclick="addToCart(${product.id || 'null'})">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function toggleWishlist(productId) {
    console.log('Добавить в избранное:', productId);
}

function addToCart(productId) {
    console.log('Добавить в корзину:', productId);
}

document.addEventListener('DOMContentLoaded', getAllProducts);