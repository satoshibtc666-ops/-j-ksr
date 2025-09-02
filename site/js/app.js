/* ========================================
   MAIN APPLICATION MODULE
   Основной модуль приложения
======================================== */

class Application {
  constructor() {
    this.currentView = null;
    this.modules = {
      warehouses: null,
      inventory: null,
      movements: null
    };
    this.isInitialized = false;
  }

  // Инициализация приложения
  async init() {
    if (this.isInitialized) return;

    try {
      // Инициализация модулей
      await this.initializeModules();

      // Загрузка начального view
      this.loadView('warehouses');

      // Настройка обработчиков событий
      this.setupGlobalEventListeners();

      this.isInitialized = true;
    } catch (error) {
      console.error('App initialization error:', error);
      Toast.error('Ошибка инициализации', 'Не удалось запустить приложение');
    }
  }

  // Инициализация модулей
  async initializeModules() {
    try {
      // Инициализация менеджера складов
      this.modules.warehouses = new WarehouseManager();
      
      // Другие модули будут инициализированы по мере необходимости
      
    } catch (error) {
      console.error('Module initialization error:', error);
      throw error;
    }
  }

  // Загрузка представления
  async loadView(viewName, params = {}) {
    if (this.currentView === viewName) return;

    const mainContent = DOM.get('main-content');
    if (!mainContent) return;

    try {
      Loading.show(`Загрузка ${this.getViewTitle(viewName)}...`);

      let content = '';
      
      switch (viewName) {
        case 'warehouses':
          content = await this.loadWarehousesView(params);
          break;
        case 'inventory':
          content = await this.loadInventoryView(params);
          break;
        case 'movements':
          content = await this.loadMovementsView(params);
          break;
        case 'reports':
          content = await this.loadReportsView(params);
          break;
        case 'users':
          content = await this.loadUsersView(params);
          break;
        default:
          content = this.loadNotFoundView();
      }

      // Обновление контента
      mainContent.innerHTML = content;

      // Настройка обработчиков для нового view
      this.setupViewEventListeners(viewName);

      // Обновление активного пункта навигации
      this.updateActiveNavigation(viewName);

      // Обновление breadcrumb если не установлен из модуля
      if (!AppState.currentWarehouse) {
        this.updateBreadcrumb(this.getViewTitle(viewName));
      }

      this.currentView = viewName;

    } catch (error) {
      console.error(`Load view error (${viewName}):`, error);
      mainContent.innerHTML = this.loadErrorView(error.message);
    } finally {
      Loading.hide();
    }
  }

  // Загрузка представления складов
  async loadWarehousesView(params) {
    if (!this.modules.warehouses) {
      this.modules.warehouses = new WarehouseManager();
    }
    
    // Сброс выбранного склада
    AppState.currentWarehouse = null;
    
    return this.modules.warehouses.renderWarehouseSelector();
  }

  // Загрузка представления товаров
  async loadInventoryView(params) {
    if (!AppState.currentWarehouse) {
      // Перенаправление на выбор склада
      this.loadView('warehouses');
      Toast.warning('Внимание', 'Сначала выберите склад для работы');
      return '';
    }

    if (!this.modules.inventory) {
      // Загрузка модуля инвентаря по требованию
      const { InventoryManager } = await import('./inventory.js');
      this.modules.inventory = new InventoryManager();
    }

    return this.modules.inventory.renderInventoryDashboard();
  }

  // Загрузка представления движений
  async loadMovementsView(params) {
    if (!this.modules.movements) {
      // Загрузка модуля движений по требованию
      const { MovementsManager } = await import('./movements.js');
      this.modules.movements = new MovementsManager();
    }

    return this.modules.movements.renderMovementsTable(params);
  }

