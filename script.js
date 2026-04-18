// ЗАЩИТА ОТ КОПИРОВАНИЯ
document.addEventListener('contextmenu', (e) => { e.preventDefault(); return false; });

// ФУНКЦИИ САЙТА
function toggleMobileMenu() {
    const navSection = document.getElementById('headerNavSection');
    navSection.classList.toggle('active');
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
    
    // Обновляем текст
    const monthElement = document.getElementById('monthName');
    const placesElement = document.getElementById('placesCount');
    
    if (monthElement) monthElement.textContent = months[month];
    if (placesElement) placesElement.textContent = places;
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

// Обработка формы
document.getElementById('application-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Собираем данные
    const formData = {
        name: document.querySelector('[name="name"]').value,
        phone: document.querySelector('[name="phone"]').value,
        age: document.querySelector('[name="age"]').value,
        email: document.querySelector('[name="email"]').value,
        messenger: document.querySelector('[name="messenger"]').value,
        city: document.querySelector('[name="city"]').value,
        mental: document.querySelector('[name="mental"]').value,
        importance: document.querySelector('[name="importance"]').value,
        video_watched: document.querySelector('[name="video_watched"]:checked') ? document.querySelector('[name="video_watched"]:checked').value : 'Нет',
        video_response: document.querySelector('[name="video_response"]').value,
        privacy_agreed: document.querySelector('[name="privacy_check"]').checked,
        date: new Date().toLocaleString('ru-RU')
    };

    // Проверяем видео
    if (!document.querySelector('[name="video_watched"]:checked')) {
        alert('❌ Пожалуйста, подтвердите, что вы посмотрели видео!');
        return;
    }

    // Проверяем согласие с политикой конфиденциальности
    if (!formData.privacy_agreed) {
        alert('❌ Пожалуйста, согласитесь с политикой конфиденциальности!');
        return;
    }

    // Сохраняем в localStorage
    let submissions = JSON.parse(localStorage.getItem('applicationSubmissions') || '[]');
    submissions.push(formData);
    localStorage.setItem('applicationSubmissions', JSON.stringify(submissions));

    // Отправляем на email через FormSubmit.co
    const formElement = document.getElementById('application-form');
    const emailData = new FormData();
    
    emailData.append('_captcha', 'false');
    emailData.append('_next', window.location.href);
    
    Object.keys(formData).forEach(key => {
        emailData.append(key, formData[key]);
    });

    fetch('https://formsubmit.co/stopataka@gmail.com', {
        method: 'POST',
        body: emailData
    }).then(response => {
        // Успешное сообщение
        alert('✅ Спасибо за заявку! Вы будете добавлены в мой список на консультацию. Я свяжусь с вами в ближайшее время.');
        
        // Формируем текст для консоли
        const text = `Новая заявка на консультацию!\n\nИмя: ${formData.name}\nТелефон: ${formData.phone}\nВозраст: ${formData.age}\nEmail: ${formData.email}\nМессенджер: ${formData.messenger}\nГород: ${formData.city}\nПсихические заболевания: ${formData.mental}\nВажность (1-10): ${formData.importance}\nВидео просмотрено: ${formData.video_watched}\nОтвет на вопрос: ${formData.video_response}\nДата: ${formData.date}`;

        console.log('%c📋 ДАННЫЕ ЗАЯВКИ:', 'color: green; font-weight: bold; font-size: 14px;');
        console.log(text);
        console.log('%c✅ Данные сохранены и отправлены', 'color: green; font-weight: bold;');
        
        // Очищаем форму
        formElement.reset();
    }).catch(error => {
        console.error('Ошибка при отправке:', error);
        alert('⚠️ Заявка сохранена локально, но ошибка при отправке на email. Свяжитесь с нами directly.');
    });

    // Очищаем форму
    this.reset();
    document.querySelectorAll('.messenger-btn').forEach(b => b.classList.remove('active'));
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
