/* ========================================
   COMPONENTS MODULE
   UI компоненты: Toast, Modal, Loading и др.
======================================== */

// ========================================
// TOAST NOTIFICATIONS
// ========================================

class ToastManager {
  constructor() {
    this.container = DOM.get('toast-container');
    this.toasts = new Map();
    this.defaultDuration = 5000;
    
    this.init();
  }

  init() {
    // Создать контейнер, если его нет
    if (!this.container) {
      this.container = DOM.create('div', 'toast-container');
      this.container.id = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  // Показать уведомление
  show(type = 'info', title = '', message = '', duration = null) {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    const toast = this.createToast(id, type, title, message);
    
    this.container.appendChild(toast);
    this.toasts.set(id, toast);

    // Анимация появления
    requestAnimationFrame(() => {
      DOM.addClass(toast, 'active');
    });

    // Автоматическое скрытие
    const hideAfter = duration !== null ? duration : this.defaultDuration;
    if (hideAfter > 0) {
      this.startProgressBar(toast, hideAfter);
      setTimeout(() => this.hide(id), hideAfter);
    }

    return id;
  }

  // Создать элемент уведомления
  createToast(id, type, title, message) {
    const toast = DOM.create('div', `toast toast-${type}`);
    toast.id = id;

    const iconMap = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };

    toast.innerHTML = `
      <div class="toast-header">
        <div class="toast-title">
          <i class="${iconMap[type] || iconMap.info}"></i>
          ${title}
        </div>
        <button class="toast-close" type="button">
          <i class="fas fa-times"></i>
        </button>
      </div>
      ${message ? `<div class="toast-body">${message}</div>` : ''}
      <div class="toast-progress"></div>
    `;

    // Обработчик закрытия
    const closeBtn = toast.querySelector('.toast-close');
    Events.on(closeBtn, 'click', () => this.hide(id));

    return toast;
  }

  // Запустить прогресс-бар
  startProgressBar(toast, duration) {
    const progressBar = toast.querySelector('.toast-progress');
    if (progressBar) {
      progressBar.style.width = '100%';
      progressBar.style.transition = `width ${duration}ms linear`;
      
      requestAnimationFrame(() => {
        progressBar.style.width = '0%';
      });
    }
  }

  // Скрыть уведомление
  hide(id) {
    const toast = this.toasts.get(id);
    if (!toast) return;

    DOM.addClass(toast, 'removing');
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      this.toasts.delete(id);
    }, 300);
  }

  // Скрыть все уведомления
  hideAll() {
    this.toasts.forEach((toast, id) => {
      this.hide(id);
    });
  }

  // Утилитарные методы
  success(title, message, duration) {
    return this.show('success', title, message, duration);
  }

  error(title, message, duration) {
    return this.show('error', title, message, duration);
  }

  warning(title, message, duration) {
    return this.show('warning', title, message, duration);
  }

  info(title, message, duration) {
    return this.show('info', title, message, duration);
  }
}

// ========================================
// MODAL MANAGER
// ========================================

class ModalManager {
  constructor() {
    this.container = DOM.get('modal-container');
    this.activeModal = null;
    this.modals = new Map();
    
    this.init();
  }

