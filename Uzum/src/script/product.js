let PRODUCTS = [];

async function getAllProducts() {
    const container = document.getElementById('product');
    container.innerHTML = '<div class="loading">Загрузка товаров из сервера</div>';

    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/main/products`);
        if (!res.ok) throw new Error(res.status);
        const data = await res.json();
        PRODUCTS = Array.isArray(data) ? data : [];

        const sortedProducts = PRODUCTS.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        const topProducts = sortedProducts.slice(0, 10);

        renderMainSection(topProducts);
        renderCategorySections(PRODUCTS);
    } catch (e) {
        container.innerHTML = `<div class="error"><button id="retry">дать 2 шанс сайту</button></div>`;
        document.getElementById('retry').onclick = getAllProducts;
    }
}

function renderMainSection(products) {
    const container = document.getElementById('product');
    const favoriteObj = getObject('favorite');
    const cartObj = getObject('cart');

    const firstRow = products.slice(0, 5);
    const secondRow = products.slice(5, 10);

    container.innerHTML = `
        <div class="products-header">
            <h1>популярные товары</h1>
        </div>
        
        <div class="products-grid" id="top-products-first">
            ${firstRow.map((p, idx) => renderProductCard(p, idx, favoriteObj, cartObj)).join('')}
        </div>
        
        <div class="products-grid" id="top-products-second" style="display: none;">
            ${secondRow.map((p, idx) => renderProductCard(p, idx, favoriteObj, cartObj)).join('')}
        </div>
        
        <div class="show-more-container" style="text-align: center; margin: 30px 0;">
            <button id="show-more-top" class="show-more-btn">Показать еще 5 товаров</button>
        </div>
    `;

    document.getElementById('show-more-top').onclick = () => {
        const secondRow = document.getElementById('top-products-second');
        const btn = document.getElementById('show-more-top');

        if (secondRow.style.display === 'none') {
            secondRow.style.display = 'grid';
            btn.textContent = 'Скрыть';
        } else {
            secondRow.style.display = 'none';
            btn.textContent = 'Показать еще 5 товаров';
        }
    };
}

function renderCategorySections(allProducts) {
    const categories = {
        'pc': 'Компьютеры и ноутбуки',
        'kitchen': 'Кухонная техника',
        'TV': 'Телевизоры',
        'audio': 'Аудиотехника',
        'furniture': 'Мебель'
    };

    const container = document.getElementById('product');

    Object.entries(categories).forEach(([categoryKey, categoryName]) => {
        const categoryProducts = allProducts
            .filter(p => p.type?.toLowerCase() === categoryKey.toLowerCase())
            .slice(0, 5);

        if (categoryProducts.length > 0) {
            const favoriteObj = getObject('favorite');
            const cartObj = getObject('cart');

            const sectionHTML = `
                <div class="section" data-category="${categoryKey}">
                    <div class="products-header">
                        <h1>${categoryName}</h1>
                    </div>
                    
                    <div class="products-grid">
                        ${categoryProducts.map((p, idx) => renderProductCard(p, `${categoryKey}_${idx}`, favoriteObj, cartObj)).join('')}
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                    </div>
                </div>
            `;

            container.insertAdjacentHTML('beforeend', sectionHTML);
        }
    });

    renderSortedCategoryContainers(allProducts);

    document.querySelectorAll('.view-all-btn').forEach(btn => {
        btn.onclick = function () {
            const category = this.dataset.category;
            const categoryProducts = PRODUCTS.filter(p => p.type?.toLowerCase() === category.toLowerCase());
            renderCategoryPage(category, categoryProducts);
        };
    });
}

function renderSortedCategoryContainers(allProducts) {
    const categories = {
        'pc': 'Компьютеры и ноутбуки',
        'kitchen': 'Кухонная техника',
        'TV': 'Телевизоры',
        'audio': 'Аудиотехника',
        'furniture': 'Мебель'
    };

    Object.entries(categories).forEach(([categoryKey, categoryName]) => {
        const categoryProducts = allProducts
            .filter(p => p.type?.toLowerCase() === categoryKey.toLowerCase())
            .sort((a, b) => (b.rating || 0) - (a.rating || 0));

        if (categoryProducts.length > 0) {
            const containerId = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
            const container = document.getElementById(containerId);

            if (container) {
                const favoriteObj = getObject('favorite');
                const cartObj = getObject('cart');

                const firstRow = categoryProducts.slice(0, 5);
                const secondRow = categoryProducts.slice(5, 10);

                container.innerHTML = `
                    <div class="products-header">
                        <h1>${categoryName}</h1>
                    </div>
                    
                    <div class="products-grid" id="${categoryKey}-sorted-first">
                        ${firstRow.map((p, idx) => renderProductCard(p, `${categoryKey}_sorted_${idx}`, favoriteObj, cartObj)).join('')}
                    </div>
                    
                    <div class="products-grid" id="${categoryKey}-sorted-second" style="display: ${secondRow.length > 0 ? 'none' : 'grid'};">
                        ${secondRow.map((p, idx) => renderProductCard(p, `${categoryKey}_sorted_${idx + 5}`, favoriteObj, cartObj)).join('')}
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        ${secondRow.length > 0 ? `
                            <button class="show-more-sorted-btn" data-category="${categoryKey}">Показать еще 5 товаров</button>
                        ` : ''}
                    </div>
                `;

                const showMoreBtn = container.querySelector('.show-more-sorted-btn');
                if (showMoreBtn) {
                    showMoreBtn.onclick = function () {
                        const category = this.dataset.category;
                        const secondRow = document.getElementById(`${category}-sorted-second`);
                        const btn = this;

                        if (secondRow.style.display === 'none') {
                            secondRow.style.display = 'grid';
                            btn.textContent = 'Скрыть';
                        } else {
                            secondRow.style.display = 'none';
                            btn.textContent = 'Показать еще 5 товаров';
                        }
                    };
                }
            }
        }
    });
}

function renderCategoryPage(categoryName, products) {
    const container = document.getElementById('product');
    const categoryTitles = {
        'pc': 'Компьютеры и ноутбуки',
        'kitchen': 'Кухонная техника',
        'TV': 'Телевизоры',
        'audio': 'Аудиотехника',
        'furniture': 'Мебель'
    };

    const title = categoryTitles[categoryName] || categoryName;
    const favoriteObj = getObject('favorite');
    const cartObj = getObject('cart');

    const sortedProducts = products.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <button id="back-to-main" style="background: #7000ff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">← Назад</button>
        </div>
        
        <div class="products-header">
            <h1>${title} (отсортировано по рейтингу)</h1>
        </div>
        
        <div class="products-grid">
            ${sortedProducts.map((p, idx) => renderProductCard(p, `${categoryName}_all_${idx}`, favoriteObj, cartObj)).join('')}
        </div>
    `;

    document.getElementById('back-to-main').onclick = () => {
        const sortedProducts = PRODUCTS.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        const topProducts = sortedProducts.slice(0, 10);
        renderMainSection(topProducts);
        renderCategorySections(PRODUCTS);
    };
}

