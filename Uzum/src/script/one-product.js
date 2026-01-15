const BACKEND_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function() {
    loadProduct();
});

async function loadProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        showProductError('Товар не найден');
        return;
    }
    
    try {
        const product = await getProductById(productId);
        if (product) {
            renderProduct(product);
        } else {
            showProductError('Товар не найден');
        }
    } catch (error) {
        console.error('Ошибка загрузки товара:', error);
        showProductError('Ошибка загрузки товара');
    }
}

async function getProductById(productId) {
    const cachedProduct = JSON.parse(localStorage.getItem('selectedProduct'));
    
    if (cachedProduct && cachedProduct._index === productId) {
        return cachedProduct;
    }
    
    try {
        const res = await fetch(`${BACKEND_URL}/api/v1/main/products`);
        const products = await res.json();
        const allProducts = Array.isArray(products) ? products : products.products || [];
        
        const product = allProducts.find(p => 
            p.id === productId || 
            p._index === productId || 
            (p.id && p.id.toString() === productId)
        );
        
        if (product) {
            const productWithIndex = {
                ...product,
                _index: productId,
                _selectedAt: new Date().toISOString()
            };
            localStorage.setItem('selectedProduct', JSON.stringify(productWithIndex));
            return productWithIndex;
        }
    } catch (error) {
        console.error('Ошибка загрузки с сервера:', error);
    }
    
    return null;
}

function showProductError(message) {
    const container = document.getElementById('oneProduct');
    container.innerHTML = `
        <div class="product-error">
            <h3>${message}</h3>
            <button onclick="window.location.href='index.html'" class="back-to-home-btn">
                На главную
            </button>
        </div>
    `;
}

