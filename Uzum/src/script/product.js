const ProductManager = (function() {
    'use strict';
    
    const config = {
        backendUrl: import.meta.env.VITE_BACKEND_BASE_URL,
        categories: {
            'pc': 'Компьютеры и ноутбуки',
            'kitchen': 'Кухонная техника',
            'TV': 'Телевизоры',
            'audio': 'Аудиотехника',
            'furniture': 'Мебель'
        }
    };
    
    let products = [];
    let initialized = false;
    
    const utils = {
        escapeHTML: function(str) {
            const div = document.createElement('div');
            div.textContent = str || '';
            return div.innerHTML;
        }
    };
    
    const storage = {
        get: function(key, defaultValue = {}) {
            try {
                return JSON.parse(localStorage.getItem(key)) || defaultValue;
            } catch {
                return defaultValue;
            }
        },
        
        set: function(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    };
    
    const renderer = {
        productCard: function(p, idx, favoriteObj, cartObj) {
            const isInCart = cartObj[idx];
            const quantity = isInCart ? cartObj[idx].quantity || 1 : 1;
    
            return `
                <div class="product-card" data-product-index="${idx}">
                    <div class="product-image-container">
                        ${p.media?.[0] ? `<img src="${p.media[0]}" class="product-image">` : `<div class="no-image">Нет изображения</div>`}
                        <button
                            class="product-wishlist-btn ${favoriteObj[idx] ? 'active' : ''}"
                            data-index="${idx}">
                            <svg width="20" height="20" viewBox="0 0 24 24" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </button>
                    </div>
    
                    <div class="product-content">
                        <h3 class="product-title">${utils.escapeHTML(p.title || p.name || 'Без названия')}</h3>
                        
                        <div class="product-price-container">
                            <p class="product-old-price" style="
                                color: #95a5a6;
                                text-decoration: line-through;
                                font-weight: 400;
                                margin-top: 5px;
                                display: block;
                                width: 100%;
                                padding: 0 0 0 15px;">
                                ${p.oldPrice ? p.oldPrice.toLocaleString('uz-UZ') + ' сум' : ''}
                            </p>
                            <p class="product-current-price">
                                ${p.price ? p.price.toLocaleString('uz-UZ') + ' сум' : 'Цена не указана'}
                            </p>
                        </div>
    
                        <div class="product-card-footer">
                            ${isInCart ? `
                                <div class="cart-quantity-control">
                                    <button class="quantity-btn minus" data-index="${idx}">−</button>
                                    <span class="quantity-value">${quantity}</span>
                                    <button class="quantity-btn plus" data-index="${idx}">+</button>
                                </div>
                            ` : `
                                <button class="product-cart-btn" data-index="${idx}">
                                    <img src="./public/icons/logo/cart.png" alt="Добавить в корзину" class="cart-icon">
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            `;
        },
        
        mainSection: function(products) {
            const favoriteObj = storage.get('favorite');
            const cartObj = storage.get('cart');
    
            const firstRow = products.slice(0, 5);
            const secondRow = products.slice(5, 10);
    
            return `
                <div class="products-header">
                    <h1>популярные товары</h1>
                </div>
                
                <div class="products-grid" id="top-products-first">
                    ${firstRow.map((p, idx) => this.productCard(p, idx, favoriteObj, cartObj)).join('')}
                </div>
                
                <div class="products-grid" id="top-products-second" style="display: none;">
                    ${secondRow.map((p, idx) => this.productCard(p, idx + 5, favoriteObj, cartObj)).join('')}
                </div>
                
                <div class="show-more-container" style="text-align: center; margin: 30px 0;">
                    <button id="show-more-top" class="show-more-btn">Показать еще 5 товаров</button>
                </div>
            `;
        },
        
        categorySection: function(categoryKey, categoryName, categoryProducts) {
            if (categoryProducts.length === 0) return '';
            
            const favoriteObj = storage.get('favorite');
            const cartObj = storage.get('cart');
            
            return `
                <div class="section" data-category="${categoryKey}">
                    <div class="products-header">
                        <h1>${categoryName}</h1>
                        <button class="view-all-btn" data-category="${categoryKey}">Смотреть все</button>
                    </div>
                    
                    <div class="products-grid">
                        ${categoryProducts.map((p, idx) => this.productCard(p, `${categoryKey}_${idx}`, favoriteObj, cartObj)).join('')}
                    </div>
                </div>
            `;
        },
        
        categoryPage: function(categoryName, categoryProducts) {
            const favoriteObj = storage.get('favorite');
            const cartObj = storage.get('cart');
            
            const sortedProducts = categoryProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            
            return `
                <div style="margin-bottom: 20px;">
                    <button id="back-to-main" style="background: #7000ff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">← Назад</button>
                </div>
                
                <div class="products-header">
                    <h1>${categoryName} (отсортировано по рейтингу)</h1>
                </div>
                
                <div class="products-grid">
                    ${sortedProducts.map((p, idx) => this.productCard(p, `${categoryName}_all_${idx}`, favoriteObj, cartObj)).join('')}
                </div>
            `;
        }
    };
    
    const manager = {
        getAllProducts: async function() {
            const container = document.getElementById('product');
            container.innerHTML = '<div class="loading">Загрузка товаров из сервера</div>';
    
            try {
                const res = await fetch(`${config.backendUrl}/api/v1/main/products`);
                if (!res.ok) throw new Error(res.status);
                const data = await res.json();
                products = Array.isArray(data) ? data : [];
                
                this.renderMainContent();
                this.setupEventListeners();
                initialized = true;
            } catch (e) {
                container.innerHTML = `<div class="error"><button id="retry">дать 2 шанс сайту</button></div>`;
                document.getElementById('retry').onclick = () => this.getAllProducts();
            }
        },
        
        renderMainContent: function() {
            const container = document.getElementById('product');
            container.innerHTML = '';
            
            const sortedProducts = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
            const topProducts = sortedProducts.slice(0, 10);
            
            container.innerHTML = renderer.mainSection(topProducts);
            
            Object.entries(config.categories).forEach(([categoryKey, categoryName]) => {
                const categoryProducts = products
                    .filter(p => p.type?.toLowerCase() === categoryKey.toLowerCase())
                    .slice(0, 5);
                
                if (categoryProducts.length > 0) {
                    container.insertAdjacentHTML('beforeend', 
                        renderer.categorySection(categoryKey, categoryName, categoryProducts));
                }
            });
            
            this.setupShowMoreButtons();
        },
        
        renderCategoryPage: function(categoryName, categoryProducts) {
            const container = document.getElementById('product');
            const title = config.categories[categoryName] || categoryName;
            
            container.innerHTML = renderer.categoryPage(title, categoryProducts);
            
            document.getElementById('back-to-main').onclick = () => {
                this.renderMainContent();
                this.setupEventListeners();
            };
        },
        
        pickProduct: function(idx) {
            const isCategoryIdx = idx.includes('_');
    
            let product;
    
            if (isCategoryIdx) {
                const parts = idx.split('_');
                const category = parts[0];
                const index = parseInt(parts[parts.length - 1]);
                const categoryProducts = products.filter(
                    p => p.type?.toLowerCase() === category.toLowerCase()
                );
                product = categoryProducts[index];
            } else {
                product = products[parseInt(idx)];
            }
    
            if (!product) {
                return null;
            }
    
            return {
                ...product,
                _index: idx,
                _selectedAt: new Date().toISOString()
            };
        },
        
        handleProductClick: function(product) {
            if (!product) return;
            
            localStorage.setItem('selectedProduct', JSON.stringify(product));
            
            window.location.href = `one-product.html?id=${product._index}`;
        },
        
        setupShowMoreButtons: function() {
            const showMoreBtn = document.getElementById('show-more-top');
            if (showMoreBtn) {
                showMoreBtn.onclick = function() {
                    const secondRow = document.getElementById('top-products-second');
                    
                    if (secondRow.style.display === 'none') {
                        secondRow.style.display = 'grid';
                        this.textContent = 'Скрыть';
                    } else {
                        secondRow.style.display = 'none';
                        this.textContent = 'Показать еще 5 товаров';
                    }
                };
            }
        },
        
        setupEventListeners: function() {
            this.setupShowMoreButtons();
            
            document.querySelectorAll('.view-all-btn').forEach(btn => {
                btn.onclick = (e) => {
                    const category = e.target.dataset.category;
                    const categoryProducts = products.filter(p => 
                        p.type?.toLowerCase() === category.toLowerCase()
                    );
                    this.renderCategoryPage(category, categoryProducts);
                    this.setupProductCardListeners();
                };
            });
            
            this.setupProductCardListeners();
        },
        
        setupProductCardListeners: function() {
            document.querySelectorAll('.product-card').forEach(card => {
                card.onclick = (e) => {
                    if (e.target.closest('.product-wishlist-btn') || 
                        e.target.closest('.product-cart-btn') ||
                        e.target.closest('.quantity-btn')) {
                        return;
                    }
                    
                    const idx = card.getAttribute('data-product-index');
                    
                    if (idx) {
                        const product = this.pickProduct(idx);
                        if (product) {
                            this.handleProductClick(product);
                        }
                    }
                };
                
                card.style.cursor = 'pointer';
            });
            
            document.querySelectorAll('.product-wishlist-btn').forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const idx = e.currentTarget.dataset.index;
                    const product = this.pickProduct(idx);
                    
                    const favoriteObj = storage.get('favorite');
                    if (favoriteObj[idx]) {
                        delete favoriteObj[idx];
                        e.currentTarget.classList.remove('active');
                    } else {
                        favoriteObj[idx] = product;
                        e.currentTarget.classList.add('active');
                    }
                    storage.set('favorite', favoriteObj);
                };
            });
            
            document.querySelectorAll('.product-cart-btn').forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const idx = e.currentTarget.dataset.index;
                    const product = this.pickProduct(idx);
                    
                    const cartObj = storage.get('cart');
                    cartObj[idx] = {
                        ...product,
                        quantity: 1  // ИСПРАВЛЕНО: устанавливаем начальное количество 1
                    };
                    storage.set('cart', cartObj);
                    
                    this.renderMainContent();
                    this.setupEventListeners();
                };
            });
            
            document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const idx = e.currentTarget.dataset.index;
                    
                    const cartObj = storage.get('cart');
                    if (cartObj[idx]) {
                        cartObj[idx].quantity = (cartObj[idx].quantity || 1) + 1;
                        storage.set('cart', cartObj);
                        this.renderMainContent();
                        this.setupEventListeners();
                    }
                };
            });
            
            document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const idx = e.currentTarget.dataset.index;
                    
                    const cartObj = storage.get('cart');
                    if (cartObj[idx]) {
                        cartObj[idx].quantity = (cartObj[idx].quantity || 1) - 1;
                        
                        if (cartObj[idx].quantity <= 0) {
                            delete cartObj[idx];
                        }
                        
                        storage.set('cart', cartObj);
                        this.renderMainContent();
                        this.setupEventListeners();
                    }
                };
            });
        }
    };
    
    return {
        init: function() {
            if (!initialized) {
                manager.getAllProducts();
            }
        },
        
        getProducts: function() {
            return products;
        },
        
        getCategories: function() {
            return config.categories;
        },
        
        refresh: function() {
            manager.getAllProducts();
        }
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    ProductManager.init();
});