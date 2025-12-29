import { products as localProducts } from './data.js';

let allProducts = [...localProducts];

function renderProducts(productsToRender = allProducts) {
    const recommendationGrid = document.getElementById("recommendationsGrid");
    const electronicsGrid = document.getElementById("electronicsGrid");
    const allGrid = document.getElementById("productGrid");
    
    const createCardHTML = (product) => `
        <div class="product-card"> 
            <div class="card-image-container">
                <img src="${product.image}" alt="${product.title}">
                <button class="wishlist-btn">
                    <img src="/icons/heart.svg" class="icon-small">
                </button>
            </div>
            
            <div class="card-info">
                <p class="product-title">${product.title}</p>
                <div class="rating">
                    <img src="/images/Без названия.png" class="rating-star-icon">
                    <span>${product.rating}</span>
                    <span class="reviews-count">(${product.reviews || 0} отзывов)</span>
                </div> 
                <div class="installment-badge">
                    ${Math.round(product.price / 12).toLocaleString()} сум/мес
                </div>
                <div class="price-wrapper">
                    <div class="price-block">
                        <p class="old-price">${product.oldPrice ? product.oldPrice.toLocaleString() + ' сум' : ''}</p>
                        <p class="current-price">${product.price.toLocaleString()} сум</p>
                    </div>
                    <button class="add-to-cart">
                        <img src="/icons/shopping-bag.svg" class="icon-small">
                    </button>
                </div>
            </div>
        </div>
    `;

    if (recommendationGrid) {
        const topProducts = productsToRender.filter(p => p.rating === 5.0);
        recommendationGrid.innerHTML = topProducts.map(createCardHTML).join('');
    }

    if (electronicsGrid) {
        const electronics = productsToRender.filter(p => p.category === 'electronics');
        electronicsGrid.innerHTML = electronics.map(createCardHTML).join('');
    }

    if (allGrid) {
        allGrid.innerHTML = productsToRender.map(createCardHTML).join('');
    }
}

renderProducts();