const BACKEND_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:3000';
let allProducts = [];
let searchTimeout;

async function getAllProducts() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/v1/main/products`);
        const data = await res.json();
        allProducts = data.products || data || [];
        return allProducts;
    } catch (err) {
        console.error('Ошибка загрузки товаров:', err);
        return [];
    }
}

function normalizeQuery(query) {
    return query.toLowerCase().trim().replace(/\s+/g, ' ');
}

function truncateToFirstDot(text) {
    if (!text) return '';
    const dotIndex = text.indexOf('.');
    return dotIndex !== -1 ? text.substring(0, dotIndex + 1) : text;
}

function searchProducts(query) {
    if (!query.trim()) {
        return [];
    }

    const normalizedQuery = normalizeQuery(query);
    const queryWords = normalizedQuery.split(' ').filter(word => word.length > 0);
    
    return allProducts.filter(product => {
        let score = 0;
        
        if (product.category) {
            const catLower = product.category.toLowerCase();
            const catParts = product.category.split('.');
            const firstCatPart = catParts[0].toLowerCase().trim();
            
            if (catLower === normalizedQuery) score += 10;
            if (catLower.includes(normalizedQuery)) score += 6;
            if (firstCatPart.includes(normalizedQuery)) score += 8;
            
            queryWords.forEach(word => {
                if (catLower.includes(word)) score += 4;
                if (firstCatPart.includes(word)) score += 5;
                
                catParts.forEach(part => {
                    if (part.toLowerCase().trim().includes(word)) score += 3;
                });
            });
        }

        const name = product.name || '';
        const nameLower = name.toLowerCase();
        
        if (nameLower === normalizedQuery) score += 9;
        if (nameLower.includes(normalizedQuery)) score += 5;
        
        queryWords.forEach(word => {
            if (nameLower.includes(word)) score += 3;
        });

        const description = product.description || '';
        const descLower = description.toLowerCase();
        
        if (descLower.includes(normalizedQuery)) score += 4;
        
        queryWords.forEach(word => {
            if (descLower.includes(word)) score += 2;
        });

        const brand = product.brand || '';
        const brandLower = brand.toLowerCase();
        
        if (brandLower === normalizedQuery) score += 7;
        
        queryWords.forEach(word => {
            if (brandLower.includes(word)) score += 3;
        });

        return score > 0;
    }).sort((a, b) => {
        const aHasCategory = a.category ? 1 : 0;
        const bHasCategory = b.category ? 1 : 0;
        return bHasCategory - aHasCategory;
    });
}

function displayResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'search-no-results';
        noResults.textContent = 'Товары не найдены';
        noResults.style.cssText = 'padding: 15px; text-align: center; color: #999;';
        resultsContainer.appendChild(noResults);
        resultsContainer.style.display = 'block';
        return;
    }

    const limitedResults = results.slice(0, 15);

    limitedResults.forEach(product => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.style.cssText = `
            padding: 12px 15px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: background-color 0.2s;
        `;

        let categoryDisplay = product.category || '';
        if (categoryDisplay.includes('.')) {
            const parts = categoryDisplay.split('.').map(p => p.trim());
            categoryDisplay = parts.join(' • ');
        }

        const shortDescription = truncateToFirstDot(product.description || product.name || '');

        item.innerHTML = `
            <div style="flex-shrink: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3498db" stroke-width="2">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; font-size: 14px; color: #333; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${product.name || shortDescription}
                </div>
                ${categoryDisplay ? `<div style="font-size: 12px; color: #3498db; font-weight: 500; margin-bottom: 2px;">${categoryDisplay}</div>` : ''}
                ${product.brand ? `<div style="font-size: 12px; color: #666; margin-bottom: 2px;">Бренд: ${product.brand}</div>` : ''}
                ${product.price ? `<div style="color: #2ecc71; font-weight: bold; font-size: 14px;">${product.price.toLocaleString()} Сум</div>` : ''}
            </div>
        `;

        item.addEventListener('click', () => {
            const searchInput = document.querySelector('#screach_holder input[type="search"]');
            searchInput.value = product.name || shortDescription;
            resultsContainer.style.display = 'none';
        });

        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = '#f8f9fa';
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
    const searchHolder = document.getElementById('screach_holder');
    if (!searchHolder) {
        return;
    }

    let searchInput = searchHolder.querySelector('input[type="search"]');
    if (!searchInput) {
        searchInput = document.createElement('input');
        searchInput.type = 'search';
        searchInput.placeholder = 'Поиск товаров...';
        searchInput.style.cssText = `
            width: 100%;
            padding: 10px 15px 10px 40px;
            border: 1px solid #ddd;
            border-radius: 20px;
            font-size: 14px;
            outline: none;
            box-sizing: border-box;
        `;
        searchHolder.appendChild(searchInput);
    }

    if (!searchHolder.querySelector('.search-icon')) {
        const searchIcon = document.createElement('div');
        searchIcon.className = 'search-icon';
        searchIcon.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
        `;
        searchIcon.style.cssText = `
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
        `;
        searchHolder.style.position = 'relative';
        searchHolder.appendChild(searchIcon);
    }

    if (!document.getElementById('searchResults')) {
        const resultsContainer = document.createElement('div');
        resultsContainer.id = 'searchResults';
        resultsContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            max-height: 500px;
            overflow-y: auto;
            display: none;
            z-index: 1000;
            box-shadow: 0 6px 16px rgba(0,0,0,0.12);
            margin-top: 8px;
        `;
        searchHolder.style.position = 'relative';
        searchHolder.appendChild(resultsContainer);
    }

    searchInput.addEventListener('input', function (e) {
        const query = e.target.value;

        clearTimeout(searchTimeout);

        if (!query.trim()) {
            hideResults();
            return;
        }

        searchTimeout = setTimeout(() => {
            const results = searchProducts(query);
            displayResults(results);
        }, 300);
    });

    searchInput.addEventListener('focus', function () {
        if (this.value.trim()) {
            const results = searchProducts(this.value);
            displayResults(results);
        }
    });

    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = this.value.trim();
            if (query) {
                const results = searchProducts(query);
                displayResults(results);
            }
        }
        
        if (e.key === 'Escape') {
            hideResults();
        }
    });

    document.addEventListener('click', function (e) {
        const searchHolder = document.getElementById('screach_holder');
        const resultsContainer = document.getElementById('searchResults');

        if (searchHolder && !searchHolder.contains(e.target)) {
            hideResults();
        }
    });

    getAllProducts().then(() => {
        searchInput.addEventListener('focus', () => {
            searchInput.placeholder = 'Начните вводить название или категорию...';
        });
        
        searchInput.addEventListener('blur', () => {
            searchInput.placeholder = 'Поиск товаров...';
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}

export { getAllProducts, searchProducts, initSearch };