function renderProductCard(p, idx, favoriteObj, cartObj) {
    const isInCart = cartObj[idx];
    const quantity = isInCart ? cartObj[idx].quantity || 1 : 1;

    return `
        <div class="product-card">
            ${p.rating ? `
            ` : ''}
            
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
                <h3 class="product-title">${escapeHTML(p.title || p.name || 'Без названия')}</h3>
                
                <div class="product-price-container">
                <p class=".product-old-price" style="
    font-size: 16px;
    color: #95a5a6;
    text-decoration: line-through;
    font-weight: 400;
    margin-top: 5px;
    display: block;
    width: 100%;
    padding: 0 0 0 15px;">${p.price ? p.price.toLocaleString('uz-UZ') + ' сум' : 'Цена не указана'}</p>
                    <p class="product-current-price">${p.price ? p.price.toLocaleString('uz-UZ') + ' сум' : 'Цена не указана'}</p>
                </div>

                <div class="product-card-footer">
                    ${isInCart ? `
                        <div class="cart-quantity-control">
                            <button class="quantity-btn minus" data-index="${idx}">−</button>
                            <span class="quantity-value">${quantity}</span>
                            <button class="quantity-btn plus" data-index="${idx}">+</button>
                        </div>
                    ` : `
                        <button
                            class="product-cart-btn"
                            data-index="${idx}">
                            <img src="./public/icons/logo/cart.png" alt="Добавить в корзину" class="cart-icon">
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;
}

document.addEventListener('click', e => {
    const favBtn = e.target.closest('.product-wishlist-btn');
    const cartBtn = e.target.closest('.product-cart-btn');
    const plusBtn = e.target.closest('.quantity-btn.plus');
    const minusBtn = e.target.closest('.quantity-btn.minus');

    if (favBtn) {
        const idx = favBtn.dataset.index;
        const product = pickProduct(idx);
        toggleObject('favorite', idx, product);
        favBtn.classList.toggle('active');
    }

    if (cartBtn) {
        const idx = cartBtn.dataset.index;
        const product = pickProduct(idx);
        toggleObject('cart', idx, product);
        renderMainSection(PRODUCTS.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10));
        renderCategorySections(PRODUCTS);
    }

    if (plusBtn || minusBtn) {
        const idx = plusBtn ? plusBtn.dataset.index : minusBtn.dataset.index;
        const cartObj = getObject('cart');
        const product = cartObj[idx];

        if (product) {
            if (plusBtn) {
                product.quantity = (product.quantity || 1) + 1;
            } else if (minusBtn) {
                product.quantity = (product.quantity || 1) - 1;

                if (product.quantity <= 0) {
                    delete cartObj[idx];
                }
            }

            if (product.quantity > 0) {
                cartObj[idx] = product;
            }

            localStorage.setItem('cart', JSON.stringify(cartObj));
            renderMainSection(PRODUCTS.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10));
            renderCategorySections(PRODUCTS);
        }
    }
});

function pickProduct(idx) {
    const isCategoryIdx = idx.includes('_');

    if (isCategoryIdx) {
        const parts = idx.split('_');
        const category = parts[0];
        const index = parseInt(parts[parts.length - 1]);

        const categoryProducts = PRODUCTS.filter(p => p.type?.toLowerCase() === category.toLowerCase());
        const p = categoryProducts[index];

        if (p) {
            return {
                id: p.id,
                title: p.title || p.name || '',
                price: p.price || 0,
                image: p.media?.[0] || null,
                quantity: 1
            };
        }
    } else {
        const p = PRODUCTS[idx];
        return {
            id: p.id,
            title: p.title || p.name || '',
            price: p.price || 0,
            image: p.media?.[0] || null,
            quantity: 1
        };
    }

    return {
        id: 0,
        title: 'Товар не найден',
        price: 0,
        image: null,
        quantity: 1
    };
}

function getObject(key) {
    return JSON.parse(localStorage.getItem(key)) || {};
}

function toggleObject(key, idx, product) {
    const obj = getObject(key);
    if (obj[idx]) delete obj[idx];
    else obj[idx] = product;
    localStorage.setItem(key, JSON.stringify(obj));
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', getAllProducts);
document.head.appendChild(style);