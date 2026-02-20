// ===================================
// Dark Mode Logic
// ===================================
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Check Local Storage or System Preference
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    themeToggleLightIcon.classList.remove('hidden');
} else {
    document.documentElement.classList.remove('dark');
    themeToggleDarkIcon.classList.remove('hidden');
}

themeToggleBtn.addEventListener('click', function () {
    // Toggle icons
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // If is set in localstorage
    if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }
    } else {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    }
});

// ===================================
// Testimonial Slider Logic
// ===================================
let currentSlide = 0;
const testimonialTrack = document.getElementById('testimonial-track');
const sliderPagination = document.getElementById('slider-pagination');

function renderTestimonials() {
    if (!testimonialTrack || !testimonialData) return;

    // Clear track
    testimonialTrack.innerHTML = '';
    sliderPagination.innerHTML = '';

    testimonialData.forEach((testi, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = 'testimonial-slide p-8 md:p-16 flex flex-col md:flex-row items-center gap-10';
        slide.innerHTML = `
            <div class="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 animate-fade-in">
                <img src="${testi.image}" alt="${testi.name}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 text-center md:text-left">
                <svg class="w-12 h-12 text-primary-200 dark:text-primary-900/40 mb-6 mx-auto md:mx-0" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8v8H6v2a2 2 0 002 2h2v4H8a6 6 0 01-6-6v-8a2 2 0 012-2h4zm12 0v8h-4v2a2 2 0 002 2h2v4h-2a6 6 0 01-6-6v-8a2 2 0 012-2h4z"></path></svg>
                <p class="text-xl md:text-2xl text-gray-700 dark:text-gray-300 italic mb-8 leading-relaxed font-medium">"${testi.quote}"</p>
                <div>
                    <h4 class="text-xl font-bold text-gray-900 dark:text-white">${testi.name}</h4>
                    <p class="text-primary-600 dark:text-primary-400 font-semibold">${testi.role}</p>
                </div>
            </div>
        `;
        testimonialTrack.appendChild(slide);

        // Create dot
        const dot = document.createElement('button');
        dot.className = `w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700 transition-all duration-300 ${index === 0 ? 'indicator-active' : ''}`;
        dot.onclick = () => showSlide(index);
        sliderPagination.appendChild(dot);
    });
}

function showSlide(index) {
    if (!testimonialTrack) return;

    const totalSlides = testimonialData.length;
    if (index >= totalSlides) currentSlide = 0;
    else if (index < 0) currentSlide = totalSlides - 1;
    else currentSlide = index;

    testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update dots
    const dots = sliderPagination.querySelectorAll('button');
    dots.forEach((dot, i) => {
        if (i === currentSlide) {
            dot.classList.add('indicator-active');
        } else {
            dot.classList.remove('indicator-active');
        }
    });
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }

// Auto Slide
let sliderInterval = setInterval(nextSlide, 5000);

// Pause auto-slide on hover
const testimonialContainer = document.querySelector('#testimonials .max-w-4xl');
if (testimonialContainer) {
    testimonialContainer.addEventListener('mouseenter', () => clearInterval(sliderInterval));
    testimonialContainer.addEventListener('mouseleave', () => sliderInterval = setInterval(nextSlide, 5000));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderTestimonials();
});
