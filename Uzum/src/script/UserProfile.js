const userMenu = document.getElementById("UserMenu");

const userData = JSON.parse(localStorage.getItem('user')) || {};
const gender = userData.gender || 'unknown';
const firstName = userData.firstName || 'Пользователь';
const lastName = userData.lastName || '';
const phone = userData.phone || 'Не указан';

let avatarImage = '';
switch (gender) {
    case 'male':
        avatarImage = './public/icons/logo/logo/man.jpg';
        break;
    case 'female':
        avatarImage = './public/icons/logo/logo/women.jpg';
        break;
    default:
        avatarImage = './public/icons/logo/logo/none.jpg';
}

userMenu.innerHTML = `
<div class="container">
    <div class="left-panel">
        <div class="user-info">
            <div class="avatar">
                <img src="${avatarImage}" alt="Аватар">
            </div>
            <h2 class="user-name">${firstName} ${lastName}</h2>
            <div class="user-data">
                <div class="data-item">
                    <span class="label">Телефон:</span>
                    <span class="value">${phone}</span>
                </div>
                <div class="data-item">
                    <span class="label">Пол:</span>
                    <span class="value">${gender === 'male' ? 'Мужской' :
        gender === 'female' ? 'Женский' :
            'Не указан'
    }</span>
                </div>
            </div>
        </div>
        
        <nav class="menu">
        <button class="menu-item" data-tab="profile">
                <span>Профиль</span>
            </button>
            <button class="menu-item active" data-tab="orders">
                <span>Мои заказы</span>
            </button>
            <button class="menu-item" data-tab="promocodes">
            <span>Промокоды</span>
            </button>
            <button class="menu-item" data-tab="reviews">
                <span>Отзывы</span>
            </button>
            <button class="menu-item" data-tab="logout" id="logout-btn-menu">
                <span>Выйти</span>
            </button>
        </nav>
    </div>
    
    <div class="right-panel">
        <div class="content">
            <div class="tab-content active" id="orders">
                <h1>Мои заказы</h1>
                <div class="tab-content-inner">
                    <div class="orders-list">
                        <p>У вас пока нет заказов</p>
                    </div>
                </div>
            </div>
            
            <div class="tab-content" id="reviews">
                <h1>Мои отзывы</h1>
                <div class="tab-content-inner">
                    <div class="reviews-list">
                        <p>Данил сделает</p>
                    </div>
                </div>
            </div>
            
            <div class="tab-content" id="profile">
                <h1>Настройки профиля</h1>
                <div class="tab-content-inner">
                    <form class="profile-form">
                        <div class="form-group">
                            <label for="profile-first-name">Имя</label>
                            <input type="text" id="profile-first-name" value="${firstName}" required>
                        </div>
                        <div class="form-group">
                            <label for="profile-last-name">Фамилия</label>
                            <input type="text" id="profile-last-name" value="${lastName}" required>
                        </div>
                        <div class="form-group">
                            <label for="profile-phone">Телефон</label>
                            <input type="tel" id="profile-phone" value="${phone}" required>
                        </div>
                        <div class="form-group">
                            <label>Пол</label>
                            <div class="gender-select">
                                <label class="gender-option">
                                    <input type="radio" name="gender" value="male" ${gender === 'male' ? 'checked' : ''}>
                                    <span>Парень</span>
                                </label>
                                <label class="gender-option">
                                    <input type="radio" name="gender" value="female" ${gender === 'female' ? 'checked' : ''}>
                                    <span>Девушка</span>
                                </label>
                                <label class="gender-option">
                                    <input type="radio" name="gender" value="unknown" ${gender === 'unknown' ? 'checked' : ''}>
                                    <span>Не знаю</span>
                                </label>
                            </div>
                        </div>
                        <div class="profile-buttons">
                            <button type="submit" class="save-btn">Сохранить изменения</button>
                            <button type="button" class="cancel-btn" id="cancel-edit">Отмена</button>
                            <button type="button" class="danger-btn" id="delete-account">Удалить аккаунт</button>
                        </div>
                    </form>
                </div>
            </div>
            
            <div class="tab-content" id="promocodes">
                <h1>Мои промокоды</h1>
                <div class="tab-content-inner">
                    <div class="promocodes-list">
                        <p>Данил сделает</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

function setupTabSwitching() {
    const menuButtons = document.querySelectorAll('.menu-item');

    menuButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabId = this.dataset.tab;

            if (tabId === 'logout') {
                const ordersList = document.querySelector('.orders-list');
                if (ordersList) {
                    ordersList.innerHTML = `
            <div class="logout-menu">
                <div class="logout-warning">
                    <div class="warning-icon">Опастная Зона!</div>
                    <p>Вы уверены, что хотите удалить/выйти из профиля?</p>
                    <p class="warning-subtext">После удаления/выхода потребуется повторная регистрация или же вход</p>
                    <div class="logout-buttons">
                        <button class="logout-confirm-btn" id="logout-confirm-btn">Да, выйти</button>
                        <button class="logout-cancel-btn" id="logout-cancel-btn">Отмена</button>
                    </div>
                </div>
            </div>
        `;

                    document.getElementById('logout-confirm-btn').addEventListener('click', function () {
                        localStorage.removeItem('user');
                        localStorage.removeItem('allOrders');
                        window.location.href = 'index.html';
                    });

                    document.getElementById('logout-cancel-btn').addEventListener('click', function () {
                        const allOrders = JSON.parse(localStorage.getItem('allOrders')) || [];
                        const ordersList = document.querySelector('.orders-list');

                        if (!Array.isArray(allOrders) || allOrders.length === 0) {
                            ordersList.innerHTML = '<p>У вас пока нет заказов</p>';
                        } else {
                            ordersList.innerHTML = '';
                            allOrders.forEach(order => {
                                const orderCard = document.createElement('div');
                                orderCard.className = 'order-card';
                                ordersList.appendChild(orderCard);
                            });
                        }

                        menuButtons.forEach(btn => btn.classList.remove('active'));
                        document.querySelector('[data-tab="orders"]').classList.add('active');

                        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                        document.getElementById('orders').classList.add('active');

                        const ordersTab = document.getElementById('orders');
                        const ordersTitle = ordersTab.querySelector('h1');
                        if (ordersTitle) {
                            ordersTitle.textContent = 'Мои заказы';
                        }
                    });
                }

                const ordersTab = document.getElementById('orders');
                const ordersTitle = ordersTab.querySelector('h1');
                if (ordersTitle) {
                    ordersTitle.textContent = 'Выход из аккаунта';
                }

                menuButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                ordersTab.classList.add('active');

                return;
            }

            menuButtons.forEach(btn => btn.classList.remove('active'));

            this.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function setupProfileForm() {
    const profileForm = document.querySelector('.profile-form');

    if (profileForm) {
        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const updatedUser = {
                ...userData,
                firstName: document.getElementById('profile-first-name').value.trim(),
                lastName: document.getElementById('profile-last-name').value.trim(),
                phone: document.getElementById('profile-phone').value.trim(),
                gender: document.querySelector('input[name="gender"]:checked').value
            };

            if (!updatedUser.firstName || !updatedUser.lastName || !updatedUser.phone) {
                return;
            }

            const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
            if (!phoneRegex.test(updatedUser.phone)) {
                return;
            }

            localStorage.setItem('user', JSON.stringify(updatedUser));

            updateUserDisplay(updatedUser);

        });
    }
}

function updateUserDisplay(user) {
    const userDataElement = document.querySelector('.user-data');
    if (userDataElement) {
        userDataElement.innerHTML = `
            <div class="data-item">
                <span class="label">Телефон:</span>
                <span class="value">${user.phone}</span>
            </div>
            <div class="data-item">
                <span class="label">Пол:</span>
                <span class="value">${user.gender === 'male' ? 'Мужской' :
                user.gender === 'female' ? 'Женский' :
                    'Не указан'
            }</span>
            </div>
        `;
    }

    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        userNameElement.textContent = `${user.firstName} ${user.lastName}`;
    }

    const avatarImg = document.querySelector('.avatar img');
    if (avatarImg) {
        let newAvatar = '';
        switch (user.gender) {
            case 'male': newAvatar = './public/icons/logo/logo/man.jpg'; break;
            case 'female': newAvatar = './public/icons/logo/logo/women.jpg'; break;
            default: newAvatar = './public/icons/logo/logo/none.jpg';
        }
        avatarImg.src = newAvatar;
    }
}

function initUserMenu() {
    setupTabSwitching();
    setupProfileForm();
}

initUserMenu();

document.addEventListener('DOMContentLoaded', function () {
    const ordersList = document.querySelector('.orders-list');

    if (!ordersList) return;

    const allOrders = JSON.parse(localStorage.getItem('allOrders')) || [];

    if (!Array.isArray(allOrders) || allOrders.length === 0) {
        ordersList.innerHTML = '<p>У вас пока нет заказов</p>';
        return;
    }

    ordersList.innerHTML = '';

    allOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';

        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        let itemsHTML = '';

        Object.values(order.items || {}).forEach(item => {
            itemsHTML += `
                <div class="order-item">
                    <div class="item-image">
                        <img src="${item.media?.[0] || ''}" alt="${item.title}">
                    </div>
                    <div class="item-info">
                        <h4 class="item-title">${item.title}</h4>
                        <div class="item-meta">
                            <span class="item-quantity">${item.quantity} шт.</span>
                            <span class="item-price">${item.price.toLocaleString('ru-RU')} Сум</span>
                        </div>
                    </div>
                </div>
            `;
        });
        orderCard.innerHTML = `
            <div class="order-header">
                <span class="order-id">Заказ #${order.id}</span>
                <span class="order-date">${formattedDate}</span>
                <span class="order-status">${order.status}</span>
            </div>

            <div class="order-items">
                ${itemsHTML}
            </div>

            <div class="order-total">
                <strong>Итого: ${order.total.toLocaleString('ru-RU')} Сум</strong>
            </div>
        `;

        ordersList.appendChild(orderCard);
    });
});