class CartManager {
    constructor() {
        this.cartKey = 'cart';
        this.allOrdersKey = 'allOrders';
    }

    init() {
        const korzinaEl = document.getElementById('korzina');
        if (korzinaEl) this.renderCart(korzinaEl);
    }

    /* ---------- STORAGE ---------- */

    getCartData() {
        return JSON.parse(localStorage.getItem(this.cartKey)) || {};
    }

    saveCartData(cart) {
        localStorage.setItem(this.cartKey, JSON.stringify(cart));
    }

    getAllOrders() {
        return JSON.parse(localStorage.getItem(this.allOrdersKey)) || [];
    }

    saveAllOrders(orders) {
        localStorage.setItem(this.allOrdersKey, JSON.stringify(orders));
    }

    hasProducts(data) {
        return data && Object.keys(data).length > 0;
    }

    /* ---------- TOTAL ---------- */

    getTotalNumber(data) {
        return Object.values(data).reduce(
            (sum, item) =>
                sum + Number(item.price) * Number(item.quantity),
            0
        );
    }

    getTotalFormatted(data) {
        return this.getTotalNumber(data).toLocaleString('ru-RU') + ' сум';
    }

    /* ---------- RENDER ---------- */

    renderCart(container) {
        const cartData = this.getCartData();

        if (!this.hasProducts(cartData)) {
            container.innerHTML = `
                <div class="not-full-cart">
                    <img src="./public/icons/img/shopocat1.png"><br>
                    <h2>В корзине пока нет товаров</h2><br>
                    <button><a href="index.html">на главную</a></button>
                </div>
            `;
            return;
        }

        const cartItems = Object.entries(cartData).map(([productId, item]) => ({
            productId,
            ...item
        }));

        container.innerHTML = `
            <div class="korzina-container">
                <div class="products">
                    ${cartItems.map(item => this.renderCartItem(item)).join('')}
                </div>
                <div class="final-product">
                    <div class="final-product__price">
                        ${this.getTotalFormatted(cartData)}
                    </div>
                    <div class="final-product__currency">Итого</div>
                    <div class="final-product__info">
                        <b>Товары:</b> ${cartItems.length}
                    </div>
                    <button class="final-product__btn">
                        Оформить заказ
                    </button>
                </div>
            </div>
        `;

        document
            .querySelector('.final-product__btn')
            .addEventListener('click', () => this.checkoutOrder());

        this.initCounters();
        this.initDeleteButtons();
    }

    renderCartItem(item) {
        const imageUrl = item.media?.[0] || item.image || '';

        return `
            <div class="product" data-id="${item.productId}">
                <img src="${imageUrl}" alt="${item.title}">
                <h2>${item.title}</h2>
                <p>${Number(item.price).toLocaleString('ru-RU')} сум</p>

                <div class="counter">
                    <button class="decrease">−</button>
                    <input class="count" type="number" min="1" value="${item.quantity}">
                    <button class="increase">+</button>
                </div>

                <button class="delete-btn" data-id="${item.productId}">
                    Удалить
                </button>
            </div>
        `;
    }

    /* ---------- COUNTERS ---------- */

    initCounters() {
        document.querySelectorAll('.counter').forEach(counter => {
            const input = counter.querySelector('.count');

            counter.querySelector('.decrease').onclick = () => {
                input.value = Math.max(1, input.value - 1);
                this.updateQuantity(input);
            };

            counter.querySelector('.increase').onclick = () => {
                input.value++;
                this.updateQuantity(input);
            };

            input.onchange = () => this.updateQuantity(input);
        });
    }

    updateQuantity(input) {
        const productId = input.closest('.product').dataset.id;
        const cart = this.getCartData();

        if (!cart[productId]) return;

        cart[productId].quantity = Math.max(1, Number(input.value));
        this.saveCartData(cart);

        document.querySelector('.final-product__price').textContent =
            this.getTotalFormatted(cart);
    }

    /* ---------- DELETE ---------- */

    initDeleteButtons() {
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                const cart = this.getCartData();
                delete cart[id];
                this.saveCartData(cart);
                this.renderCart(document.getElementById('korzina'));
            };
        });
    }

    /* ---------- CHECKOUT ---------- */

    checkoutOrder() {
        const cart = this.getCartData();
        if (!this.hasProducts(cart)) return;

        const order = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: cart,
            total: this.getTotalNumber(cart), // ЧИСЛО!
            status: 'новый'
        };

        const orders = this.getAllOrders();
        orders.push(order);
        this.saveAllOrders(orders);

        localStorage.removeItem(this.cartKey);

        document.getElementById('korzina').innerHTML = `
            <div class="not-full-cart">
                <img src="./public/icons/img/shopocat1.png"><br>
                <h2>Заказ оформлен!</h2><br>
                <h4>Номер: #${order.id.toString().slice(-6)}</h4><br>
                <button><a href="index.html">на главную</a></button>
            </div>
        `;
    }
}

/* ---------- INIT ---------- */

let cartManager;
document.addEventListener('DOMContentLoaded', () => {
    cartManager = new CartManager();
    cartManager.init();
});
