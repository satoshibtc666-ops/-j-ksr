/* ========================================
   INVENTORY MODULE
   Модуль управления товарами и инвентарем
======================================== */

class InventoryManager {
  constructor() {
    this.categories = [];
    this.products = [];
    this.inventory = [];
    this.currentCategory = null;
    this.searchQuery = '';
    this.sortBy = 'name';
    this.sortOrder = 'asc';
    
    this.init();
  }

  // Инициализация модуля
  async init() {
    try {
      await this.loadData();
    } catch (error) {
      console.error('Inventory init error:', error);
      Toast.error('Ошибка', 'Не удалось загрузить данные товаров');
    }
  }

  // Загрузка данных
  async loadData() {
    const [categories, products, inventory] = await Promise.all([
      this.loadCategories(),
      this.loadProducts(),
      this.loadInventory()
    ]);

    this.categories = categories;
    this.products = products;
    this.inventory = inventory;
  }

  // Загрузка категорий (демо-данные)
  async loadCategories() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [
      {
        id: 'solar_panels',
        name: 'Солнечные панели',
        icon: 'fas fa-solar-panel',
        color: '#007AFF',
        description: 'Фотоэлектрические модули различной мощности',
        sort_order: 1
      },
      {
        id: 'inverters',
        name: 'Инверторы',
        icon: 'fas fa-microchip',
        color: '#00C896',
        description: 'Преобразователи постоянного тока в переменный',
        sort_order: 2
      },
      {
        id: 'batteries',
        name: 'АКБ / BMS',
        icon: 'fas fa-battery-half',
        color: '#FF9500',
        description: 'Аккумуляторные батареи и системы управления',
        sort_order: 3
      },
      {
        id: 'cables',
        name: 'Солнечный кабель',
        icon: 'fas fa-plug',
        color: '#DC3545',
        description: 'Специализированные кабели для солнечных установок',
        sort_order: 4
      }
    ];
  }

  // Загрузка товаров (демо-данные)
  async loadProducts() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      // Солнечные панели
      {
        id: 'trina_620w',
        name: 'Trina 620Вт',
        category_id: 'solar_panels',
        brand: 'Trina Solar',
        model: 'TSM-620W',
        specifications: '620Вт, монокристалл, 166мм ячейки',
        unit: 'шт',
        sku: 'TS-620-MONO',
        description: 'Высокоэффективная солнечная панель с мощностью 620Вт',
        is_active: true,
        critical_stock: 50
      },
      {
        id: 'jinko_615w',
        name: 'Jinko 615Вт',
        category_id: 'solar_panels',
        brand: 'Jinko Solar',
        model: 'JKM-615W',
        specifications: '615Вт, монокристалл, Tiger Pro серия',
        unit: 'шт',
        sku: 'JK-615-TIGER',
        description: 'Солнечная панель премиум класса Tiger Pro',
        is_active: true,
        critical_stock: 50
      },
      
      // Инверторы
      {
        id: 'huawei_10ktl',
        name: 'Huawei Sun2000-10KTL',
        category_id: 'inverters',
        brand: 'Huawei',
        model: 'SUN2000-10KTL-M1',
        specifications: '10кВт, 3-фазный, с оптимизаторами',
        unit: 'шт',
        sku: 'HW-10K-M1',
        description: 'Трехфазный сетевой инвертор с встроенными оптимизаторами',
        is_active: true,
        critical_stock: 10
      },
      {
        id: 'solis_8k',
        name: 'Solis 8K-5G',
        category_id: 'inverters',
        brand: 'Solis',
        model: '8K-5G',
        specifications: '8кВт, 3-фазный, Wi-Fi мониторинг',
        unit: 'шт',
        sku: 'SOL-8K-5G',
        description: 'Компактный трехфазный инвертор с Wi-Fi',
        is_active: true,
        critical_stock: 10
      },
      
      // Батареи
      {
        id: 'pylontech_us3000',
        name: 'Pylontech US3000',
        category_id: 'batteries',
        brand: 'Pylontech',
        model: 'US3000C',
        specifications: '3.5кВт*ч, LiFePO4, 48В',
        unit: 'шт',
        sku: 'PT-US3000C',
        description: 'Литий-железо-фосфатная батарея для домашних систем',
        is_active: true,
        critical_stock: 5
      },
      {
        id: 'pylontech_us5000',
        name: 'Pylontech US5000',
        category_id: 'batteries',
        brand: 'Pylontech',
        model: 'US5000',
        specifications: '4.8кВт*ч, LiFePO4, 48В',
        unit: 'шт',
        sku: 'PT-US5000',
        description: 'Увеличенная емкость батареи US серии',
        is_active: true,
        critical_stock: 5
      },
      
      // Кабели
      {
        id: 'pv1f_6mm_black',
        name: 'Кабель PV1-F 6мм² черный',
        category_id: 'cables',
        brand: 'Generic',
        model: 'PV1-F 6mm²',
        specifications: '6мм², медь, UV стойкий, -40°C до +90°C',
        unit: 'м',
        sku: 'PV1F-6-BLK',
        description: 'Специализированный кабель для солнечных панелей',
        is_active: true,
        critical_stock: 100
      },
      {
        id: 'pv1f_4mm_red',
        name: 'Кабель PV1-F 4мм² красный',
        category_id: 'cables',
        brand: 'Generic',
        model: 'PV1-F 4mm²',
        specifications: '4мм², медь, UV стойкий, -40°C до +90°C',
        unit: 'м',
        sku: 'PV1F-4-RED',
        description: 'Кабель для подключения солнечных панелей',
        is_active: true,
        critical_stock: 100
      }
    ];
  }

  // Загрузка остатков на складе
  async loadInventory() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (!AppState.currentWarehouse) return [];
    
    // Демо-данные остатков
    return [
      { product_id: 'trina_620w', warehouse_id: AppState.currentWarehouse.id, quantity: 150, reserved_quantity: 20 },
      { product_id: 'jinko_615w', warehouse_id: AppState.currentWarehouse.id, quantity: 85, reserved_quantity: 15 },
      { product_id: 'huawei_10ktl', warehouse_id: AppState.currentWarehouse.id, quantity: 25, reserved_quantity: 3 },
      { product_id: 'solis_8k', warehouse_id: AppState.currentWarehouse.id, quantity: 18, reserved_quantity: 2 },
      { product_id: 'pylontech_us3000', warehouse_id: AppState.currentWarehouse.id, quantity: 32, reserved_quantity: 8 },
      { product_id: 'pylontech_us5000', warehouse_id: AppState.currentWarehouse.id, quantity: 28, reserved_quantity: 5 },
      { product_id: 'pv1f_6mm_black', warehouse_id: AppState.currentWarehouse.id, quantity: 2500, reserved_quantity: 200 },
      { product_id: 'pv1f_4mm_red', warehouse_id: AppState.currentWarehouse.id, quantity: 1800, reserved_quantity: 150 }
    ];
  }

  // Рендеринг дашборда товаров
  renderInventoryDashboard() {
    return `
      <div class="inventory-dashboard">
        ${this.renderDashboardHeader()}
        ${this.renderCategoryTabs()}
        ${this.renderSearchAndFilters()}
        ${this.renderProductsGrid()}
      </div>
    `;
  }

  // Рендеринг заголовка дашборда
  renderDashboardHeader() {
    const warehouse = AppState.currentWarehouse;
    const totalProducts = this.getFilteredProducts().length;
    const criticalCount = this.getCriticalStockCount();
    
    return `
      <div class="dashboard-header">
        <div class="warehouse-info">
          <h1>
            <i class="fas fa-boxes"></i>
            Товары на складе
          </h1>
          <p class="warehouse-name">
            <i class="fas fa-warehouse"></i>
            ${warehouse.name}
          </p>
        </div>
        
        <div class="dashboard-stats">
          <div class="stat-card">
            <div class="stat-value">${NumberUtils.format(totalProducts)}</div>
            <div class="stat-label">Наименований</div>
          </div>
          <div class="stat-card ${criticalCount > 0 ? 'stat-warning' : ''}">
            <div class="stat-value">${criticalCount}</div>
            <div class="stat-label">Критические остатки</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${this.getTotalValue()}</div>
            <div class="stat-label">Общий остаток</div>
          </div>
        </div>
        
        <div class="dashboard-actions">
          <button class="btn btn-secondary" id="export-inventory-btn">
            <i class="fas fa-download"></i>
            Экспорт
          </button>
          <button class="btn btn-primary" id="add-product-btn">
            <i class="fas fa-plus"></i>
            Добавить товар
          </button>
        </div>
      </div>
    `;
  }

  // Рендеринг табов категорий
  renderCategoryTabs() {
    return `
      <div class="category-tabs">
        <button class="category-tab ${!this.currentCategory ? 'active' : ''}" data-category="">
          <i class="fas fa-th"></i>
          <span>Все категории</span>
          <span class="category-count">${this.products.length}</span>
        </button>
        ${this.categories.map(category => `
          <button class="category-tab ${this.currentCategory === category.id ? 'active' : ''}" 
                  data-category="${category.id}">
            <i class="${category.icon}"></i>
            <span>${category.name}</span>
            <span class="category-count">${this.getProductCountByCategory(category.id)}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  // Рендеринг поиска и фильтров
  renderSearchAndFilters() {
    return `
      <div class="search-filters">
        <div class="search-box">
          <div class="search-input-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input 
              type="text" 
              id="product-search" 
              class="search-input" 
              placeholder="Поиск товаров по названию, бренду или артикулу..."
              value="${this.searchQuery}"
            >
            ${this.searchQuery ? `
              <button class="search-clear" id="clear-search">
                <i class="fas fa-times"></i>
              </button>
            ` : ''}
          </div>
        </div>
        
        <div class="filter-controls">
          <div class="sort-control">
            <label for="sort-by" class="sort-label">Сортировка:</label>
            <select id="sort-by" class="sort-select">
              <option value="name" ${this.sortBy === 'name' ? 'selected' : ''}>По названию</option>
              <option value="brand" ${this.sortBy === 'brand' ? 'selected' : ''}>По бренду</option>
              <option value="quantity" ${this.sortBy === 'quantity' ? 'selected' : ''}>По остатку</option>
              <option value="critical" ${this.sortBy === 'critical' ? 'selected' : ''}>Критические остатки</option>
            </select>
            <button class="sort-order-btn" id="sort-order-btn" title="Изменить порядок сортировки">
              <i class="fas ${this.sortOrder === 'asc' ? 'fa-sort-amount-up' : 'fa-sort-amount-down'}"></i>
            </button>
          </div>
          
          <div class="view-controls">
            <button class="view-btn active" data-view="grid" title="Сетка">
              <i class="fas fa-th"></i>
            </button>
            <button class="view-btn" data-view="list" title="Список">
              <i class="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Рендеринг сетки товаров
  renderProductsGrid() {
    const filteredProducts = this.getFilteredProducts();
    
    if (filteredProducts.length === 0) {
      return `
        <div class="empty-state">
          <i class="fas fa-box-open"></i>
          <h3>Товары не найдены</h3>
          <p>Попробуйте изменить критерии поиска или добавить новые товары</p>
          <button class="btn btn-primary" id="add-first-product-btn">
            <i class="fas fa-plus"></i>
            Добавить первый товар
          </button>
        </div>
      `;
    }
    
    return `
      <div class="products-grid">
        ${filteredProducts.map(product => this.renderProductCard(product)).join('')}
      </div>
    `;
  }

  // Рендеринг карточки товара
  renderProductCard(product) {
    const inventory = this.getInventoryForProduct(product.id);
    const availableQty = inventory ? inventory.quantity - inventory.reserved_quantity : 0;
    const isCritical = availableQty <= product.critical_stock;
    const category = this.categories.find(c => c.id === product.category_id);
    
    return `
      <div class="product-card ${isCritical ? 'product-critical' : ''}" data-product-id="${product.id}">
        <div class="product-card-header">
          <div class="product-category" style="background-color: ${category?.color || '#666'}20; color: ${category?.color || '#666'}">
            <i class="${category?.icon || 'fas fa-box'}"></i>
            ${category?.name || 'Без категории'}
          </div>
          
          <div class="product-actions">
            <button class="action-btn" title="Редактировать" data-action="edit" data-product-id="${product.id}">
              <i class="fas fa-edit"></i>
            </button>
            <div class="dropdown">
              <button class="action-btn dropdown-toggle" title="Еще действия">
                <i class="fas fa-ellipsis-v"></i>
              </button>
              <div class="dropdown-menu">
                <a href="#" class="dropdown-item" data-action="history" data-product-id="${product.id}">
                  <i class="fas fa-history"></i>
                  История движений
                </a>
                <a href="#" class="dropdown-item" data-action="transfer" data-product-id="${product.id}">
                  <i class="fas fa-exchange-alt"></i>
                  Перемещение
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item text-danger" data-action="archive" data-product-id="${product.id}">
                  <i class="fas fa-archive"></i>
                  Архивировать
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="product-card-body">
          <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-brand">${product.brand} ${product.model}</p>
            <p class="product-specs">${product.specifications}</p>
          </div>

          <div class="product-stock">
            <div class="stock-display ${isCritical ? 'stock-critical' : availableQty === 0 ? 'stock-empty' : 'stock-good'}">
              <div class="stock-value">
                ${NumberUtils.format(availableQty)} ${product.unit}
              </div>
              <div class="stock-label">
                ${isCritical ? 'Критический остаток' : availableQty === 0 ? 'Нет в наличии' : 'В наличии'}
              </div>
            </div>
            
            ${inventory && inventory.reserved_quantity > 0 ? `
              <div class="reserved-stock">
                <i class="fas fa-lock"></i>
                Зарезервировано: ${NumberUtils.format(inventory.reserved_quantity)} ${product.unit}
              </div>
            ` : ''}
          </div>
        </div>

        <div class="product-card-footer">
          <div class="operation-buttons">
            <button class="btn btn-success btn-operation" data-operation="add" data-product-id="${product.id}">
              <i class="fas fa-plus"></i>
              Поступление
            </button>
            <button class="btn btn-warning btn-operation" data-operation="subtract" data-product-id="${product.id}" ${availableQty === 0 ? 'disabled' : ''}>
              <i class="fas fa-minus"></i>
              Списание
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Получение отфильтрованных товаров
  getFilteredProducts() {
    let products = [...this.products];
    
    // Фильтр по категории
    if (this.currentCategory) {
      products = products.filter(p => p.category_id === this.currentCategory);
    }
    
    // Поиск
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.model.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        TextUtils.fuzzySearch(query, p.name + ' ' + p.brand + ' ' + p.model)
      );
    }
    
    // Сортировка
    products.sort((a, b) => {
      let aValue, bValue;
      
      switch (this.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'brand':
          aValue = a.brand.toLowerCase();
          bValue = b.brand.toLowerCase();
          break;
        case 'quantity':
          const aInventory = this.getInventoryForProduct(a.id);
          const bInventory = this.getInventoryForProduct(b.id);
          aValue = aInventory ? aInventory.quantity : 0;
          bValue = bInventory ? bInventory.quantity : 0;
          break;
        case 'critical':
          const aAvailable = this.getAvailableQuantity(a.id);
          const bAvailable = this.getAvailableQuantity(b.id);
          aValue = aAvailable <= a.critical_stock ? 1 : 0;
          bValue = bAvailable <= b.critical_stock ? 1 : 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (this.sortOrder === 'desc') {
        [aValue, bValue] = [bValue, aValue];
      }
      
      if (typeof aValue === 'string') {
        return aValue.localeCompare(bValue);
      }
      return aValue - bValue;
    });
    
    return products;
  }

  // Получение остатков для товара
  getInventoryForProduct(productId) {
    return this.inventory.find(inv => 
      inv.product_id === productId && 
      inv.warehouse_id === AppState.currentWarehouse?.id
    );
  }

  // Получение доступного количества
  getAvailableQuantity(productId) {
    const inventory = this.getInventoryForProduct(productId);
    return inventory ? inventory.quantity - inventory.reserved_quantity : 0;
  }

  // Получение количества товаров по категории
  getProductCountByCategory(categoryId) {
    return this.products.filter(p => p.category_id === categoryId).length;
  }

  // Получение количества товаров с критическими остатками
  getCriticalStockCount() {
    return this.products.filter(product => {
      const availableQty = this.getAvailableQuantity(product.id);
      return availableQty <= product.critical_stock;
    }).length;
  }

  // Получение общего количества остатков
  getTotalValue() {
    const total = this.inventory.reduce((sum, inv) => sum + inv.quantity, 0);
    return NumberUtils.abbreviate(total);
  }

  // Настройка обработчиков событий
  setupEventListeners() {
    // Переключение категорий
    const categoryTabs = DOM.getAll('.category-tab');
    categoryTabs.forEach(tab => {
      Events.on(tab, 'click', () => {
        const categoryId = tab.dataset.category;
        this.setCurrentCategory(categoryId || null);
      });
    });

    // Поиск
    const searchInput = DOM.get('product-search');
    if (searchInput) {
      Events.on(searchInput, 'input', (e) => {
        this.setSearchQuery(e.target.value);
      });
    }

    // Очистка поиска
    const clearSearch = DOM.get('clear-search');
    if (clearSearch) {
      Events.on(clearSearch, 'click', () => {
        this.setSearchQuery('');
      });
    }

    // Сортировка
    const sortSelect = DOM.get('sort-by');
    if (sortSelect) {
      Events.on(sortSelect, 'change', (e) => {
        this.setSortBy(e.target.value);
      });
    }

    const sortOrderBtn = DOM.get('sort-order-btn');
    if (sortOrderBtn) {
      Events.on(sortOrderBtn, 'click', () => {
        this.toggleSortOrder();
      });
    }

    // Операции с товарами
    const operationButtons = DOM.getAll('.btn-operation');
    operationButtons.forEach(btn => {
      Events.on(btn, 'click', (e) => {
        const operation = btn.dataset.operation;
        const productId = btn.dataset.productId;
        this.showOperationModal(operation, productId);
      });
    });

    // Действия с товарами
    const actionButtons = DOM.getAll('[data-action]');
    actionButtons.forEach(btn => {
      Events.on(btn, 'click', (e) => {
        e.preventDefault();
        const action = btn.dataset.action;
        const productId = btn.dataset.productId;
        this.handleProductAction(action, productId);
      });
    });

    // Добавление товара
    const addProductBtn = DOM.get('add-product-btn') || DOM.get('add-first-product-btn');
    if (addProductBtn) {
      Events.on(addProductBtn, 'click', () => {
        this.showAddProductModal();
      });
    }

    // Экспорт
    const exportBtn = DOM.get('export-inventory-btn');
    if (exportBtn) {
      Events.on(exportBtn, 'click', () => {
        this.showExportModal();
      });
    }
  }

  // Установка текущей категории
  setCurrentCategory(categoryId) {
    this.currentCategory = categoryId;
    this.refreshView();
  }

  // Установка поискового запроса
  setSearchQuery(query) {
    this.searchQuery = query;
    this.refreshView();
  }

  // Установка сортировки
  setSortBy(sortBy) {
    this.sortBy = sortBy;
    this.refreshView();
  }

  // Переключение порядка сортировки
  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.refreshView();
  }

  // Обновление представления
  refreshView() {
    if (window.App && window.App.currentView === 'inventory') {
      window.App.loadView('inventory');
    }
  }

  // Показать модальное окно операции
  showOperationModal(operation, productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const inventory = this.getInventoryForProduct(productId);
    const availableQty = inventory ? inventory.quantity - inventory.reserved_quantity : 0;

    const isAddition = operation === 'add';
    const title = isAddition ? 'Поступление товара' : 'Списание товара';
    const icon = isAddition ? 'fa-plus' : 'fa-minus';
    const buttonClass = isAddition ? 'btn-success' : 'btn-warning';

    const content = `
      <div class="operation-modal">
        <div class="product-summary">
          <h4>${product.name}</h4>
          <p class="text-muted">${product.brand} ${product.model}</p>
          <div class="current-stock">
            Текущий остаток: <strong>${NumberUtils.format(availableQty)} ${product.unit}</strong>
          </div>
        </div>

        <form id="operation-form">
          <div class="form-group">
            <label for="operation-quantity" class="form-label">
              Количество ${isAddition ? 'поступления' : 'списания'} *
            </label>
            <div class="quantity-input-group">
              <input 
                type="number" 
                id="operation-quantity" 
                name="quantity" 
                class="form-input" 
                placeholder="Введите количество"
                min="1"
                ${!isAddition ? `max="${availableQty}"` : ''}
                required
              >
              <span class="input-unit">${product.unit}</span>
            </div>
            ${!isAddition ? `
              <div class="form-help">
                Максимальное количество для списания: ${NumberUtils.format(availableQty)} ${product.unit}
              </div>
            ` : ''}
            <div class="form-error" id="operation-quantity-error"></div>
          </div>

          ${!isAddition ? `
            <div class="form-group">
              <label for="operation-recipient" class="form-label">Получатель *</label>
              <input 
                type="text" 
                id="operation-recipient" 
                name="recipient" 
                class="form-input" 
                placeholder="Название организации или ФИО"
                required
              >
              <div class="form-error" id="operation-recipient-error"></div>
            </div>

            <div class="form-group">
              <label for="operation-destination" class="form-label">Направление отгрузки</label>
              <input 
                type="text" 
                id="operation-destination" 
                name="destination" 
                class="form-input" 
                placeholder="Город, адрес доставки"
              >
            </div>
          ` : ''}

          <div class="form-group">
            <label for="operation-comment" class="form-label">
              ${isAddition ? 'Комментарий' : 'Примечание'}
            </label>
            <textarea 
              id="operation-comment" 
              name="comment" 
              class="form-input" 
              placeholder="${isAddition ? 'Поставщик, документы, примечания' : 'Дополнительная информация'}"
              rows="3"
            ></textarea>
          </div>

          ${isAddition ? `
            <div class="quick-presets">
              <label class="form-label">Быстрые пресеты:</label>
              <div class="preset-buttons">
                <button type="button" class="btn btn-secondary btn-small preset-btn" data-value="10">+10</button>
                <button type="button" class="btn btn-secondary btn-small preset-btn" data-value="50">+50</button>
                <button type="button" class="btn btn-secondary btn-small preset-btn" data-value="100">+100</button>
                <button type="button" class="btn btn-secondary btn-small preset-btn" data-value="500">+500</button>
              </div>
            </div>
          ` : ''}
        </form>
      </div>
    `;

    const footer = `
      <button class="btn btn-secondary" id="cancel-operation">Отмена</button>
      <button class="btn ${buttonClass}" id="confirm-operation">
        <i class="fas ${icon}"></i>
        ${isAddition ? 'Оприходовать' : 'Списать'}
      </button>
    `;

    const modalId = Modal.show({
      title: `<i class="fas ${icon}"></i> ${title}`,
      content,
      footer,
      size: 'md'
    });

    // Обработчики
    Events.on(DOM.get('cancel-operation'), 'click', () => Modal.hide(modalId));
    Events.on(DOM.get('confirm-operation'), 'click', () => {
      this.processOperation(modalId, operation, productId);
    });

    // Пресеты для поступления
    if (isAddition) {
      const presetButtons = DOM.getAll('.preset-btn');
      presetButtons.forEach(btn => {
        Events.on(btn, 'click', () => {
          const quantityInput = DOM.get('operation-quantity');
          quantityInput.value = btn.dataset.value;
          quantityInput.focus();
        });
      });
    }
  }

  // Обработка операции
  async processOperation(modalId, operation, productId) {
    const form = DOM.get('operation-form');
    const formData = FormUtils.getData(form);
    const product = this.products.find(p => p.id === productId);
    
    FormUtils.clearErrors(form);

    // Валидация
    if (!this.validateOperationForm(formData, operation, productId)) {
      return;
    }

    try {
      const confirmBtn = DOM.get('confirm-operation');
      DOM.addClass(confirmBtn, 'loading');
      confirmBtn.disabled = true;

      // Симуляция операции
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Обновление остатков
      this.updateInventory(productId, operation, parseInt(formData.quantity));

      // Создание записи о движении (в реальном приложении - API вызов)
      const movement = {
        id: 'mov_' + Date.now(),
        warehouse_id: AppState.currentWarehouse.id,
        product_id: productId,
        movement_type: operation === 'add' ? 'in' : 'out',
        quantity: parseInt(formData.quantity),
        user_id: AppState.currentUser.id,
        comment: formData.comment || '',
        recipient: formData.recipient || '',
        destination: formData.destination || '',
        remaining_stock: this.getAvailableQuantity(productId),
        movement_date: DateUtils.now()
      };

      Modal.hide(modalId);

      const operationType = operation === 'add' ? 'поступление' : 'списание';
      Toast.success(
        'Операция выполнена',
        `${TextUtils.capitalize(operationType)} товара "${product.name}" на ${NumberUtils.format(formData.quantity)} ${product.unit}`
      );

      // Обновление представления
      this.refreshView();

    } catch (error) {
      console.error('Process operation error:', error);
      Toast.error('Ошибка', 'Не удалось выполнить операцию');
    }
  }

  // Валидация формы операции
  validateOperationForm(data, operation, productId) {
    let isValid = true;

    if (!Validators.positiveInteger(data.quantity)) {
      FormUtils.showError('operation-quantity', 'Введите корректное количество');
      isValid = false;
    } else if (operation === 'subtract') {
      const availableQty = this.getAvailableQuantity(productId);
      if (parseInt(data.quantity) > availableQty) {
        FormUtils.showError('operation-quantity', `Недостаточно товара на складе (доступно: ${availableQty})`);
        isValid = false;
      }
    }

    if (operation === 'subtract' && !Validators.required(data.recipient)) {
      FormUtils.showError('operation-recipient', 'Укажите получателя товара');
      isValid = false;
    }

    return isValid;
  }

  // Обновление остатков
  updateInventory(productId, operation, quantity) {
    const inventory = this.getInventoryForProduct(productId);
    
    if (inventory) {
      if (operation === 'add') {
        inventory.quantity += quantity;
      } else {
        inventory.quantity -= quantity;
      }
      inventory.last_updated = DateUtils.now();
    } else if (operation === 'add') {
      // Создание новой записи остатков
      this.inventory.push({
        product_id: productId,
        warehouse_id: AppState.currentWarehouse.id,
        quantity: quantity,
        reserved_quantity: 0,
        last_updated: DateUtils.now()
      });
    }
  }

  // Обработка действий с товарами
  handleProductAction(action, productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    switch (action) {
      case 'edit':
        this.showEditProductModal(productId);
        break;
      case 'history':
        this.showProductHistory(productId);
        break;
      case 'transfer':
        this.showTransferModal(productId);
        break;
      case 'archive':
        this.archiveProduct(productId);
        break;
    }
  }

  // Показать модальное окно редактирования товара
  showEditProductModal(productId) {
    Toast.info('В разработке', 'Функция редактирования товаров будет доступна в следующих версиях');
  }

  // Показать историю товара
  showProductHistory(productId) {
    Toast.info('В разработке', 'История движений товара будет доступна в следующих версиях');
  }

  // Показать модальное окно перемещения
  showTransferModal(productId) {
    Toast.info('В разработке', 'Функция перемещения между складами будет доступна в следующих версиях');
  }

  // Архивирование товара
  async archiveProduct(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const confirmed = await Modal.confirm({
      title: 'Архивирование товара',
      message: `Вы уверены, что хотите архивировать товар "${product.name}"?`,
      confirmText: 'Архивировать',
      confirmClass: 'btn-warning'
    });

    if (confirmed) {
      Toast.info('В разработке', 'Функция архивирования товаров будет доступна в следующих версиях');
    }
  }

  // Показать модальное окно добавления товара
  showAddProductModal() {
    Toast.info('В разработке', 'Функция добавления новых товаров будет доступна в следующих версиях');
  }

  // Показать модальное окно экспорта
  showExportModal() {
    const content = `
      <div class="export-options">
        <div class="form-group">
          <label class="form-label">Формат экспорта</label>
          <div class="radio-group">
            <label class="radio-option">
              <input type="radio" name="export-format" value="xlsx" checked>
              <span class="radio-checkmark"></span>
              <span class="radio-label">Excel (.xlsx)</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="export-format" value="csv">
              <span class="radio-checkmark"></span>
              <span class="radio-label">CSV</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Включить в экспорт</label>
          <div class="checkbox-group">
            <label class="checkbox-option">
              <input type="checkbox" name="include-details" checked>
              <span class="checkbox-checkmark"></span>
              <span class="checkbox-label">Подробную информацию</span>
            </label>
            <label class="checkbox-option">
              <input type="checkbox" name="include-stock" checked>
              <span class="checkbox-checkmark"></span>
              <span class="checkbox-label">Данные об остатках</span>
            </label>
            <label class="checkbox-option">
              <input type="checkbox" name="include-reserved">
              <span class="checkbox-checkmark"></span>
              <span class="checkbox-label">Зарезервированные товары</span>
            </label>
          </div>
        </div>
      </div>
    `;

    const footer = `
      <button class="btn btn-secondary" id="cancel-export">Отмена</button>
      <button class="btn btn-primary" id="start-export">
        <i class="fas fa-download"></i>
        Экспортировать
      </button>
    `;

    const modalId = Modal.show({
      title: '<i class="fas fa-download"></i> Экспорт данных',
      content,
      footer,
      size: 'sm'
    });

    Events.on(DOM.get('cancel-export'), 'click', () => Modal.hide(modalId));
    Events.on(DOM.get('start-export'), 'click', async () => {
      Modal.hide(modalId);
      
      if (window.App && window.App.exportData) {
        await window.App.exportData('inventory', 'xlsx', {
          warehouse: AppState.currentWarehouse?.id,
          category: this.currentCategory,
          search: this.searchQuery
        });
      }
    });
  }
}

// Экспорт для использования в других модулях
window.InventoryManager = InventoryManager;