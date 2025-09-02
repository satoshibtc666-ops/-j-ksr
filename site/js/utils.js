/* ========================================
   UTILITY FUNCTIONS
   Общие функции для работы приложения
======================================== */

// Глобальное состояние приложения
window.AppState = {
  currentUser: null,
  currentWarehouse: null,
  isAuthenticated: false,
  theme: 'light',
  language: 'ru'
};

// Утилиты для работы с DOM
const DOM = {
  // Получение элемента по ID
  get: (id) => document.getElementById(id),
  
  // Получение элементов по селектору
  getAll: (selector) => document.querySelectorAll(selector),
  
  // Создание элемента
  create: (tag, className = '', content = '') => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
  },
  
  // Показать элемент
  show: (element) => {
    if (typeof element === 'string') element = DOM.get(element);
    if (element) element.style.display = 'block';
  },
  
  // Скрыть элемент
  hide: (element) => {
    if (typeof element === 'string') element = DOM.get(element);
    if (element) element.style.display = 'none';
  },
  
  // Переключить видимость
  toggle: (element) => {
    if (typeof element === 'string') element = DOM.get(element);
    if (element) {
      element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
  },
  
  // Добавить класс
  addClass: (element, className) => {
    if (typeof element === 'string') element = DOM.get(element);
    if (element) element.classList.add(className);
  },
  
  // Удалить класс
  removeClass: (element, className) => {
    if (typeof element === 'string') element = DOM.get(element);
    if (element) element.classList.remove(className);
  },
  
  // Переключить класс
  toggleClass: (element, className) => {
    if (typeof element === 'string') element = DOM.get(element);
    if (element) element.classList.toggle(className);
  }
};

// Утилиты для работы с API
const API = {
  // Базовый URL для API (используем относительные пути)
  baseURL: '',
  
  // Выполнение запроса
  async request(url, options = {}) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      };
      
      const response = await fetch(`${this.baseURL}${url}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Если статус 204 (No Content), не пытаемся парсить JSON
      if (response.status === 204) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  },
  
  // GET запрос
  async get(url, params = {}) {
    const searchParams = new URLSearchParams(params);
    const fullUrl = `${url}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    return this.request(fullUrl);
  },
  
  // POST запрос
  async post(url, data = {}) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // PUT запрос
  async put(url, data = {}) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  // PATCH запрос
  async patch(url, data = {}) {
    return this.request(url, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },
  
  // DELETE запрос
  async delete(url) {
    return this.request(url, {
      method: 'DELETE'
    });
  }
};

