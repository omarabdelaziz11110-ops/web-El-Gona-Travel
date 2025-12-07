document.addEventListener('DOMContentLoaded', () => {

    // --- 1. وضع الإضاءة/الظلام ---
    const modeToggle = document.getElementById('mode-toggle');
    const body = document.body;

    const currentMode = localStorage.getItem('mode') || 'light-mode';
    body.className = currentMode;
    modeToggle.textContent = currentMode === 'dark-mode' ? '☀️' : '🌙';

    modeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('mode', 'dark-mode');
            modeToggle.textContent = '☀️';
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('mode', 'light-mode');
            modeToggle.textContent = '🌙';
        }
    });

    // --- 2. تأثير البارالاكس (Parallax) ---
    const heroImage = document.querySelector('.hero-image-parallax');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            heroImage.style.transform = `translateY(${scrollPosition * 0.3}px)`;
        });
    }


   // ملف: main.js

    // --- 3. العد التنازلي لرحلة القاهرة (28/12/2025) ---
    const countdownElement = document.getElementById('countdown');
    const weeklyDealSection = document.getElementById('weekly-deal'); // إضافة جديدة للحصول على القسم
    
    if (countdownElement && weeklyDealSection) {
        
        // التاريخ المستهدف: 28 ديسمبر 2025، الساعة 00:00:00 (يتم قراءته من خاصية data-target-date)
        const targetDateString = weeklyDealSection.getAttribute('data-target-date');
        
        // التحقق من وجود التاريخ وقابلية تحويله
        if (!targetDateString) {
            console.error("Missing data-target-date attribute on #weekly-deal section.");
            return;
        }
        
        const targetDate = new Date(targetDateString).getTime(); // تحويل السلسلة إلى وقت Unix

        const updateCountdown = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.innerHTML = `${days} يوم ${hours} ساعة ${minutes} دقيقة ${seconds} ثانية`;

            if (distance < 0) {
                clearInterval(updateCountdown);
                countdownElement.innerHTML = "انتهى العرض! ترقبوا الرحلة القادمة.";
            }
        }, 1000);
    }


    // --- 4. معرض الصور التفاعلي (Carousel) ---
    const carouselSlide = document.querySelector('.carousel-slide');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.carousel-dots');

    if (carouselSlide) {
        let currentIndex = 0;
        const totalItems = carouselItems.length;
        let slideInterval;


        for (let i = 0; i < totalItems; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.index = i;
            dotsContainer.appendChild(dot);
        }
        const dots = document.querySelectorAll('.dot');

        const updateCarousel = () => {
            const offset = -currentIndex * 100;
            carouselSlide.style.transform = `translateX(${offset}%)`;

            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentIndex]) {
                dots[currentIndex].classList.add('active');
            }
        };
        updateCarousel();

        const goToNext = () => {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        };

        const goToPrev = () => {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
        };

        const startAutoSlide = () => {
            slideInterval = setInterval(goToNext, 5000);
        };

        const stopAutoSlide = () => {
            clearInterval(slideInterval);
        };

        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            goToNext();
            startAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            goToPrev();
            startAutoSlide();
        });

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                stopAutoSlide();
                currentIndex = parseInt(e.target.dataset.index);
                updateCarousel();
                startAutoSlide();
            });
        });

        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoSlide);
            carouselContainer.addEventListener('mouseleave', startAutoSlide);
        }

        startAutoSlide();
    }

    // --- 5. تأثيرات التلاشي عند التمرير (Scroll Fade-In) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // تظهر عندما يكون 10% من العنصر مرئياً
    });


    document.querySelectorAll('.section-padding, .hotel-card, .trip-card, .supervisor-card, .deal-card, .feature-item, .booking-form-container').forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
});

// ===============================================
// دالة إرسال طلب الحجز عبر الواتساب (الإضافة المطلوبة)
// ===============================================

/**
 * دالة لجمع بيانات نموذج الحجز وإنشاء رابط واتساب مُعبأ مسبقًا
 */
function sendWhatsAppBooking() {
    const tripName = document.getElementById('tripName').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const seats = document.getElementById('seats').value;

    // قراءة رقم المشرف المُختار من القائمة المنسدلة
    const supervisorElement = document.getElementById('supervisor');
    const supervisorNumber = supervisorElement.value;

    const notes = document.getElementById('notes').value;

    // التحقق من البيانات المطلوبة (تم إضافة التحقق من اختيار المشرف)
    if (!name || !phone || !seats || !supervisorNumber) {
        alert('من فضلك، أكمل جميع الحقول المطلوبة (الاسم، رقم الواتساب، عدد المقاعد، واختر المشرف).');
        return;
    }

    // بناء نص الرسالة بترميز لضمان عرضها بشكل صحيح في رابط URL
    let message = `*طلب حجز جديد من الموقع الإلكتروني*\n`;
    message += `------------------------------------\n`;
    message += `*الرحلة:* ${tripName}\n`;
    message += `*الاسم:* ${name}\n`;
    message += `*رقم الواتساب (العميل):* ${phone}\n`;
    message += `*عدد المقاعد:* ${seats}\n`;
    if (notes) {
        message += `*ملاحظات العميل:* ${notes}\n`;
    }
    message += `------------------------------------\n`;
    message += `*برجاء تأكيد الحجز وإرسال تفاصيل الدفع.*`;

    // ترميز الرسالة لـ URL
    const encodedMessage = encodeURIComponent(message);

    // إنشاء رابط الواتساب برقم المشرف المُختار
    const whatsappURL = `https://wa.me/${supervisorNumber}?text=${encodedMessage}`;

    // فتح نافذة جديدة أو الانتقال إلى تطبيق الواتساب
    window.open(whatsappURL, '_blank');

    alert('تم توجيهك الآن إلى تطبيق الواتساب لإرسال طلبك إلى المشرف المختار. شكراً لثقتك!');
}

// جعل الدالة متاحة عالمياً لـ onclick في HTML

window.sendWhatsAppBooking = sendWhatsAppBooking;
