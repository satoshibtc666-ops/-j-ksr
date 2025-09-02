/* ========================================
   AUTHENTICATION MODULE
   Модуль авторизации с ролевой моделью
======================================== */

class AuthManager {
  constructor() {
    this.tokenKey = 'warehouse_auth_token';
    this.userKey = 'warehouse_current_user';
    this.rememberKey = 'warehouse_remember_me';
    
    this.init();
  }

  // Инициализация модуля авторизации
  init() {
    this.setupEventListeners();
    this.checkStoredAuth();
  }

  // Настройка обработчиков событий
  setupEventListeners() {
    // Форма входа
    const loginForm = DOM.get('login-form');
    if (loginForm) {
      Events.on(loginForm, 'submit', (e) => this.handleLogin(e));
    }

    // Переключение видимости пароля
    const togglePassword = DOM.get('toggle-password');
    if (togglePassword) {
      Events.on(togglePassword, 'click', () => this.togglePasswordVisibility());
    }

    // Форма восстановления пароля
    const recoveryForm = DOM.get('recovery-form');
    if (recoveryForm) {
      Events.on(recoveryForm, 'submit', (e) => this.handlePasswordRecovery(e));
    }

    // Переключение между формами
    const forgotPasswordLink = DOM.get('forgot-password-link');
    if (forgotPasswordLink) {
      Events.on(forgotPasswordLink, 'click', (e) => {
        e.preventDefault();
        this.showRecoveryForm();
      });
    }

    const backToLogin = DOM.get('back-to-login');
    if (backToLogin) {
      Events.on(backToLogin, 'click', () => this.showLoginForm());
    }

    // Демо-режим
    const demoLoginBtn = DOM.get('demo-login-btn');
    if (demoLoginBtn) {
      Events.on(demoLoginBtn, 'click', () => this.demoLogin());
    }

    // Выход из системы
    const logoutBtn = DOM.get('logout-btn');
    if (logoutBtn) {
      Events.on(logoutBtn, 'click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  }

  // Проверка сохраненной авторизации
  checkStoredAuth() {
    const token = Storage.get(this.tokenKey);
    const user = Storage.get(this.userKey);
    const remember = Storage.get(this.rememberKey);

    if (token && user && remember) {
      AppState.currentUser = user;
      AppState.isAuthenticated = true;
      this.showApp();
    }
  }

  // Обработка входа в систему
  async handleLogin(event) {
    event.preventDefault();
    
    const loginBtn = DOM.get('login-btn');
    const formData = FormUtils.getData('login-form');
    
    // Очистка предыдущих ошибок
    FormUtils.clearErrors('login-form');
    
    // Валидация
    if (!this.validateLoginForm(formData)) {
      return;
    }
    
    // Показать состояние загрузки
    this.setButtonLoading(loginBtn, true);
    
    try {
      // Симуляция запроса к серверу (в реальном приложении здесь будет API вызов)
      await this.simulateAuthRequest();
      
      const user = await this.authenticateUser(formData.username, formData.password);
      
      if (user) {
        // Сохранение данных авторизации
        if (formData.remember) {
          Storage.set(this.tokenKey, 'demo_token_' + Date.now());
          Storage.set(this.userKey, user);
          Storage.set(this.rememberKey, true);
        }
        
        AppState.currentUser = user;
        AppState.isAuthenticated = true;
        
        // Показать успешное уведомление
        this.showToast('success', 'Добро пожаловать!', `Вход выполнен как ${user.full_name}`);
        
        // Переход к основному приложению
        setTimeout(() => this.showApp(), 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showToast('error', 'Ошибка входа', error.message || 'Проверьте логин и пароль');
    } finally {
      this.setButtonLoading(loginBtn, false);
    }
  }

  // Валидация формы входа
  validateLoginForm(data) {
    let isValid = true;

    if (!Validators.required(data.username)) {
      FormUtils.showError('username', 'Введите логин или email');
      isValid = false;
    }

    if (!Validators.required(data.password)) {
      FormUtils.showError('password', 'Введите пароль');
      isValid = false;
    } else if (!Validators.password(data.password)) {
      FormUtils.showError('password', 'Пароль должен содержать минимум 6 символов');
      isValid = false;
    }

    return isValid;
  }

  // Аутентификация пользователя (демо-версия)
  async authenticateUser(username, password) {
    // Демо-пользователи для тестирования
    const demoUsers = [
      {
        id: 'admin_1',
        username: 'admin',
        email: 'admin@warehouse.com',
        full_name: 'Системный администратор',
        role: 'admin',
        warehouse_access: ['warehouse_1', 'warehouse_2'],
        is_active: true
      },
      {
        id: 'manager_1',
        username: 'manager',
        email: 'manager@warehouse.com',
        full_name: 'Менеджер склада',
        role: 'manager',
        warehouse_access: ['warehouse_1'],
        is_active: true
      },
      {
        id: 'keeper_1',
        username: 'keeper',
        email: 'keeper@warehouse.com',
        full_name: 'Кладовщик',
        role: 'warehouse_keeper',
        warehouse_access: ['warehouse_1', 'warehouse_2'],
        is_active: true
      }
    ];

    // Поиск пользователя
    const user = demoUsers.find(u => 
      (u.username === username || u.email === username) && 
      password === 'demo123' // Демо-пароль
    );

    if (!user) {
      throw new Error('Неверный логин или пароль');
    }

    if (!user.is_active) {
      throw new Error('Учетная запись заблокирована');
    }

    return user;
  }

  // Демо-вход
  async demoLogin() {
    const demoLoginBtn = DOM.get('demo-login-btn');
    this.setButtonLoading(demoLoginBtn, true);

    try {
      await this.simulateAuthRequest();
      
      const demoUser = {
        id: 'demo_user',
        username: 'demo',
        email: 'demo@warehouse.com',
        full_name: 'Демо пользователь',
        role: 'admin',
        warehouse_access: ['warehouse_1', 'warehouse_2'],
        is_active: true
      };

      AppState.currentUser = demoUser;
      AppState.isAuthenticated = true;

      this.showToast('success', 'Демо-режим', 'Добро пожаловать в демо-версию системы');
      
      setTimeout(() => this.showApp(), 500);
    } catch (error) {
      this.showToast('error', 'Ошибка', 'Не удалось войти в демо-режим');
    } finally {
      this.setButtonLoading(demoLoginBtn, false);
    }
  }

  // Обработка восстановления пароля
  async handlePasswordRecovery(event) {
    event.preventDefault();
    
    const formData = FormUtils.getData('recovery-form');
    
    FormUtils.clearErrors('recovery-form');

    if (!Validators.email(formData.email)) {
      FormUtils.showError('recovery-email', 'Введите корректный email адрес');
      return;
    }

    try {
      await this.simulateAuthRequest();
      this.showToast('success', 'Письмо отправлено', 'Проверьте почту для восстановления пароля');
      this.showLoginForm();
    } catch (error) {
      this.showToast('error', 'Ошибка', 'Не удалось отправить письмо восстановления');
    }
  }

  // Переключение видимости пароля
  togglePasswordVisibility() {
    const passwordInput = DOM.get('password');
    const toggleBtn = DOM.get('toggle-password');
    const icon = toggleBtn.querySelector('i');

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon.className = 'fas fa-eye-slash';
    } else {
      passwordInput.type = 'password';
      icon.className = 'fas fa-eye';
    }
  }

  // Показать форму восстановления пароля
  showRecoveryForm() {
    const loginForm = DOM.get('login-form');
    const recoveryForm = DOM.get('recovery-form');

    DOM.addClass(loginForm, 'slide-out-left');
    
    setTimeout(() => {
      DOM.hide(loginForm);
      DOM.show(recoveryForm);
      DOM.addClass(recoveryForm, 'slide-in-right');
      
      // Фокус на поле email
      const emailField = DOM.get('recovery-email');
      if (emailField) emailField.focus();
    }, 250);
  }

  // Показать форму входа
  showLoginForm() {
    const loginForm = DOM.get('login-form');
    const recoveryForm = DOM.get('recovery-form');

    DOM.addClass(recoveryForm, 'slide-out-right');
    
    setTimeout(() => {
      DOM.hide(recoveryForm);
      DOM.show(loginForm);
      DOM.removeClass(loginForm, 'slide-out-left');
      DOM.addClass(loginForm, 'slide-in-left');
      
      // Очистка формы восстановления
      FormUtils.clear('recovery-form');
      FormUtils.clearErrors('recovery-form');
    }, 250);
  }

  // Показать основное приложение
  showApp() {
    const authContainer = DOM.get('auth-container');
    const appContainer = DOM.get('app-container');
    const loadingScreen = DOM.get('loading-screen');

    // Скрыть экран загрузки
    DOM.addClass(loadingScreen, 'hidden');

    // Скрыть форму авторизации и показать приложение
    AnimationUtils.fadeOut(authContainer, 300);
    
    setTimeout(() => {
      DOM.hide(authContainer);
      DOM.show(appContainer);
      AnimationUtils.fadeIn(appContainer, 300);
      
      // Обновить информацию о пользователе
      this.updateUserInfo();
      
      // Инициализировать основное приложение
      if (window.App && window.App.init) {
        window.App.init();
      }
    }, 300);
  }

  // Обновить информацию о пользователе в интерфейсе
  updateUserInfo() {
    const user = AppState.currentUser;
    if (!user) return;

    const userName = DOM.get('current-user-name');
    const userRole = DOM.get('current-user-role');

    if (userName) userName.textContent = user.full_name;
    if (userRole) userRole.textContent = this.getRoleDisplayName(user.role);
  }

  // Получить отображаемое название роли
  getRoleDisplayName(role) {
    const roleNames = {
      'admin': 'Администратор',
      'manager': 'Менеджер',
      'warehouse_keeper': 'Кладовщик'
    };
    return roleNames[role] || role;
  }

  // Выход из системы
  logout() {
    // Очистка данных авторизации
    Storage.remove(this.tokenKey);
    Storage.remove(this.userKey);
    Storage.remove(this.rememberKey);

    // Сброс состояния приложения
    AppState.currentUser = null;
    AppState.isAuthenticated = false;
    AppState.currentWarehouse = null;

    // Показать форму авторизации
    const authContainer = DOM.get('auth-container');
    const appContainer = DOM.get('app-container');

    DOM.hide(appContainer);
    DOM.show(authContainer);

    // Очистка форм
    FormUtils.clear('login-form');
    FormUtils.clear('recovery-form');
    FormUtils.clearErrors('login-form');
    FormUtils.clearErrors('recovery-form');

    this.showToast('success', 'Выход выполнен', 'До свидания!');
  }

  // Проверка прав доступа
  hasRole(requiredRole) {
    if (!AppState.currentUser) return false;
    
    const roleHierarchy = {
      'admin': 3,
      'manager': 2,
      'warehouse_keeper': 1
    };

    const userLevel = roleHierarchy[AppState.currentUser.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  }

  // Проверка доступа к складу
  hasWarehouseAccess(warehouseId) {
    if (!AppState.currentUser) return false;
    if (AppState.currentUser.role === 'admin') return true;
    
    return AppState.currentUser.warehouse_access.includes(warehouseId);
  }

  // Симуляция запроса к серверу
  async simulateAuthRequest() {
    return new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
  }

  // Установка состояния загрузки кнопки
  setButtonLoading(button, loading) {
    if (!button) return;

    if (loading) {
      DOM.addClass(button, 'loading');
      button.disabled = true;
    } else {
      DOM.removeClass(button, 'loading');
      button.disabled = false;
    }
  }

  // Показать уведомление
  showToast(type, title, message) {
    if (window.Toast && window.Toast.show) {
      window.Toast.show(type, title, message);
    } else {
      // Fallback для случая, если Toast еще не загружен
      console.log(`${type.toUpperCase()}: ${title} - ${message}`);
    }
  }
}

// Инициализация модуля авторизации
document.addEventListener('DOMContentLoaded', () => {
  window.Auth = new AuthManager();
});

// Экспорт для использования в других модулях
window.AuthManager = AuthManager;