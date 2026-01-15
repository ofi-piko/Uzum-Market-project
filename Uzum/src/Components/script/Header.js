export const header = document.getElementById("header");

header.innerHTML = `
<div id="header_content">
      <div id="header_left">
        <div id="header_logo">
          <a href="./index.html">
            <img src="./public/icons/logo/logo.svg" alt="">
          </a>
        </div>
        <br>
        <div id="katalog">
          <a href="#" class="katalog-btn">Каталог</a>
        </div>

        <div id="screach_holder">
          <input type="search" placeholder="Искать товары">
        </div>
      </div>

      <div id="need-content">
        <div id="user-content">
          <img src="./public/icons/logo/user.png" alt="">
          <div id="user-name"><a href="UserProfile.html">login</a></div>
        </div>

        <div id="saved">
          <a href="./favirite.html">Избранное</a>
        </div>

        <div id="cart">
          <a href="./cart">Корзина</a>
          <div id="cart-number">3</div>
        </div>
      </div>

    </div>
    <br>
    <br>
`;
document.addEventListener('DOMContentLoaded', function () {
  const searchHolder = document.getElementById('screach_holder');
  const hintElement = document.createElement('div');
  hintElement.className = 'hint';
  searchHolder.appendChild(hintElement);

  const searchInput = searchHolder.querySelector('input[type="search"]');
  
  const keywordHints = {
    'телефон': 'Смартфоны и телефоны',
    'phone': 'Смартфоны и телефоны',
    'смартфон': 'Смартфоны и телефоны',
    'мобильный': 'Смартфоны и телефоны',
    'ноутбук': 'Ноутбуки и компьютеры',
    'laptop': 'Ноутбуки и компьютеры',
    'компьютер': 'Ноутбуки и компьютеры',
    'одежда': 'Одежда и аксессуары',
    'обувь': 'Обувь',
    'электроника': 'Электроника',
    'аксессуар': 'Аксессуары',
    'книга': 'Книги',
    'игра': 'Игры и софт'
  };

  searchInput.addEventListener('input', function (e) {
    const value = e.target.value.toLowerCase().trim();
    
    if (value === '') {
      hintElement.style.display = 'none';
      return;
    }

    let foundHint = '';
    
    for (const [keyword, hint] of Object.entries(keywordHints)) {
      if (value.includes(keyword)) {
        foundHint = hint;
        break;
      }
    }

    if (foundHint) {
      hintElement.style.display = 'block';
      hintElement.textContent = `🔍 ${foundHint}`;
    } else {
      hintElement.style.display = 'none';
    }
  });

  searchInput.addEventListener('blur', function () {
    setTimeout(() => {
      hintElement.style.display = 'none';
    }, 200);
  });

  searchInput.addEventListener('focus', function () {
    if (searchInput.value.trim() !== '') {
      searchInput.dispatchEvent(new Event('input'));
    }
  });
});