// Утилиты для работы с датами
const DateUtils = {
  // Форматирование даты для отображения
  formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Kiev'
    };
    
    return new Intl.DateTimeFormat('ru-RU', { ...defaultOptions, ...options }).format(new Date(date));
  },
  
  // Относительное время (например, "2 часа назад")
  formatRelative(date) {
    const now = new Date();
    const target = new Date(date);
    const diffMs = now - target;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMinutes < 1) return 'только что';
    if (diffMinutes < 60) return `${diffMinutes} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays < 7) return `${diffDays} дн. назад`;
    
    return this.formatDate(date, { year: 'numeric', month: 'short', day: 'numeric' });
  },
  
  // Получение текущего времени в ISO формате
  now() {
    return new Date().toISOString();
  }
};

// Утилиты для работы с числами
const NumberUtils = {
  // Форматирование чисел с разделителями тысяч
  format(number, options = {}) {
    const defaultOptions = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    };
    
    return new Intl.NumberFormat('ru-RU', { ...defaultOptions, ...options }).format(number);
  },
  
  // Сокращение больших чисел (например, 1500 -> 1.5К)
  abbreviate(number) {
    if (number < 1000) return number.toString();
    if (number < 1000000) return (number / 1000).toFixed(1) + 'К';
    if (number < 1000000000) return (number / 1000000).toFixed(1) + 'М';
    return (number / 1000000000).toFixed(1) + 'Б';
  },
  
  // Проверка на число
  isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },
  
  // Безопасное преобразование в число
  toNumber(value, defaultValue = 0) {
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  }
};

// Утилиты для работы с текстом
const TextUtils = {
  // Обрезка текста с многоточием
  truncate(text, maxLength = 50) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },
  
  // Капитализация первой буквы
  capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },
  
  // Преобразование в slug
  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\u0400-\u04FF]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
  
  // Поиск с учетом неточного совпадения
  fuzzySearch(query, text) {
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    
    // Точное совпадение
    if (textLower.includes(queryLower)) return true;
    
    // Поиск по первым буквам слов
    const words = textLower.split(/\s+/);
    const firstLetters = words.map(word => word.charAt(0)).join('');
    if (firstLetters.includes(queryLower)) return true;
    
    return false;
  }
};

// Утилиты для работы с Local Storage
const Storage = {
  // Сохранение данных
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },
  
  // Получение данных
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  },
  
  // Удаление данных
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },
  
  // Очистка всех данных
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }
};

// Утилиты для валидации
const Validators = {
  // Проверка email
  email(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  // Проверка пароля (минимум 6 символов)
  password(password) {
    return password && password.length >= 6;
  },
  
  // Проверка на пустое значение
  required(value) {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },
  
  // Проверка числа
  number(value, min = null, max = null) {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  },
  
  // Проверка положительного целого числа
  positiveInteger(value) {
    const num = parseInt(value);
    return !isNaN(num) && num > 0 && num === parseFloat(value);
  }
};

// Утилиты для работы с событиями
const Events = {
  // Подписка на событие
  on(element, event, handler) {
    if (typeof element === 'string') element = DOM.get(element);
    if (element) element.addEventListener(event, handler);
  },
  
  // Отписка от события
  off(element, event, handler) {
    if (typeof element === 'string') element = DOM.get(element);
    if (element) element.removeEventListener(event, handler);
  },
  
  // Однократное событие
  once(element, event, handler) {
    if (typeof element === 'string') element = DOM.get(element);
    if (element) {
      const wrappedHandler = (e) => {
        handler(e);
        element.removeEventListener(event, wrappedHandler);
      };
      element.addEventListener(event, wrappedHandler);
    }
  },
  
  // Создание и отправка кастомного события
  emit(element, eventName, detail = {}) {
    if (typeof element === 'string') element = DOM.get(element);
    if (element) {
      const event = new CustomEvent(eventName, { detail });
      element.dispatchEvent(event);
    }
  }
};

// Утилиты для работы с формами
const FormUtils = {
  // Получение данных формы
  getData(form) {
    if (typeof form === 'string') form = DOM.get(form);
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      // Обработка чекбоксов и множественных значений
      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }
    
    return data;
  },
  
  // Заполнение формы данными
  setData(form, data) {
    if (typeof form === 'string') form = DOM.get(form);
    
    Object.keys(data).forEach(key => {
      const field = form.querySelector(`[name="${key}"]`);
      if (field) {
        if (field.type === 'checkbox' || field.type === 'radio') {
          field.checked = Boolean(data[key]);
        } else {
          field.value = data[key] || '';
        }
      }
    });
  },
  
  // Очистка формы
  clear(form) {
    if (typeof form === 'string') form = DOM.get(form);
    form.reset();
  },
  
  // Показ ошибки поля
  showError(fieldName, message) {
    const errorElement = DOM.get(`${fieldName}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  },
  
  // Скрытие ошибки поля
  hideError(fieldName) {
    const errorElement = DOM.get(`${fieldName}-error`);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  },
  
  // Очистка всех ошибок формы
  clearErrors(form) {
    if (typeof form === 'string') form = DOM.get(form);
    const errorElements = form.querySelectorAll('.form-error');
    errorElements.forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
  }
};

// Утилиты для анимаций
const AnimationUtils = {
  // Плавное появление
  fadeIn(element, duration = 300) {
    if (typeof element === 'string') element = DOM.get(element);
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.min(progress / duration, 1);
      element.style.opacity = opacity;
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate);
  },
  
  // Плавное исчезновение
  fadeOut(element, duration = 300) {
    if (typeof element === 'string') element = DOM.get(element);
    
    let start = null;
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.max(1 - progress / duration, 0);
      element.style.opacity = opacity;
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = 'none';
      }
    }
    requestAnimationFrame(animate);
  }
};

// Экспорт всех утилит в глобальную область видимости
window.DOM = DOM;
window.API = API;
window.DateUtils = DateUtils;
window.NumberUtils = NumberUtils;
window.TextUtils = TextUtils;
window.Storage = Storage;
window.Validators = Validators;
window.Events = Events;
window.FormUtils = FormUtils;
window.AnimationUtils = AnimationUtils;