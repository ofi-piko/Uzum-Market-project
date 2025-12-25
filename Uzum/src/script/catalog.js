import { products as localProducts } from './data.js';

let allProducts = [...localProducts]; // Начинаем с локальных данных

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

// Инициализируем с локальными данными
renderProducts();

async function getAllProducts() {
    try {
        const res = await fetch(
            `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/main/products`
        );
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        // Обновляем продукты данными с сервера
        if (data && Array.isArray(data)) {
            allProducts = data;
            renderProducts(allProducts); // Перерисовываем с новыми данными
        }
        
        console.log('Products loaded from server:', data);
        return data;
        
    } catch (error) {
        console.error('Error loading products:', error);
        // Можно оставить локальные данные, если сервер не доступен
        console.log('Using local products data');
        return localProducts;
    }
}

// Загружаем данные с сервера при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    getAllProducts();
});