const AuthApp = {
    currentUser: null,
    
    init() {
        this.loadUser();
        this.checkAuth();
        this.createAuthMenu();
        this.setupEventListeners();
    },
    
    loadUser() {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    },
    
    checkAuth() {
        const userContent = document.getElementById('user-content');
        
        if (!userContent) {
            this.createUserContent();
            return;
        }
        
        if (this.currentUser) {
            this.showUserProfile(userContent);
        } else {
            this.showLoginLink(userContent);
        }
    },
    
    createUserContent() {
        const header = document.querySelector('header') || document.body;
        const userContent = document.createElement('div');
        userContent.id = 'user-content';
        userContent.innerHTML = `
            <img src="./public/icons/logo/user.png" alt="Пользователь">
            <div id="user-name"><a href="#" id="auth-link">Войти</a></div>
        `;
        header.appendChild(userContent);
    },
    
    showUserProfile(container) {
        const userNameDiv = container.querySelector('#user-name');
        if (userNameDiv) {
            userNameDiv.innerHTML = `
                <a href="UserProfile.html" class="user-profile-link">
                    ${this.currentUser.firstName} ${this.currentUser.lastName}
                </a>
            `;
        }
    },
    
    showLoginLink(container) {
        const userNameDiv = container.querySelector('#user-name');
        if (userNameDiv) {
            userNameDiv.innerHTML = '<a href="#" id="auth-link">Войти</a>';
        }
    },
    
    createAuthMenu() {
        const modal = document.createElement('div');
        modal.id = 'auth-modal';
        modal.className = 'auth-modal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        `;
        
        modal.innerHTML = `
            <div class="auth-modal-content" style="
                background: white;
                padding: 30px;
                border-radius: 12px;
                width: 90%;
                max-width: 400px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                position: relative;
            ">
                <button id="close-auth" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                ">×</button>
                
                <h2 style="margin-bottom: 20px; color: #333;">Регистрация</h2>
                
                <form id="auth-form">
                    <div style="margin-bottom: 15px;">
                        <input type="text" id="first-name" placeholder="Имя" required
                            style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 16px;">
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <input type="text" id="last-name" placeholder="Фамилия" required
                            style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 16px;">
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <input type="tel" id="phone" placeholder="Номер телефона" required
                            style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 16px;">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <input type="password" id="password" placeholder="Пароль" required
                            style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 16px;">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: #666;">Пол:</label>
                        <div style="display: flex; gap: 15px;">
                            <label style="display: flex; align-items: center; gap: 5px;">
                                <input type="radio" name="gender" value="male" required>
                                Парень
                            </label>
                            <label style="display: flex; align-items: center; gap: 5px;">
                                <input type="radio" name="gender" value="female">
                                Девушка
                            </label>
                            <label style="display: flex; align-items: center; gap: 5px;">
                                <input type="radio" name="gender" value="unknown">
                                Не знаю
                            </label>
                        </div>
                    </div>
                    
                    <button type="submit" style="
                        width: 100%;
                        padding: 14px;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 16px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: background 0.3s;
                    ">Зарегистрироваться</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'auth-link' || e.target.closest('#auth-link')) {
                e.preventDefault();
                this.openAuthModal();
            }
            
            if (e.target.id === 'close-auth') {
                this.closeAuthModal();
            }
            
            if (e.target.id === 'auth-modal') {
                this.closeAuthModal();
            }
        });
        
        const authForm = document.getElementById('auth-form');
        if (authForm) {
            authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.registerUser();
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAuthModal();
            }
        });
    },
    
    openAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },
    
    closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    },
    
    registerUser() {
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const gender = document.querySelector('input[name="gender"]:checked')?.value;
        
        if (!firstName || !lastName || !phone || !password || !gender) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }
        
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
        if (!phoneRegex.test(phone)) {
            alert('Введите корректный номер телефона!');
            return;
        }
        
        if (password.length < 6) {
            alert('Пароль должен содержать минимум 6 символов!');
            return;
        }
        
        this.currentUser = {
            firstName,
            lastName,
            phone,
            gender,
            login: phone,
            registeredAt: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        
        this.closeAuthModal();
        
        this.checkAuth();
    },
    
    logout() {
        if (confirm('Вы уверены, что хотите выйти?')) {
            localStorage.removeItem('user');
            this.currentUser = null;
            this.checkAuth();
        }
    },
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #user-content {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
            }
            
            #user-name {
                font-size: 16px;
            }
            
            .user-profile-link:hover {
                background: rgba(17, 17, 17, 0.1);
            }
            #auth-form input:focus {
                outline: none;
                border-color: #4CAF50;
            }
            
            #auth-form button:hover {
                background: #45a049;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .auth-modal-content {
                animation: fadeIn 0.3s ease-out;
            }
        `;
        document.head.appendChild(style);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AuthApp.addStyles();
    AuthApp.init();
});

window.AuthApp = AuthApp;


function updateLogo() {
  const logo = document.querySelector('#header_logo img');
  const link = document.querySelector('#header_logo a');
  
  if (window.innerWidth < 925) {
    logo.src = './public/icons/logo/logo2.png';
    logo.alt = 'Логотип для мобильных';
    logo.title = 'Мобильная версия';
  } else {
    logo.src = './public/icons/logo/logo.svg';
    logo.alt = 'Основной логотип';
    logo.title = 'Версия для ПК';
  }
}