  // Загрузка представления отчетов
  async loadReportsView(params) {
    return `
      <div class="reports-view">
        <div class="page-header">
          <h1>
            <i class="fas fa-chart-bar"></i>
            Аналитика и отчеты
          </h1>
          <p class="page-subtitle">Статистика работы складского комплекса</p>
        </div>

        <div class="reports-grid">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-boxes"></i>
                Остатки по складам
              </h3>
            </div>
            <div class="card-body">
              <p>Текущие остатки товаров по всем складам</p>
              <button class="btn btn-primary">
                <i class="fas fa-download"></i>
                Выгрузить отчет
              </button>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-exchange-alt"></i>
                Движения за период
              </h3>
            </div>
            <div class="card-body">
              <p>Детализация всех операций по датам</p>
              <button class="btn btn-primary">
                <i class="fas fa-download"></i>
                Выгрузить отчет
              </button>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-chart-line"></i>
                Аналитика продаж
              </h3>
            </div>
            <div class="card-body">
              <p>Статистика отгрузок и популярных товаров</p>
              <button class="btn btn-primary">
                <i class="fas fa-download"></i>
                Выгрузить отчет
              </button>
            </div>
          </div>
        </div>

        <div class="coming-soon">
          <i class="fas fa-tools"></i>
          <h3>Раздел в разработке</h3>
          <p>Полная система отчетов будет доступна в следующих версиях</p>
        </div>
      </div>
    `;
  }

