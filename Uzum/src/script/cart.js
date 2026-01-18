class CartManager {
    constructor() {
        this.cartKey = 'cart';
        this.allOrdersKey = 'allOrders';
    }

    init() {
        const korzinaEl = document.getElementById('korzina');
        if (korzinaEl) this.renderCart(korzinaEl);
    }


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

    getOriginalPrice(price) {
        const original = Math.round(Number(price) * 1.50);
        return original.toLocaleString('ru-RU') + ' сум';
    }


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
                <div class="products-column">
                    <div class="delivery-header">
                        <h3 class="delivery-title">Доставка Uzum Market</h3>
                        <p class="delivery-subtitle">Доставим никогда</p>
                    </div>
                    
                    <div class="product-list">
                        ${cartItems.map(item => this.renderCartItem(item)).join('')}
                    </div>
                </div>
                
                <div class="order-summary">
                    <div class="summary-header">
                        <h3 class="summary-title">Итого</h3>
                    </div>
                    <div class="summary-content">
                        <div class="summary-row">
                            <span class="summary-label">${cartItems.length} товара</span>
                            <span class="summary-value">${this.getTotalFormatted(cartData)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Доставка</span>
                            <span class="summary-value" style="color: #00a650;">Бесплатно</span>
                        </div>
                        <div class="summary-total summary-row">
                            <span class="summary-label">К оплате</span>
                            <span class="summary-value">${this.getTotalFormatted(cartData)}</span>
                        </div>
                        <button class="summary-btn">
                            Оформить заказ
                        </button>
                    </div>
                </div>
            </div>
        `;

        document
            .querySelector('.summary-btn')
            .addEventListener('click', () => this.checkoutOrder());

        this.initCounters();
        this.initDeleteButtons();
    }

    renderCartItem(item) {
        const imageUrl = item.media?.[0] || item.image || '';
        const shortTitle = item.title.length > 60 ? 
            item.title.substring(0, 60) + '...' : 
            item.title;

        return `
            <div class="product-card" data-id="${item.productId}">
                <div class="product-header">
                    <span class="product-badge"><img src="${imageUrl}" alt="${item.title}" class="product-image"></span>
                    <div class="product-title-wrapper">
                        <h3 class="product-title">${shortTitle}</h3>
                        <p class="product-seller">Продавец: Ofi-piko</p>
                        <p class="product-color">Цвет: ${item.colors[0]}</p>
                    </div>
                </div>
                
                <div class="product-details">
                    <div class="price-section">
                        <span class="current-price">${Number(item.price).toLocaleString('ru-RU')} сум</span>
                        <span class="original-price">без карты Uzum ${this.getOriginalPrice(item.price)}</span>
                    </div>
                    
                    <div class="actions-section">
                        <div class="counter">
                            <button class="decrease">−</button>
                            <input class="count" type="number" min="1" value="${item.quantity}">
                            <button class="increase">+</button>
                        </div>
                        <button class="delete-btn" data-id="${item.productId}">
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        `;
    }


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
        const productId = input.closest('.product-card').dataset.id;
        const cart = this.getCartData();

        if (!cart[productId]) return;

        cart[productId].quantity = Math.max(1, Number(input.value));
        this.saveCartData(cart);

        const summaryValue = document.querySelector('.summary-row:first-child .summary-value');
        const totalValue = document.querySelector('.summary-total .summary-value');
        
        if (summaryValue && totalValue) {
            const total = this.getTotalFormatted(cart);
            summaryValue.textContent = total;
            totalValue.textContent = total;
        }
    }


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


    checkoutOrder() {
        const cart = this.getCartData();
        if (!this.hasProducts(cart)) return;

        const order = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: cart,
            total: this.getTotalNumber(cart),
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
                <h4>Номер заказа: #${order.id.toString().slice(-6)}</h4><br>
                <form action="index.html">
                    <button type="submit" style="color: #fff;">На главную</button>
                </form>

            </div>
        `;
    }
}


let cartManager;
document.addEventListener('DOMContentLoaded', () => {
    cartManager = new CartManager();
    cartManager.init();
});