  init() {
    // Создать контейнер, если его нет
    if (!this.container) {
      this.container = DOM.create('div', 'modal-container');
      this.container.id = 'modal-container';
      document.body.appendChild(this.container);
    }

    // Закрытие по Escape
    Events.on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.hide(this.activeModal.id);
      }
    });
  }

  // Показать модальное окно
  show(options = {}) {
    const id = options.id || 'modal_' + Date.now();
    const modal = this.createModal(id, options);
    
    this.container.appendChild(modal);
    this.modals.set(id, modal);

    // Показать контейнер и модал
    DOM.addClass(this.container, 'active');
    
    setTimeout(() => {
      const backdrop = modal.querySelector('.modal-backdrop');
      const modalElement = modal.querySelector('.modal');
      
      DOM.addClass(backdrop, 'active');
      DOM.addClass(modalElement, 'active');
    }, 10);

    this.activeModal = { id, modal };

    // Заблокировать прокрутку body
    document.body.style.overflow = 'hidden';

    return id;
  }

  // Создать модальное окно
  createModal(id, options) {
    const {
      title = 'Модальное окно',
      content = '',
      size = 'md',
      closable = true,
      footer = null,
      onClose = null
    } = options;

    const wrapper = DOM.create('div');
    wrapper.id = id;

    wrapper.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal modal-${size}">
        <div class="modal-header">
          <h2 class="modal-title">${title}</h2>
          ${closable ? '<button class="modal-close" type="button"><i class="fas fa-times"></i></button>' : ''}
        </div>
        <div class="modal-body">
          ${content}
        </div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>
    `;

    // Обработчики закрытия
    if (closable) {
      const closeBtn = wrapper.querySelector('.modal-close');
      const backdrop = wrapper.querySelector('.modal-backdrop');
      
      Events.on(closeBtn, 'click', () => this.hide(id));
      Events.on(backdrop, 'click', () => this.hide(id));
    }

    // Предотвратить закрытие при клике на модал
    const modalElement = wrapper.querySelector('.modal');
    Events.on(modalElement, 'click', (e) => e.stopPropagation());

    return wrapper;
  }

  // Скрыть модальное окно
  hide(id) {
    const modal = this.modals.get(id);
    if (!modal) return;

    const backdrop = modal.querySelector('.modal-backdrop');
    const modalElement = modal.querySelector('.modal');

    DOM.removeClass(backdrop, 'active');
    DOM.removeClass(modalElement, 'active');

    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
      this.modals.delete(id);

      // Если это последнее модальное окно
      if (this.modals.size === 0) {
        DOM.removeClass(this.container, 'active');
        document.body.style.overflow = '';
        this.activeModal = null;
      } else {
        // Найти следующее активное модальное окно
        const lastModal = Array.from(this.modals.values()).pop();
        this.activeModal = { 
          id: Array.from(this.modals.keys()).pop(), 
          modal: lastModal 
        };
      }
    }, 300);
  }

  // Подтверждение действия
  confirm(options = {}) {
    const {
      title = 'Подтверждение',
      message = 'Вы уверены?',
      confirmText = 'Да',
      cancelText = 'Отмена',
      confirmClass = 'btn-error',
      onConfirm = null,
      onCancel = null
    } = options;

    return new Promise((resolve) => {
      const footer = `
        <button class="btn btn-secondary" id="modal-cancel">${cancelText}</button>
        <button class="btn ${confirmClass}" id="modal-confirm">${confirmText}</button>
      `;

      const modalId = this.show({
        title,
        content: `<p>${message}</p>`,
        footer,
        size: 'sm'
      });

      // Обработчики кнопок
      const confirmBtn = document.getElementById('modal-confirm');
      const cancelBtn = document.getElementById('modal-cancel');

      Events.on(confirmBtn, 'click', () => {
        this.hide(modalId);
        if (onConfirm) onConfirm();
        resolve(true);
      });

      Events.on(cancelBtn, 'click', () => {
        this.hide(modalId);
        if (onCancel) onCancel();
        resolve(false);
      });
    });
  }

  // Простое уведомление
  alert(title, message) {
    return new Promise((resolve) => {
      const footer = '<button class="btn btn-primary" id="modal-ok">OK</button>';

      const modalId = this.show({
        title,
        content: `<p>${message}</p>`,
        footer,
        size: 'sm'
      });

      const okBtn = document.getElementById('modal-ok');
      Events.on(okBtn, 'click', () => {
        this.hide(modalId);
        resolve();
      });
    });
  }
}

// ========================================
// LOADING MANAGER
// ========================================

class LoadingManager {
  constructor() {
    this.overlay = null;
    this.isVisible = false;
  }

  // Показать индикатор загрузки
  show(message = 'Загрузка...') {
    if (this.isVisible) return;

    this.overlay = DOM.create('div', 'loading-overlay');
    this.overlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">${message}</p>
      </div>
    `;

    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(2px);
    `;

    document.body.appendChild(this.overlay);
    this.isVisible = true;

    // Анимация появления
    requestAnimationFrame(() => {
      this.overlay.style.opacity = '1';
    });
  }

  // Скрыть индикатор загрузки
  hide() {
    if (!this.isVisible || !this.overlay) return;

    this.overlay.style.opacity = '0';
    
    setTimeout(() => {
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }
      this.overlay = null;
      this.isVisible = false;
    }, 300);
  }

  // Показать на определенное время
  showFor(duration, message) {
    this.show(message);
    setTimeout(() => this.hide(), duration);
  }
}

// ========================================
// DROPDOWN MANAGER
// ========================================

class DropdownManager {
  constructor() {
    this.activeDropdown = null;
    this.init();
  }

  init() {
    // Закрытие при клике вне dropdown
    Events.on(document, 'click', (e) => {
      if (this.activeDropdown && !this.activeDropdown.contains(e.target)) {
        this.hide();
      }
    });

    // Закрытие по Escape
    Events.on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && this.activeDropdown) {
        this.hide();
      }
    });
  }

  // Переключить dropdown
  toggle(element) {
    if (typeof element === 'string') element = DOM.get(element);
    
    if (this.activeDropdown === element) {
      this.hide();
    } else {
      this.show(element);
    }
  }

  // Показать dropdown
  show(element) {
    if (typeof element === 'string') element = DOM.get(element);
    
    this.hide(); // Скрыть предыдущий
    
    DOM.addClass(element, 'active');
    this.activeDropdown = element;
  }

  // Скрыть dropdown
  hide() {
    if (this.activeDropdown) {
      DOM.removeClass(this.activeDropdown, 'active');
      this.activeDropdown = null;
    }
  }
}

// ========================================
// SIDEBAR MANAGER
// ========================================

class SidebarManager {
  constructor() {
    this.sidebar = DOM.get('app-sidebar');
    this.menuToggle = DOM.get('menu-toggle');
    this.isCollapsed = false;
    
    this.init();
  }

  init() {
    if (this.menuToggle) {
      Events.on(this.menuToggle, 'click', () => this.toggle());
    }

    // Закрытие на мобильных при клике вне сайдбара
    Events.on(document, 'click', (e) => {
      if (window.innerWidth <= 1024 && 
          this.sidebar && 
          !this.sidebar.contains(e.target) && 
          !this.menuToggle.contains(e.target) && 
          this.sidebar.classList.contains('active')) {
        this.hide();
      }
    });
  }

  // Переключить сайдбар
  toggle() {
    if (window.innerWidth <= 1024) {
      // На мобильных - overlay режим
      DOM.toggleClass(this.sidebar, 'active');
    } else {
      // На десктопе - collapse режим
      this.isCollapsed = !this.isCollapsed;
      DOM.toggleClass(this.sidebar, 'collapsed');
      DOM.toggleClass(document.body, 'sidebar-collapsed');
    }
  }

  // Показать сайдбар
  show() {
    DOM.addClass(this.sidebar, 'active');
  }

  // Скрыть сайдбар
  hide() {
    DOM.removeClass(this.sidebar, 'active');
  }
}

// ========================================
// ИНИЦИАЛИЗАЦИЯ КОМПОНЕНТОВ
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Инициализация менеджеров компонентов
  window.Toast = new ToastManager();
  window.Modal = new ModalManager();
  window.Loading = new LoadingManager();
  window.Dropdown = new DropdownManager();
  window.Sidebar = new SidebarManager();

  // Обработчик для user menu dropdown
  const userMenuTrigger = DOM.get('user-menu-trigger');
  if (userMenuTrigger) {
    Events.on(userMenuTrigger, 'click', (e) => {
      e.stopPropagation();
      window.Dropdown.toggle('user-menu');
    });
  }

  // Настройка навигационных ссылок
  const navLinks = DOM.getAll('.nav-link[data-view]');
  navLinks.forEach(link => {
    Events.on(link, 'click', (e) => {
      e.preventDefault();
      
      // Обновить активный пункт меню
      DOM.getAll('.nav-item').forEach(item => DOM.removeClass(item, 'active'));
      DOM.addClass(link.parentElement, 'active');
      
      // Загрузить view
      const viewName = link.dataset.view;
      if (window.App && window.App.loadView) {
        window.App.loadView(viewName);
      }
      
      // Скрыть сайдбар на мобильных
      if (window.innerWidth <= 1024) {
        window.Sidebar.hide();
      }
    });
  });
});

// Экспорт классов для использования в других модулях
window.ToastManager = ToastManager;
window.ModalManager = ModalManager;
window.LoadingManager = LoadingManager;
window.DropdownManager = DropdownManager;
window.SidebarManager = SidebarManager;