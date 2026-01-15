class FavoriteManager {
    constructor(productManager) {
        this.favoriteKey = 'favorite';
        this.productManager = productManager;
    }

    init() {
        const likedEl = document.getElementById("liked");
        if (likedEl) this.renderFavorites(likedEl);
    }

    getFavoriteData() {
        return JSON.parse(localStorage.getItem(this.favoriteKey)) || {};
    }

    hasFavorites(data) {
        return data && Object.keys(data).length > 0;
    }

    renderFavorites(container) {
        const favoriteData = this.getFavoriteData();

        if (!this.hasFavorites(favoriteData)) {
            this.renderEmptyFavorites(container);
            return;
        }

        const favoriteItems = Object.entries(favoriteData).map(([productId, itemData]) => ({
            productId,
            ...itemData
        }));

        const productsHTML = favoriteItems
            .map(item => this.renderFavoriteItem(item))
            .join('');

        container.innerHTML = `
            <div class="korzina-container">
                <div class="products-grid">
                    ${productsHTML}
                </div>
            </div>
        `;

        this.initFavoriteButtons();
        this.initAddToCartButtons();
    }

    renderFavoriteItem(item) {
        const cartData = JSON.parse(localStorage.getItem('cart')) || {};
        const isInCart = !!cartData[item.productId];
        const quantity = isInCart ? cartData[item.productId].quantity || 1 : 1;

        return `
            <div class="product-card">
                <div class="product-image-container">
                    ${item.image ? `<img src="${item.image}" class="product-image">` : `<div class="no-image">Нет изображения</div>`}
                    <button
                        class="product-wishlist-btn active"
                        data-index="${item.productId}">
                        <svg width="20" height="20" viewBox="0 0 24 24" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                    </button>
                </div>

                <div class="product-content">
                    <h3 class="product-title">${this.escapeHTML(item.title)}</h3>
                    
                    <div class="product-price-container">
                        <p class="product-old-price">
                            ${item.oldPrice ? item.oldPrice.toLocaleString('uz-UZ') + ' сум' : ''}
                        </p>
                        <p class="product-current-price">
                            ${item.price ? item.price.toLocaleString('uz-UZ') + ' сум' : 'Цена не указана'}
                        </p>
                    </div>

                    <div class="product-card-footer">
                        ${isInCart ? `
                            <div class="cart-quantity-control">
                                <button class="quantity-btn minus" data-index="${item.productId}">−</button>
                                <span class="quantity-value">${quantity}</span>
                                <button class="quantity-btn plus" data-index="${item.productId}">+</button>
                            </div>
                        ` : `
                            <button class="product-cart-btn" data-index="${item.productId}">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff" version="1.1"
                                    id="Capa_1" width="20px" height="auto" viewBox="0 0 902.86 902.86" xml:space="preserve">
                                    <g>
                                        <g>
                                            <path
                                                d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z     M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z" />
                                            <path
                                                d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717    c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744    c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742    C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744    c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z     M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742    S619.162,694.432,619.162,716.897z" />
                                        </g>
                                    </g>
                                </svg>
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    }

    renderEmptyFavorites(container) {
        container.innerHTML = `
            <div class="not-full-cart">
            <img src="./public/icons/img/hearts.png">
                <h2>Здесь сохраним ваши любимые товары</h2>
                <p>Нажмите ♡ в товарах, которые обычно заказываете или хотите купить позже</p>
            </div>
        `;
    }

    initFavoriteButtons() {
        document.querySelectorAll('.product-wishlist-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const productId = e.currentTarget.dataset.index;
                this.removeFromFavorites(productId);
                this.renderFavorites(document.getElementById('liked'));
            };
        });
    }

    initAddToCartButtons() {
        document.querySelectorAll('.product-cart-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const productId = e.currentTarget.dataset.index;
                this.addToCart(productId);
                this.renderFavorites(document.getElementById('liked'));
            };
        });

        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const productId = e.currentTarget.dataset.index;
                this.updateCartQuantity(productId, 1);
                this.renderFavorites(document.getElementById('liked'));
            };
        });

        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const productId = e.currentTarget.dataset.index;
                this.updateCartQuantity(productId, -1);
                this.renderFavorites(document.getElementById('liked'));
            };
        });
    }

    removeFromFavorites(productId) {
        const favoriteData = this.getFavoriteData();
        delete favoriteData[productId];
        localStorage.setItem(this.favoriteKey, JSON.stringify(favoriteData));
    }

    addToCart(productId) {
        const favoriteData = this.getFavoriteData();
        const product = favoriteData[productId];
        if (!product) return;

        const cartData = JSON.parse(localStorage.getItem('cart')) || {};
        cartData[productId] = { ...product, quantity: 1 };
        localStorage.setItem('cart', JSON.stringify(cartData));
    }

    updateCartQuantity(productId, change) {
        const cartData = JSON.parse(localStorage.getItem('cart')) || {};
        if (cartData[productId]) {
            cartData[productId].quantity = (cartData[productId].quantity || 1) + change;
            if (cartData[productId].quantity <= 0) {
                delete cartData[productId];
            }
            localStorage.setItem('cart', JSON.stringify(cartData));
        }
    }

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str || '';
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('liked')) {
        new FavoriteManager().init();
    }

    if (document.getElementById('korzina')) {
        new CartManager().init();
    }
});
