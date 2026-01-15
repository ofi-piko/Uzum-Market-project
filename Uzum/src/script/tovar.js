document.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return;
    
    if (e.target.closest('button')) return;
    
    const productId = getProductIdFromCard(card);
    if (!productId) return;
    
    openProductPage(productId);
});

function getProductIdFromCard(card) {
    const btn = card.querySelector('.product-cart-btn');
    return btn?.getAttribute('onclick')?.match(/\d+/)?.[0];
}

async function openProductPage(productId) {
    const overlay = document.createElement('div');
    overlay.className = 'product-overlay';
    overlay.innerHTML = `
        <div class="product-modal">
            <button class="close-btn" onclick="this.closest('.product-overlay').remove()">×</button>
            <div class="modal-content">Загрузка...</div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/main/products/${productId}`);
        const product = await res.json();
        
        const content = overlay.querySelector('.modal-content');
        content.innerHTML = `
            <img src="${product.media?.[0] || ''}" alt="${product.title || ''}">
            <h2>${product.title || product.name}</h2>
            <p>${product.price?.toLocaleString()} сум</p>
            <button onclick="addToCart(${product.id})">В корзину</button>
        `;
    } catch (e) {
        const content = overlay.querySelector('.modal-content');
        content.innerHTML = '<p>Ошибка загрузки</p>';
    }
}