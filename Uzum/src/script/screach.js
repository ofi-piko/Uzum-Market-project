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
    if (!searchHolder) return;

    searchHolder.style.cssText = `
        position: relative;
        width: 100%;
        max-width: 680px;
        margin: 0 auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    let searchInput = searchHolder.querySelector('input[type="search"]');
    if (!searchInput) {
        searchInput = document.createElement('input');
        searchInput.type = 'search';
        searchInput.placeholder = 'Товары и категории';
        searchInput.setAttribute('autocomplete', 'off');
        searchInput.setAttribute('spellcheck', 'false');
        searchHolder.appendChild(searchInput);
    }

    searchInput.style.cssText = `
        width: 100%;
        padding: 16px 24px 16px 56px;
        border: 2px solid transparent;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 400;
        outline: none;
        box-sizing: border-box;
        background: #f8f9fa;
        color: #1a1a1a;
        transition: all 0.2s ease;
        caret-color: #7000FF;
    `;

    searchInput.addEventListener('mouseenter', () => {
        searchInput.style.background = '#f1f3f5';
    });

    searchInput.addEventListener('mouseleave', () => {
        if (document.activeElement !== searchInput) {
            searchInput.style.background = '#f8f9fa';
        }
    });

    searchInput.addEventListener('focus', () => {
        searchInput.style.cssText += `
            background: white;
            border-color: #7000FF;
            box-shadow: 0 0 0 4px rgba(112, 0, 255, 0.08);
        `;
        searchIcon.style.stroke = '#7000FF';
    });

    searchInput.addEventListener('blur', () => {
        searchInput.style.cssText += `
            background: #f8f9fa;
            border-color: transparent;
            box-shadow: none;
        `;
        searchIcon.style.stroke = '#6C757D';
    });

    let searchIcon = searchHolder.querySelector('.search-icon');
    if (!searchIcon) {
        searchIcon = document.createElement('div');
        searchIcon.className = 'search-icon';
        searchIcon.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" 
                      stroke="#6C757D" 
                      stroke-width="2"/>
            </svg>
        `;
        searchHolder.appendChild(searchIcon);
    }

    searchIcon.style.cssText = `
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        z-index: 2;
        transition: all 0.2s ease;
    `;

    let clearButton = searchHolder.querySelector('.search-clear');
    if (!clearButton) {
        clearButton = document.createElement('button');
        clearButton.className = 'search-clear';
        clearButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" 
                      stroke="#6C757D" 
                      stroke-width="2"/>
            </svg>
        `;
        clearButton.setAttribute('aria-label', 'Очистить поиск');
        clearButton.style.cssText = `
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            border-radius: 6px;
            display: none;
            transition: all 0.2s ease;
        `;
        searchHolder.appendChild(clearButton);

        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
            hideResults();
            clearButton.style.display = 'none';
        });

        clearButton.addEventListener('mouseenter', () => {
            clearButton.style.background = '#f1f3f5';
        });

        clearButton.addEventListener('mouseleave', () => {
            clearButton.style.background = 'none';
        });
    }

    searchInput.addEventListener('input', function() {
        clearButton.style.display = this.value.trim() ? 'block' : 'none';
    });

    if (!document.getElementById('searchResults')) {
        const resultsContainer = document.createElement('div');
        resultsContainer.id = 'searchResults';
        resultsContainer.style.cssText = `
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 12px;
            max-height: 520px;
            overflow-y: auto;
            display: none;
            z-index: 1000;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            opacity: 0;
            transform: translateY(-8px);
            transition: opacity 0.15s ease, transform 0.15s ease;
        `;
        searchHolder.appendChild(resultsContainer);
    }

    function getCategoryIcon(category) {
        if (!category) return `${product.media}`;
        
        const lowerCat = category.toLowerCase();
        
        if (lowerCat.includes('phone') || lowerCat.includes('телефон')) return '📱';
        if (lowerCat.includes('laptop') || lowerCat.includes('ноутбук')) return '💻';
        if (lowerCat.includes('tv') || lowerCat.includes('телевизор')) return '📺';
        if (lowerCat.includes('audio') || lowerCat.includes('наушник')) return '🎧';
        if (lowerCat.includes('game') || lowerCat.includes('игр')) return '🎮';
        if (lowerCat.includes('home') || lowerCat.includes('дом')) return '🏠';
        if (lowerCat.includes('kitchen') || lowerCat.includes('кухн')) return '🍳';
        if (lowerCat.includes('beauty') || lowerCat.includes('красот')) return '💄';
        if (lowerCat.includes('fashion') || lowerCat.includes('одежд')) return '👕';
        if (lowerCat.includes('sport') || lowerCat.includes('спорт')) return '⚽';
        if (lowerCat.includes('book') || lowerCat.includes('книг')) return '📚';
        if (lowerCat.includes('toy') || lowerCat.includes('игрушк')) return '🧸';
        if (lowerCat.includes('auto') || lowerCat.includes('авто')) return '🚗';
        if (lowerCat.includes('health') || lowerCat.includes('здоров')) return '💊';
        if (lowerCat.includes('office') || lowerCat.includes('офис')) return '📎';
        if (lowerCat.includes('garden') || lowerCat.includes('сад')) return '🌱';
        
        return '📦';
    }

    function displayResults(results) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = '';

        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'search-no-results';
            noResults.style.cssText = `
                padding: 40px 24px;
                text-align: center;
                color: #6C757D;
            `;
            noResults.innerHTML = `
                <div style="margin-bottom: 16px;">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                        <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" 
                              stroke="#DEE2E6" 
                              stroke-width="1.5"/>
                    </svg>
                </div>
                <div style="font-size: 16px; font-weight: 500; margin-bottom: 4px;">
                    Ничего не найдено
                </div>
                <div style="font-size: 14px;">
                    Попробуйте изменить запрос
                </div>
            `;
            resultsContainer.appendChild(noResults);
        } else {
            const limitedResults = results.slice(0, 8);

            limitedResults.forEach((product, index) => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.style.cssText = `
                    padding: 16px 24px;
                    cursor: pointer;
                    border-bottom: ${index < limitedResults.length - 1 ? '1px solid #f1f3f5' : 'none'};
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    transition: all 0.15s ease;
                    background: white;
                `;

                let categoryDisplay = product.category || '';
                if (categoryDisplay.includes('.')) {
                    const parts = categoryDisplay.split('.').map(p => p.trim());
                    categoryDisplay = parts.join(' › ');
                }

                const shortDescription = truncateToFirstDot(product.description || product.name || '');
                const categoryIcon = getCategoryIcon(product.category);

                item.innerHTML = `
                    <div style="flex-shrink: 0; width: 40px; height: 40px; 
                                background: #f8f9fa;
                                border-radius: 10px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 20px;">
                        ${categoryIcon}
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-size: 15px; 
                                    color: #212529; 
                                    margin-bottom: 4px;
                                    font-weight: 500;
                                    line-height: 1.4;
                                    display: -webkit-box;
                                    -webkit-line-clamp: 2;
                                    -webkit-box-orient: vertical;
                                    overflow: hidden;">
                            ${product.name || shortDescription}
                        </div>
                        ${categoryDisplay ? `
                            <div style="font-size: 13px; 
                                        color: #6C757D; 
                                        margin-bottom: 4px;">
                                ${categoryDisplay}
                            </div>
                        ` : ''}
                        ${product.brand ? `
                            <div style="font-size: 13px; 
                                        color: #495057;">
                                ${product.brand}
                            </div>
                        ` : ''}
                        ${product.price ? `
                            <div style="color: #212529; 
                                        font-weight: 600; 
                                        font-size: 16px;
                                        margin-top: 8px;">
                                ${product.price.toLocaleString()} сум
                            </div>
                        ` : ''}
                    </div>
                    <div style="flex-shrink: 0; color: #ADB5BD;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M9 5L16 12L9 19" 
                                  stroke="currentColor" 
                                  stroke-width="2"/>
                        </svg>
                    </div>
                `;

                item.addEventListener('click', () => {
                    searchInput.value = product.name || shortDescription;
                    hideResults();
                });

                item.addEventListener('mouseenter', () => {
                    item.style.background = '#f8f9fa';
                });

                item.addEventListener('mouseleave', () => {
                    item.style.background = 'white';
                });

                resultsContainer.appendChild(item);
            });

            if (results.length > limitedResults.length) {
                const footer = document.createElement('div');
                footer.style.cssText = `
                    padding: 16px 24px;
                    color: #7000FF;
                    font-size: 14px;
                    font-weight: 500;
                    text-align: center;
                    cursor: pointer;
                    border-top: 1px solid #f1f3f5;
                    transition: all 0.15s ease;
                `;
                footer.innerHTML = `
                    Показать все результаты (${results.length})
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-left: 6px;">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" 
                              stroke="currentColor" 
                              stroke-width="2"/>
                    </svg>
                `;
                
                footer.addEventListener('click', () => {
                    console.log('Show all results');
                });

                footer.addEventListener('mouseenter', () => {
                    footer.style.background = '#f8f9fa';
                });

                footer.addEventListener('mouseleave', () => {
                    footer.style.background = 'white';
                });

                resultsContainer.appendChild(footer);
            }
        }

        resultsContainer.style.display = 'block';
        setTimeout(() => {
            resultsContainer.style.opacity = '1';
            resultsContainer.style.transform = 'translateY(0)';
        }, 10);
    }

    function hideResults() {
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
            resultsContainer.style.opacity = '0';
            resultsContainer.style.transform = 'translateY(-8px)';
            setTimeout(() => {
                resultsContainer.style.display = 'none';
            }, 150);
        }
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
        }, 200);
    });

    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            hideResults();
            this.blur();
        }
    });

    document.addEventListener('click', function (e) {
        if (!searchHolder.contains(e.target)) {
            hideResults();
        }
    });

    getAllProducts().then(() => {
        console.log('Search initialized');
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}

export { getAllProducts, searchProducts, initSearch };