  // Загрузка представления пользователей
  async loadUsersView(params) {
    // Проверка прав доступа
    if (!window.Auth || !window.Auth.hasRole('manager')) {
      return `
        <div class="access-denied-view">
          <div class="access-denied-content">
            <i class="fas fa-lock"></i>
            <h2>Доступ запрещен</h2>
            <p>У вас нет прав для просмотра этого раздела</p>
            <button class="btn btn-primary" onclick="App.loadView('warehouses')">
              <i class="fas fa-warehouse"></i>
              Вернуться к складам
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div class="users-view">
        <div class="page-header">
          <h1>
            <i class="fas fa-users"></i>
            Управление пользователями
          </h1>
          <p class="page-subtitle">Настройка доступа и ролей сотрудников</p>
        </div>

        <div class="users-actions">
          <button class="btn btn-primary">
            <i class="fas fa-plus"></i>
            Добавить пользователя
          </button>
        </div>

        <div class="coming-soon">
          <i class="fas fa-tools"></i>
          <h3>Модуль в разработке</h3>
          <p>Управление пользователями будет доступно в следующих версиях</p>
        </div>
      </div>
    `;
  }

  // Представление "Не найдено"
  loadNotFoundView() {
    return `
      <div class="not-found-view">
        <div class="not-found-content">
          <i class="fas fa-exclamation-triangle"></i>
          <h2>Страница не найдена</h2>
          <p>Запрошенный раздел не существует или временно недоступен</p>
          <button class="btn btn-primary" onclick="App.loadView('warehouses')">
            <i class="fas fa-warehouse"></i>
            Вернуться к складам
          </button>
        </div>
      </div>
    `;
  }

  // Представление ошибки
  loadErrorView(errorMessage) {
    return `
      <div class="error-view">
        <div class="error-content">
          <i class="fas fa-exclamation-circle"></i>
          <h2>Произошла ошибка</h2>
          <p>${errorMessage}</p>
          <div class="error-actions">
            <button class="btn btn-secondary" onclick="location.reload()">
              <i class="fas fa-redo"></i>
              Обновить страницу
            </button>
            <button class="btn btn-primary" onclick="App.loadView('warehouses')">
              <i class="fas fa-warehouse"></i>
              Вернуться к складам
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Настройка обработчиков событий для представления
  setupViewEventListeners(viewName) {
    switch (viewName) {
      case 'warehouses':
        if (this.modules.warehouses) {
          this.modules.warehouses.setupEventListeners();
        }
        break;
      case 'inventory':
        if (this.modules.inventory) {
          this.modules.inventory.setupEventListeners();
        }
        break;
      case 'movements':
        if (this.modules.movements) {
          this.modules.movements.setupEventListeners();
        }
        break;
    }
  }

  // Настройка глобальных обработчиков событий
  setupGlobalEventListeners() {
    // Обработка изменения размера окна
    Events.on(window, 'resize', this.debounce(() => {
      this.handleWindowResize();
    }, 250));

    // Обработка потери соединения
    Events.on(window, 'offline', () => {
      Toast.warning('Соединение потеряно', 'Проверьте подключение к интернету');
    });

    Events.on(window, 'online', () => {
      Toast.success('Соединение восстановлено', 'Подключение к интернету активно');
    });

    // Предотвращение случайного закрытия при наличии несохраненных данных
    Events.on(window, 'beforeunload', (e) => {
      if (this.hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = 'У вас есть несохраненные изменения. Вы уверены, что хотите покинуть страницу?';
        return e.returnValue;
      }
    });
  }

  // Обработка изменения размера окна
  handleWindowResize() {
    // Обновление layout компонентов при необходимости
    if (this.modules.inventory && typeof this.modules.inventory.handleResize === 'function') {
      this.modules.inventory.handleResize();
    }
  }

  // Обновление активного пункта навигации
  updateActiveNavigation(viewName) {
    // Удаляем активное состояние со всех пунктов
    DOM.getAll('.nav-item').forEach(item => {
      DOM.removeClass(item, 'active');
    });

    // Добавляем активное состояние к текущему пункту
    const currentNavLink = document.querySelector(`.nav-link[data-view="${viewName}"]`);
    if (currentNavLink) {
      DOM.addClass(currentNavLink.parentElement, 'active');
    }
  }

  // Обновление breadcrumb
  updateBreadcrumb(title) {
    const breadcrumb = DOM.get('breadcrumb');
    if (breadcrumb) {
      breadcrumb.innerHTML = `<span class="breadcrumb-item active">${title}</span>`;
    }
  }

  // Получение заголовка представления
  getViewTitle(viewName) {
    const titles = {
      warehouses: 'Склады',
      inventory: 'Товары',
      movements: 'Движения',
      reports: 'Отчеты',
      users: 'Пользователи'
    };
    return titles[viewName] || 'Неизвестный раздел';
  }

  // Проверка наличия несохраненных изменений
  hasUnsavedChanges() {
    // Логика проверки несохраненных изменений
    // В реальном приложении здесь может быть более сложная логика
    return false;
  }

  // Debounce функция
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Экспорт данных
  async exportData(type, format = 'xlsx', filters = {}) {
    try {
      Loading.show('Подготовка экспорта данных...');

      // Симуляция экспорта
      await new Promise(resolve => setTimeout(resolve, 2000));

      // В реальном приложении здесь будет API вызов для экспорта
      const exportData = {
        type,
        format,
        filters,
        timestamp: DateUtils.now()
      };

      console.log('Export data:', exportData);
      
      Toast.success('Экспорт завершен', `Данные успешно экспортированы в формате ${format.toUpperCase()}`);
      
    } catch (error) {
      console.error('Export error:', error);
      Toast.error('Ошибка экспорта', 'Не удалось экспортировать данные');
    } finally {
      Loading.hide();
    }
  }

  // Методы для работы с состоянием приложения
  getCurrentView() {
    return this.currentView;
  }

  getCurrentWarehouse() {
    return AppState.currentWarehouse;
  }

  getCurrentUser() {
    return AppState.currentUser;
  }
}

// Стили для специальных состояний
const additionalStyles = `
<style>
.coming-soon {
  text-align: center;
  padding: var(--space-16);
  color: var(--color-gray-500);
}

.coming-soon i {
  font-size: 4rem;
  margin-bottom: var(--space-6);
  color: var(--color-gray-400);
}

.coming-soon h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-4);
  color: var(--color-gray-600);
}

.access-denied-view,
.not-found-view,
.error-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.access-denied-content,
.not-found-content,
.error-content {
  text-align: center;
  max-width: 400px;
  padding: var(--space-8);
}

.access-denied-content i,
.not-found-content i,
.error-content i {
  font-size: 4rem;
  margin-bottom: var(--space-6);
  color: var(--color-gray-400);
}

.access-denied-content h2,
.not-found-content h2,
.error-content h2 {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--space-4);
  color: var(--color-gray-700);
}

.access-denied-content p,
.not-found-content p,
.error-content p {
  margin-bottom: var(--space-6);
  color: var(--color-gray-600);
  line-height: var(--line-height-relaxed);
}

.error-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  flex-wrap: wrap;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.page-header {
  margin-bottom: var(--space-8);
}

.page-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-800);
  margin-bottom: var(--space-2);
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.page-header h1 i {
  color: var(--color-primary);
}

.page-subtitle {
  color: var(--color-gray-600);
  font-size: var(--font-size-lg);
  margin: 0;
}

.users-actions {
  margin-bottom: var(--space-8);
}

@media (max-width: 768px) {
  .error-actions {
    flex-direction: column;
  }
  
  .reports-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header h1 {
    font-size: var(--font-size-2xl);
  }
}
</style>
`;

// Добавление дополнительных стилей
document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  window.App = new Application();
});

// Экспорт для использования в других модулях
window.Application = Application;