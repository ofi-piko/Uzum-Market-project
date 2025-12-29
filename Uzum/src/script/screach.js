
const BACKEND_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:3000';
let allProducts = [];
let searchTimeout;

async function getAllProducts() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/v1/main/products`);
        const data = await res.json();
        allProducts = data.products || data || [];
        console.log('Товары загружены:', allProducts.length);
        return allProducts;
    } catch (error) {
        console.error("Ошибка загрузки товаров:", error);
        return [];
    }
}

function normalizeQuery(query) {
    return query.toLowerCase().trim();
}

function truncateToFirstDot(text) {
    if (!text) return '';
    const dotIndex = text.indexOf('.');
    return dotIndex !== -1 ? text.substring(0, dotIndex + 1) : text;
}

async function searchProducts(query) {
    if (!query.trim()) {
        return [];
    }

    const normalizedQuery = normalizeQuery(query);
    if (allProducts.length === 0) {
        await getAllProducts();
    }
    const results = allProducts.filter(product => {
        const searchFields = [
            product.name,
            product.description,
            product.category,
            product.brand,
            product.model
        ].filter(Boolean);

        return searchFields.some(field =>
            normalizeQuery(field).includes(normalizedQuery)
        );
    });

    return results;
}

function displayResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.style.display = 'none';
        return;
    }

    results.forEach(product => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.style.cssText = `
            padding: 10px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        const shortDescription = truncateToFirstDot(product.description || product.name || '');

        item.innerHTML = `
            <div style="flex: 1;">
                <div style="font-weight: bold;">${shortDescription}</div>
                ${product.category ? `<div style="font-size: 12px; color: #666;">${product.category}</div>` : ''}
                ${product.price ? `<div style="color: #2ecc71; font-weight: bold;">${product.price} Сум</div>` : ''}
            </div>
        `;
        item.addEventListener('click', () => {
            const searchInput = document.querySelector('#screach_holder input[type="search"]');
            searchInput.value = product.name || shortDescription;
            resultsContainer.style.display = 'none';
            console.log('Выбран товар:', product);
        });
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = '#f5f5f5';
        });
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = '';
        });
        resultsContainer.appendChild(item);
    });
    resultsContainer.style.display = 'block';
}

function hideResults() {
    const resultsContainer = document.getElementById('searchResults');
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
}

function initSearch() {
    const searchInput = document.querySelector('#screach_holder input[type="search"]');
    if (!searchInput) {
        console.error('Поле поиска не найдено!');
        return;
    }

    if (!document.getElementById('searchResults')) {
        const resultsContainer = document.createElement('div');
        resultsContainer.id = 'searchResults';
        resultsContainer.style.cssText = `
            position: absolute;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: ${searchInput.offsetWidth}px;
            max-height: 400px;
            overflow-y: auto;
            display: none;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            margin-top: 5px;
        `;

        searchInput.parentNode.appendChild(resultsContainer);
    }

    searchInput.addEventListener('input', function (e) {
        const query = e.target.value;

        clearTimeout(searchTimeout);

        if (!query.trim()) {
            hideResults();
            return;
        }

        searchTimeout = setTimeout(async () => {
            const results = await searchProducts(query);
            displayResults(results);
        }, 300);
    });

    searchInput.addEventListener('focus', async function () {
        if (this.value.trim()) {
            const results = await searchProducts(this.value);
            displayResults(results);
        }
    });

    document.addEventListener('click', function (e) {
        const searchInput = document.querySelector('#screach_holder input[type="search"]');
        const resultsContainer = document.getElementById('searchResults');

        if (!searchInput.contains(e.target) && (!resultsContainer || !resultsContainer.contains(e.target))) {
            hideResults();
        }
    });

    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            hideResults();
        }
    });

    getAllProducts().then(() => {
        console.log('Поиск инициализирован');
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}

export { getAllProducts, searchProducts, initSearch };