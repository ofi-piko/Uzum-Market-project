document.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return;

    if (e.target.closest('button')) return;

    const productId = getProductIdFromCard(card);
    if (!productId) return;

    openProductMenu(productId);
});

function getProductIdFromCard(card) {
    const btn = card.querySelector('.product-cart-btn');
    if (!btn) return null;

    const match = btn.getAttribute('onclick')?.match(/\d+/);
    return match ? match[0] : null;
}

async function openProductMenu(productId) {
    const menu = document.getElementById('product-menu');
    menu.classList.add('open');
    menu.innerHTML = '<div class="loading">Загрузка товара...</div>';

    try {
        const res = await fetch(
            `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/main/products/${productId}`
        );

        if (!res.ok) throw new Error('Товар не найден');

        const product = await res.json();
        renderProductMenu(product);
    } catch (e) {
        menu.innerHTML = '<p>Ошибка загрузки товара</p>';
    }
}

function renderProductMenu(product) {
    const menu = document.getElementById('product-menu');

    menu.innerHTML = `
        <button class="menu-close" onclick="closeProductMenu()">×</button>

        <img src="${product.media?.[0] || ''}" alt="">
        <h2>${product.title || product.name}</h2>
        <p>${product.description || 'Описание отсутствует'}</p>

        <strong>${product.price?.toLocaleString('ru-RU')} сум</strong>

        <button onclick="addToCart(${product.id})">
            В корзину
        </button>
    `;
}

function closeProductMenu() {
    document.getElementById('product-menu').classList.remove('open');
}
