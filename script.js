// ЗАЩИТА ОТ КОПИРОВАНИЯ
document.addEventListener('contextmenu', (e) => { e.preventDefault(); return false; });

// ФУНКЦИИ САЙТА
function toggleMobileMenu() {
    const navSection = document.getElementById('headerNavSection');
    navSection.classList.toggle('active');
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
document.getElementById('consultationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Собираем данные
    const formData = {
        name: document.querySelector('[name="name"]').value,
        phone: document.querySelector('[name="phone"]').value,
        age: document.querySelector('[name="age"]').value,
        email: document.querySelector('[name="email"]').value,
        messenger: document.querySelector('[name="messenger"]:checked').value,
        city: document.querySelector('[name="city"]').value,
        mental_health: document.querySelector('[name="mental_health"]').value,
        rating: document.querySelector('[name="rating"]:checked').value,
        video_watched: document.querySelector('[name="video_watched"]').checked,
        video_answer: document.querySelector('[name="video_answer"]').value,
        date: new Date().toLocaleString('ru-RU')
    };

    // Проверяем видео
    if (!formData.video_watched) {
        alert('❌ Пожалуйста, подтвердите, что вы посмотрели видео!');
        return;
    }

    // Сохраняем в localStorage
    let submissions = JSON.parse(localStorage.getItem('consultationSubmissions') || '[]');
    submissions.push(formData);
    localStorage.setItem('consultationSubmissions', JSON.stringify(submissions));

    // Успешное сообщение
    alert('✅ Спасибо за заявку! Вы будете добавлены в мой список на консультацию. Я свяжусь с вами в ближайшее время.');

    // Формируем текст для копирования
    const text = `Новая заявка на консультацию!\n\nИмя: ${formData.name}\nТелефон: ${formData.phone}\nВозраст: ${formData.age}\nEmail: ${formData.email}\nМессенджер: ${formData.messenger}\nГород: ${formData.city}\nПсихические заболевания: ${formData.mental_health || 'Нет'}\nВажность (1-10): ${formData.rating}\nВидео просмотрено: ${formData.video_watched ? 'Да' : 'Нет'}\nОтвет на вопрос: ${formData.video_answer}\nДата: ${formData.date}`;

    console.log('%c📋 ДАННЫЕ ЗАЯВКИ:', 'color: green; font-weight: bold; font-size: 14px;');
    console.log(text);
    console.log('%c✅ Данные сохранены в localStorage', 'color: green; font-weight: bold;');

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
