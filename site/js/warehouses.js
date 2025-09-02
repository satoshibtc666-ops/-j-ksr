/* ========================================
   WAREHOUSES MODULE
   Модуль управления складами
======================================== */

class WarehouseManager {
  constructor() {
    this.warehouses = [];
    this.currentView = 'list';
    this.init();
  }

  // Инициализация модуля
  async init() {
    try {
      await this.loadWarehouses();
    } catch (error) {
      console.error('Warehouse init error:', error);
      Toast.error('Ошибка', 'Не удалось загрузить данные складов');
    }
  }

  // Загрузка списка складов
  async loadWarehouses() {
    try {
      // В реальном приложении здесь будет API вызов
      this.warehouses = await this.getWarehousesData();
    } catch (error) {
      console.error('Load warehouses error:', error);
      throw error;
    }
  }

  // Получение данных складов (демо-данные)
  async getWarehousesData() {
    // Симуляция загрузки данных
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: 'warehouse_1',
        name: 'Склад Белая Церковь',
        location: 'Белая Церковь',
        address: 'ул. Складская, 15, Белая Церковь, Киевская обл.',
        description: 'Основной склад солнечного оборудования',
        is_active: true,
        capacity: 10000,
        manager_id: 'manager_1',
        stats: {
          total_products: 245,
          movements_today: 12,
          critical_stock: 3,
          last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 часа назад
        }
      },
      {
        id: 'warehouse_2',
        name: 'Склад Киев',
        location: 'Киев',
        address: 'пр. Промышленный, 42, Киев',
        description: 'Распределительный склад для Киевского региона',
        is_active: true,
        capacity: 7500,
        manager_id: 'manager_2',
        stats: {
          total_products: 189,
          movements_today: 8,
          critical_stock: 1,
          last_activity: new Date(Date.now() - 45 * 60 * 1000).toISOString() // 45 минут назад
        }
      }
    ];
  }

  // Рендеринг списка складов
  renderWarehouseSelector() {
    const content = `
      <div class="warehouse-selector">
        <div class="warehouse-header">
          <div class="page-title">
            <h1>
              <i class="fas fa-warehouse"></i>
              Выберите склад
            </h1>
            <p class="page-subtitle">Управление складским учетом и товарными операциями</p>
          </div>
          
          <div class="warehouse-actions">
            <button class="btn btn-primary" id="add-warehouse-btn">
              <i class="fas fa-plus"></i>
              Добавить склад
            </button>
          </div>
        </div>

        <div class="warehouse-grid">
          ${this.warehouses.map(warehouse => this.renderWarehouseCard(warehouse)).join('')}
        </div>

        ${this.renderRecentActivity()}
      </div>
    `;

    return content;
  }

  // Рендеринг карточки склада
  renderWarehouseCard(warehouse) {
    const canAccess = window.Auth ? window.Auth.hasWarehouseAccess(warehouse.id) : true;
    const lastActivity = DateUtils.formatRelative(warehouse.stats.last_activity);
    
    return `
      <div class="warehouse-card ${!canAccess ? 'warehouse-card-disabled' : ''}" 
           data-warehouse-id="${warehouse.id}">
        <div class="warehouse-card-header">
          <div class="warehouse-info">
            <div class="warehouse-icon">
              <i class="fas fa-warehouse"></i>
            </div>
            <div class="warehouse-details">
              <h3 class="warehouse-name">${warehouse.name}</h3>
              <p class="warehouse-location">
                <i class="fas fa-map-marker-alt"></i>
                ${warehouse.location}
              </p>
            </div>
          </div>
          
          <div class="warehouse-status">
            <div class="status-indicator ${warehouse.is_active ? 'status-online' : 'status-offline'}">
              <div class="status-dot"></div>
              ${warehouse.is_active ? 'Активен' : 'Отключен'}
            </div>
          </div>
        </div>

        <div class="warehouse-card-body">
          <div class="warehouse-stats">
            <div class="stat-item">
              <div class="stat-value">${NumberUtils.format(warehouse.stats.total_products)}</div>
              <div class="stat-label">Наименований</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${warehouse.stats.movements_today}</div>
              <div class="stat-label">Операций сегодня</div>
            </div>
            <div class="stat-item">
              <div class="stat-value ${warehouse.stats.critical_stock > 0 ? 'stat-warning' : ''}">${warehouse.stats.critical_stock}</div>
              <div class="stat-label">Критические остатки</div>
            </div>
          </div>

          <div class="warehouse-activity">
            <i class="fas fa-clock"></i>
            Последняя активность: ${lastActivity}
          </div>
        </div>

        <div class="warehouse-card-footer">
          ${canAccess ? `
            <button class="btn btn-primary btn-large warehouse-select-btn" data-warehouse-id="${warehouse.id}">
              <i class="fas fa-sign-in-alt"></i>
              Войти в склад
            </button>
          ` : `
            <div class="access-denied">
              <i class="fas fa-lock"></i>
              Нет доступа
            </div>
          `}
        </div>
      </div>
    `;
  }

  // Рендеринг недавней активности
  renderRecentActivity() {
    return `
      <div class="recent-activity">
        <div class="section-header">
          <h2>
            <i class="fas fa-history"></i>
            Недавняя активность
          </h2>
          <a href="#" class="view-all-link" id="view-all-movements">
            Посмотреть все
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>

        <div class="activity-list">
          ${this.renderRecentMovements()}
        </div>
      </div>
    `;
  }

  // Рендеринг недавних движений
  renderRecentMovements() {
    // Демо-данные недавних движений
    const recentMovements = [
      {
        id: 1,
        warehouse_name: 'Белая Церковь',
        product_name: 'Trina 620Вт',
        type: 'out',
        quantity: 200,
        user_name: 'Кладовщик',
        comment: 'ООО "Сонячна енергія", Одесса',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        warehouse_name: 'Киев',
        product_name: 'Huawei Sun2000-10KTL',
        type: 'in',
        quantity: 15,
        user_name: 'Менеджер',
        comment: 'Поставка от производителя',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        warehouse_name: 'Белая Церковь',
        product_name: 'Pylontech US3000',
        type: 'out',
        quantity: 8,
        user_name: 'Кладовщик',
        comment: 'ЧП "Зеленая энергия", Харьков',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ];

    if (recentMovements.length === 0) {
      return `
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>Нет недавних операций</p>
        </div>
      `;
    }

    return recentMovements.map(movement => `
      <div class="activity-item">
        <div class="activity-icon">
          <i class="fas ${movement.type === 'in' ? 'fa-arrow-down text-success' : 'fa-arrow-up text-warning'}"></i>
        </div>
        <div class="activity-content">
          <div class="activity-main">
            <span class="activity-action ${movement.type === 'in' ? 'text-success' : 'text-warning'}">
              ${movement.type === 'in' ? '+' : '-'}${NumberUtils.format(movement.quantity)}
            </span>
            <span class="activity-product">${movement.product_name}</span>
          </div>
          <div class="activity-details">
            <span class="activity-warehouse">${movement.warehouse_name}</span>
            <span class="activity-separator">•</span>
            <span class="activity-user">${movement.user_name}</span>
            <span class="activity-separator">•</span>
            <span class="activity-time">${DateUtils.formatRelative(movement.timestamp)}</span>
          </div>
          ${movement.comment ? `<div class="activity-comment">${movement.comment}</div>` : ''}
        </div>
      </div>
    `).join('');
  }

  // Обработчики событий
  setupEventListeners() {
    // Выбор склада
    const selectButtons = DOM.getAll('.warehouse-select-btn');
    selectButtons.forEach(btn => {
      Events.on(btn, 'click', (e) => {
        const warehouseId = e.target.closest('.warehouse-select-btn').dataset.warehouseId;
        this.selectWarehouse(warehouseId);
      });
    });

    // Клик по карточке склада
    const warehouseCards = DOM.getAll('.warehouse-card:not(.warehouse-card-disabled)');
    warehouseCards.forEach(card => {
      Events.on(card, 'click', (e) => {
        // Игнорируем клики по кнопкам
        if (e.target.closest('button')) return;
        
        const warehouseId = card.dataset.warehouseId;
        this.selectWarehouse(warehouseId);
      });
    });

    // Добавление склада
    const addWarehouseBtn = DOM.get('add-warehouse-btn');
    if (addWarehouseBtn) {
      Events.on(addWarehouseBtn, 'click', () => this.showAddWarehouseModal());
    }

    // Просмотр всех движений
    const viewAllLink = DOM.get('view-all-movements');
    if (viewAllLink) {
      Events.on(viewAllLink, 'click', (e) => {
        e.preventDefault();
        if (window.App && window.App.loadView) {
          window.App.loadView('movements');
        }
      });
    }
  }

  // Выбор склада
  async selectWarehouse(warehouseId) {
    const warehouse = this.warehouses.find(w => w.id === warehouseId);
    if (!warehouse) {
      Toast.error('Ошибка', 'Склад не найден');
      return;
    }

    // Проверка доступа
    if (window.Auth && !window.Auth.hasWarehouseAccess(warehouseId)) {
      Toast.error('Доступ запрещен', 'У вас нет прав для работы с этим складом');
      return;
    }

    try {
      Loading.show('Подключение к складу...');
      
      // Симуляция подключения
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Сохранение выбранного склада в состоянии приложения
      AppState.currentWarehouse = warehouse;
      
      // Обновление breadcrumb
      this.updateBreadcrumb(warehouse.name);
      
      Toast.success('Успешно', `Подключено к складу "${warehouse.name}"`);
      
      // Переход к дашборду склада
      if (window.App && window.App.loadView) {
        window.App.loadView('inventory');
      }
      
    } catch (error) {
      console.error('Select warehouse error:', error);
      Toast.error('Ошибка', 'Не удалось подключиться к складу');
    } finally {
      Loading.hide();
    }
  }

  // Обновление breadcrumb
  updateBreadcrumb(warehouseName) {
    const breadcrumb = DOM.get('breadcrumb');
    if (breadcrumb) {
      breadcrumb.innerHTML = `
        <span class="breadcrumb-item">
          <a href="#" class="breadcrumb-link" data-view="warehouses">
            <i class="fas fa-warehouse"></i>
            Склады
          </a>
        </span>
        <i class="fas fa-chevron-right breadcrumb-separator"></i>
        <span class="breadcrumb-item active">${warehouseName}</span>
      `;

      // Обработчик для навигации назад
      const breadcrumbLink = breadcrumb.querySelector('.breadcrumb-link');
      if (breadcrumbLink) {
        Events.on(breadcrumbLink, 'click', (e) => {
          e.preventDefault();
          AppState.currentWarehouse = null;
          if (window.App && window.App.loadView) {
            window.App.loadView('warehouses');
          }
        });
      }
    }
  }

  // Показать модальное окно добавления склада
  showAddWarehouseModal() {
    const content = `
      <form id="add-warehouse-form">
        <div class="form-group">
          <label for="warehouse-name" class="form-label">Название склада *</label>
          <input 
            type="text" 
            id="warehouse-name" 
            name="name" 
            class="form-input" 
            placeholder="Введите название склада"
            required
          >
          <div class="form-error" id="warehouse-name-error"></div>
        </div>

        <div class="form-group">
          <label for="warehouse-location" class="form-label">Местоположение *</label>
          <input 
            type="text" 
            id="warehouse-location" 
            name="location" 
            class="form-input" 
            placeholder="Город или регион"
            required
          >
          <div class="form-error" id="warehouse-location-error"></div>
        </div>

        <div class="form-group">
          <label for="warehouse-address" class="form-label">Адрес</label>
          <textarea 
            id="warehouse-address" 
            name="address" 
            class="form-input" 
            placeholder="Полный адрес склада"
            rows="2"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="warehouse-capacity" class="form-label">Вместимость</label>
          <input 
            type="number" 
            id="warehouse-capacity" 
            name="capacity" 
            class="form-input" 
            placeholder="Максимальная вместимость"
            min="1"
          >
        </div>

        <div class="form-group">
          <label for="warehouse-description" class="form-label">Описание</label>
          <textarea 
            id="warehouse-description" 
            name="description" 
            class="form-input" 
            placeholder="Дополнительная информация"
            rows="3"
          ></textarea>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn btn-secondary" id="cancel-add-warehouse">Отмена</button>
      <button class="btn btn-primary" id="save-warehouse">
        <i class="fas fa-save"></i>
        Сохранить
      </button>
    `;

    const modalId = Modal.show({
      title: '<i class="fas fa-plus"></i> Добавить новый склад',
      content,
      footer,
      size: 'md'
    });

    // Обработчики кнопок
    Events.on(DOM.get('cancel-add-warehouse'), 'click', () => Modal.hide(modalId));
    Events.on(DOM.get('save-warehouse'), 'click', () => this.saveWarehouse(modalId));
  }

  // Сохранение нового склада
  async saveWarehouse(modalId) {
    const form = DOM.get('add-warehouse-form');
    const formData = FormUtils.getData(form);
    
    FormUtils.clearErrors(form);

    // Валидация
    let isValid = true;
    if (!Validators.required(formData.name)) {
      FormUtils.showError('warehouse-name', 'Введите название склада');
      isValid = false;
    }

    if (!Validators.required(formData.location)) {
      FormUtils.showError('warehouse-location', 'Введите местоположение');
      isValid = false;
    }

    if (!isValid) return;

    try {
      const saveBtn = DOM.get('save-warehouse');
      DOM.addClass(saveBtn, 'loading');
      saveBtn.disabled = true;

      // Симуляция сохранения
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Создание нового склада
      const newWarehouse = {
        id: 'warehouse_' + Date.now(),
        name: formData.name,
        location: formData.location,
        address: formData.address || '',
        description: formData.description || '',
        capacity: parseInt(formData.capacity) || 1000,
        is_active: true,
        manager_id: AppState.currentUser?.id,
        stats: {
          total_products: 0,
          movements_today: 0,
          critical_stock: 0,
          last_activity: DateUtils.now()
        }
      };

      this.warehouses.push(newWarehouse);
      
      Modal.hide(modalId);
      Toast.success('Успешно', 'Склад успешно добавлен');
      
      // Обновить отображение
      if (window.App && window.App.currentView === 'warehouses') {
        window.App.loadView('warehouses');
      }

    } catch (error) {
      console.error('Save warehouse error:', error);
      Toast.error('Ошибка', 'Не удалось сохранить склад');
    }
  }

  // Получение склада по ID
  getWarehouseById(id) {
    return this.warehouses.find(w => w.id === id);
  }

  // Получение доступных складов для текущего пользователя
  getAccessibleWarehouses() {
    if (!window.Auth) return this.warehouses;
    
    return this.warehouses.filter(warehouse => 
      window.Auth.hasWarehouseAccess(warehouse.id)
    );
  }
}

// Экспорт для использования в других модулях
window.WarehouseManager = WarehouseManager;