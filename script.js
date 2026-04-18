// ЗАЩИТА ОТ КОПИРОВАНИЯ И ВЫДЕЛЕНИЯ
document.addEventListener('contextmenu', (e) => { e.preventDefault(); return false; });

// Отключение выделения текста
document.addEventListener('selectstart', (e) => { e.preventDefault(); });

// Отключение перетаскивания изображений
document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// Отключение выделения через JavaScript
document.body.style.userSelect = 'none';
document.body.style.webkitUserSelect = 'none';
document.body.style.MozUserSelect = 'none';
document.body.style.msUserSelect = 'none';

// ФУНКЦИИ САЙТА
function toggleMobileMenu() {
    const navSection = document.getElementById('headerNavSection');
    navSection.classList.toggle('active');
}

// Функция для правильного склонения слова "место"
function declensionPlaces(number) {
    const cases = ['место', 'места', 'мест'];
    let n = number % 100;
    
    if (n > 10 && n < 20) {
        return cases[2]; // для 11-19 (мест)
    }
    
    n = number % 10;
    if (n === 1) {
        return cases[0]; // для 1, 21, 31 и т.д. (место)
    }
    if (n > 1 && n < 5) {
        return cases[1]; // для 2-4, 22-24 и т.д. (места)
    }
    
    return cases[2]; // для остальных (мест)
}

// Обновление месяца и количества мест в badge
function updateBadgeText() {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    const year = now.getFullYear();
    
    // Словарь месяцев
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    
    // Генерируем консистентное случайное число на основе месяца
    // Это число будет одинаково весь месяц
    const seed = year * 12 + month;
    const random = (seed * 9301 + 49297) % 233280;
    const places = 3 + (random % 4); // от 3 до 6
    const placesWord = declensionPlaces(places);
    
    // Обновляем текст
    const monthElement = document.getElementById('monthName');
    const placesElement = document.getElementById('placesCount');
    const placesTextElement = document.getElementById('placesText');
    
    if (monthElement) monthElement.textContent = months[month];
    if (placesElement) placesElement.textContent = places;
    if (placesTextElement) placesTextElement.textContent = placesWord;
}

// Вызываем обновление при загрузке страницы
document.addEventListener('DOMContentLoaded', updateBadgeText);
// И сразу же (на случай если DOMContentLoaded уже прошло)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateBadgeText);
} else {
    updateBadgeText();
}

// Smooth scroll и active links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            document.getElementById('headerNavSection').classList.remove('active');
        }
    });
});

// Active nav links на основе скролла
window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Обработка мессенджеров
document.querySelectorAll('.messenger-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.messenger-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Проверка - была ли уже отправлена форма
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('formSubmitted') === 'true') {
        // Форма уже была отправлена - скрываем её и показываем сообщение
        const contactForm = document.querySelector('.contact-form');
        const alreadySubmittedMsg = document.getElementById('already-submitted-message');
        
        if (contactForm) contactForm.style.display = 'none';
        if (alreadySubmittedMsg) alreadySubmittedMsg.style.display = 'block';
    }
});

// Обработка формы через Formspree
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('application-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Проверяем видео
            if (!document.querySelector('[name="video_watched"]:checked')) {
                alert('❌ Пожалуйста, подтвердите, что вы посмотрели видео!');
                return;
            }

            // Проверяем согласие с политикой конфиденциальности
            if (!document.querySelector('[name="privacy_check"]:checked')) {
                alert('❌ Пожалуйста, согласитесь с политикой конфиденциальности!');
                return;
            }

            const formData = new FormData(this);

            // Отключаем кнопку отправки на время отправки
            const submitBtn = this.querySelector('[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';

            fetch('https://formspree.io/f/mnnqyedw', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Успешная отправка - сохраняем флаг в localStorage
                    localStorage.setItem('formSubmitted', 'true');
                    window.location.href = 'thank-you.html';
                } else {
                    // Ошибка отправки
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    alert('❌ Произошла ошибка при отправке формы. Пожалуйста, попробуйте ещё раз.');
                }
            })
            .catch(error => {
                console.error('Ошибка при отправке:', error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                alert('❌ Произошла ошибка при отправке формы. Пожалуйста, проверьте интернет-соединение.');
            });
        });
        
        // Очищаем форму
        form.reset();
        document.querySelectorAll('.messenger-btn').forEach(b => b.classList.remove('active'));
    }
});

// ScrollReveal анимации
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.symptom-card, .process-step, .video-testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Логирование в консоль
console.log('%c⛔ СТОП!', 'color: red; font-size: 60px; font-weight: bold;');
console.log('%cЭто функция браузера предназначена для разработчиков.', 'font-size: 16px; color: #333;');
console.log('%c📊 Если у вас есть сложные вопросы - свяжитесь с поддержкой.', 'font-size: 14px; color: #666;');