function renderProduct(product) {
    const container = document.getElementById('oneProduct');
    const inStock = product.inStock !== false;
    
    const categories = {
        'pc': 'Компьютеры и ноутбуки',
        'kitchen': 'Кухонная техника',
        'TV': 'Телевизоры',
        'audio': 'Аудиотехника',
        'furniture': 'Мебель'
    };
    
    const categoryName = categories[product.type] || product.type || 'Не указано';
    const isFavorite = checkFavorite(product._index || product.id);
    const isInCart = checkCart(product._index || product.id);
    
    container.innerHTML = `
        <div class="one-product-container">
            <div class="product-back-section">
                <button class="product-back-btn" onclick="window.history.back()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
                    </svg>
                    Назад к товарам
                </button>
            </div>
            
            <div class="one-product-main">
                <div class="one-product-images">
                    ${product.media && product.media.length > 0 ? `
                        <div class="one-product-main-image">
                            <img src="${product.media[0]}" alt="${product.title || product.name || ''}" id="oneProductMainImage">
                        </div>
                        ${product.media.length > 1 ? `
                            <div class="one-product-thumbnails">
                                ${product.media.map((img, idx) => `
                                    <div class="one-product-thumbnail ${idx === 0 ? 'active' : ''}" 
                                         onclick="changeOneProductImage(${idx})">
                                        <img src="${img}" alt="Изображение ${idx + 1}">
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    ` : `
                        <div class="one-product-no-image">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="#bdc3c7">
                                <path d="M21,19V5C21,3.9 20.1,3 19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19M8.5,13.5L11,16.5L14.5,12L19,18H5L8.5,13.5Z"/>
                            </svg>
                            <p>Нет изображения</p>
                        </div>
                    `}
                </div>
                
                <div class="one-product-info">
                    <div class="one-product-status ${inStock ? 'in-stock' : 'out-of-stock'}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            ${inStock ? 
                                '<path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>' :
                                '<path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>'
                            }
                        </svg>
                        ${inStock ? 'В наличии' : 'Нет в наличии'}
                    </div>
                    
                    <h1 class="one-product-title">${escapeHtml(product.title || product.name || 'Без названия')}</h1>
                    
                    ${product.rating ? `
                        <div class="one-product-rating">
                            <div class="one-product-stars">
                                ${'★'.repeat(Math.floor(product.rating))}
                                ${product.rating % 1 >= 0.5 ? '⭐' : '☆'}
                                ${'☆'.repeat(4 - Math.floor(product.rating))}
                            </div>
                            <span class="one-product-rating-value">${product.rating.toFixed(1)}/5</span>
                        </div>
                    ` : ''}
                    
                    <div class="one-product-prices">
                        <div class="one-product-current-price">
                            ${product.price ? product.price.toLocaleString('uz-UZ') + ' сум' : 'Цена не указана'}
                        </div>
                        ${product.oldPrice && product.oldPrice > product.price ? `
                            <div class="one-product-old-price">
                                ${product.oldPrice.toLocaleString('uz-UZ')} сум
                            </div>
                        ` : ''}
                    </div>
                    
                    ${product.description || product.desc ? `
                        <div class="one-product-description">
                            <h3>Описание</h3>
                            <p>${escapeHtml(product.description || product.desc)}</p>
                        </div>
                    ` : ''}
                    
                    <div class="one-product-specs">
                        <h3>Характеристики</h3>
                        <div class="one-product-specs-grid">
                            ${product.type ? `
                                <div class="one-product-spec">
                                    <span class="one-product-spec-label">Категория:</span>
                                    <span class="one-product-spec-value">${escapeHtml(categoryName)}</span>
                                </div>
                            ` : ''}
                            
                            ${product.brand ? `
                                <div class="one-product-spec">
                                    <span class="one-product-spec-label">Бренд:</span>
                                    <span class="one-product-spec-value">${escapeHtml(product.brand)}</span>
                                </div>
                            ` : ''}
                            
                            ${product.color ? `
                                <div class="one-product-spec">
                                    <span class="one-product-spec-label">Цвет:</span>
                                    <span class="one-product-spec-value">${escapeHtml(product.color)}</span>
                                </div>
                            ` : ''}
                            
                            ${product.size ? `
                                <div class="one-product-spec">
                                    <span class="one-product-spec-label">Размер:</span>
                                    <span class="one-product-spec-value">${escapeHtml(product.size)}</span>
                                </div>
                            ` : ''}
                            
                            ${product.material ? `
                                <div class="one-product-spec">
                                    <span class="one-product-spec-label">Материал:</span>
                                    <span class="one-product-spec-value">${escapeHtml(product.material)}</span>
                                </div>
                            ` : ''}
                            
                            ${product.weight ? `
                                <div class="one-product-spec">
                                    <span class="one-product-spec-label">Вес:</span>
                                    <span class="one-product-spec-value">${product.weight} кг</span>
                                </div>
                            ` : ''}
                            
                            ${product.country ? `
                                <div class="one-product-spec">
                                    <span class="one-product-spec-label">Страна:</span>
                                    <span class="one-product-spec-value">${escapeHtml(product.country)}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="one-product-actions">
                        <button class="one-product-cart-btn ${isInCart ? 'in-cart' : ''}" onclick="addToCartOneProduct()" id="oneProductCartBtn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z"/>
                            </svg>
                            ${isInCart ? 'В корзине' : 'Добавить в корзину'}
                        </button>
                        
                        <button class="one-product-fav-btn ${isFavorite ? 'favorited' : ''}" onclick="toggleFavoriteOneProduct()" id="oneProductFavBtn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.currentProduct = product;
    updateFavoriteButton();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

function changeOneProductImage(index) {
    const product = window.currentProduct;
    if (!product || !product.media || !product.media[index]) return;
    
    const mainImage = document.getElementById('oneProductMainImage');
    if (mainImage) {
        mainImage.src = product.media[index];
        mainImage.alt = `${product.title || product.name || ''} - изображение ${index + 1}`;
    }
    
    document.querySelectorAll('.one-product-thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    document.querySelectorAll('.one-product-thumbnail')[index].classList.add('active');
}

function checkFavorite(productId) {
    const favorites = JSON.parse(localStorage.getItem('favorite') || '{}');
    return !!favorites[productId];
}

function checkCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    return !!cart[productId];
}

function addToCartOneProduct() {
    const product = window.currentProduct;
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('cart') || '{}');
    const productKey = product._index || product.id;
    const cartBtn = document.getElementById('oneProductCartBtn');
    
    if (cart[productKey]) {
        cart[productKey].quantity = (cart[productKey].quantity || 1) + 1;
        showOneProductNotification(`Добавлено еще один (${cart[productKey].quantity} в корзине)`);
    } else {
        cart[productKey] = {
            ...product,
            quantity: 1,
            addedAt: new Date().toISOString()
        };
        cartBtn.classList.add('in-cart');
        cartBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z"/>
            </svg>
            В корзине`;
        showOneProductNotification('Товар добавлен в корзину');
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
}

function toggleFavoriteOneProduct() {
    const product = window.currentProduct;
    if (!product) return;
    
    let favorites = JSON.parse(localStorage.getItem('favorite') || '{}');
    const productKey = product._index || product.id;
    const favBtn = document.getElementById('oneProductFavBtn');
    
    if (favorites[productKey]) {
        delete favorites[productKey];
        favBtn.classList.remove('favorited');
        favBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
            </svg>`;
        showOneProductNotification('Удалено из избранного');
    } else {
        favorites[productKey] = {
            ...product,
            addedAt: new Date().toISOString()
        };
        favBtn.classList.add('favorited');
        favBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff4757">
                <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
            </svg>`;
        showOneProductNotification('Добавлено в избранное');
    }
    
    localStorage.setItem('favorite', JSON.stringify(favorites));
}

function updateFavoriteButton() {
    const product = window.currentProduct;
    if (!product) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorite') || '{}');
    const productKey = product._index || product.id;
    const favBtn = document.getElementById('oneProductFavBtn');
    
    if (favBtn) {
        if (favorites[productKey]) {
            favBtn.classList.add('favorited');
            favBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff4757">
                    <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
                </svg>`;
        } else {
            favBtn.classList.remove('favorited');
            favBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
                </svg>`;
        }
    }
}

function showOneProductNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'one-product-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #7000ff;
        color: white;
        padding: 16px 28px;
        border-radius: 10px;
        z-index: 99999;
        box-shadow: 0 8px 25px rgba(112, 0, 255, 0.3);
        font-weight: 500;
        font-size: 16px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

window.handleProductClickFromSearch = function(product) {
    if (!product) return;
    
    const productData = {
        ...product,
        _index: product.id || Math.random().toString(36).substr(2, 9),
        _selectedAt: new Date().toISOString()
    };
    
    localStorage.setItem('selectedProduct', JSON.stringify(productData));
    
    window.location.href = `one-product.html?id=${productData._index}`;
};