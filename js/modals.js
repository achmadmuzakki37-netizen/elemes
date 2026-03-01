// ===================================
// State & Navigation
// ===================================
let currentActiveLevel = null;
let currentLevelData = null;
let currentTrainingData = null; // currently viewed training on detail page
let currentRegistrationTrainingId = null;
const navStack = ['landing']; // navigation history

const landingPage = document.getElementById('landingPage');
const landingExtra = document.getElementById('landingExtra');
const schedulePage = document.getElementById('schedulePage');
const detailPage = document.getElementById('detailPage');
const monthsContainer = document.getElementById('monthsContainer');

// Category metadata for UI theming
const categoryMeta = {
    tk: {
        title: 'Jadwal Pelatihan TK/PAUD',
        sub: 'Program pelatihan tingkat TK/PAUD berbasis Montessori dan bermain sambil belajar.',
        gradient: 'bg-gradient-to-br from-pink-500 to-rose-600',
        iconSvg: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        bgBlob: 'bg-gradient-to-br from-pink-400 to-rose-500',
        label: 'TK / PAUD'
    },
    sd: {
        title: 'Jadwal Pelatihan Sekolah Dasar',
        sub: 'Program pelatihan tingkat SD fokus pada literasi, numerasi, dan pembentukan karakter.',
        gradient: 'bg-gradient-to-br from-sky-500 to-blue-600',
        iconSvg: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
        bgBlob: 'bg-gradient-to-br from-sky-400 to-blue-500',
        label: 'Sekolah Dasar (SD)'
    },
    smp: {
        title: 'Jadwal Pelatihan SMP',
        sub: 'Program pelatihan tingkat SMP fokus pada pengembangan logika, sains, dan kreativitas.',
        gradient: 'bg-gradient-to-br from-emerald-500 to-green-600',
        iconSvg: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
        bgBlob: 'bg-gradient-to-br from-emerald-400 to-green-500',
        label: 'SMP'
    },
    sma: {
        title: 'Jadwal Pelatihan SMA/SMK',
        sub: 'Program pelatihan tingkat SMA/SMK persiapan karir, teknologi industri, dan manajemen.',
        gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
        iconSvg: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
        bgBlob: 'bg-gradient-to-br from-amber-400 to-orange-500',
        label: 'SMA / SMK'
    }
};

// ===================================
// Price Formatting
// ===================================
function formatPrice(price) {
    if (!price || price === 0) {
        return { text: 'Gratis', className: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' };
    }
    const formatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    return { text: formatted, className: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' };
}

// ===================================
// Page Show / Hide Helpers
// ===================================
function showPage(pageEl) {
    // All pages
    const allPages = [landingPage, landingExtra, schedulePage, detailPage];
    allPages.forEach(p => { if (p) p.classList.add('hidden'); });

    if (pageEl === landingPage) {
        // Landing: show both sections
        if (landingPage) landingPage.classList.remove('hidden');
        if (landingExtra) landingExtra.classList.remove('hidden');
    } else if (pageEl) {
        pageEl.classList.remove('hidden');
        pageEl.classList.add('page-enter');
        setTimeout(() => pageEl.classList.remove('page-enter'), 400);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================
// Navigate Home (Landing Page)
// ===================================
function navigateHome() {
    navStack.length = 1; // reset to ['landing']
    navStack[0] = 'landing';
    currentActiveLevel = null;
    currentLevelData = null;
    currentTrainingData = null;
    // Clear video to stop playback
    const dvc = document.getElementById('detailVideoContainer');
    if (dvc) dvc.innerHTML = '';
    showPage(landingPage);
}

// ===================================
// Navigate Back (one step back)
// ===================================
function navigateBack() {
    if (navStack.length <= 1) { navigateHome(); return; }
    navStack.pop();
    const prev = navStack[navStack.length - 1];
    if (prev === 'landing') {
        navigateHome();
    } else if (prev === 'schedule') {
        const dvc = document.getElementById('detailVideoContainer');
        if (dvc) dvc.innerHTML = '';
        showPage(schedulePage);
    }
}

// ===================================
// Navigate To: Schedule Page
// ===================================
async function navigateToSchedule(level) {
    currentActiveLevel = level;
    currentLevelData = null;

    // Update breadcrumb & hero
    const meta = categoryMeta[level] || { title: 'Jadwal Pelatihan', sub: '', gradient: 'bg-gray-500', iconSvg: '', bgBlob: 'bg-gray-400', label: level };
    document.getElementById('scheduleBreadcrumb').textContent = meta.title;
    document.getElementById('scheduleHeroTitle').textContent = meta.title;
    document.getElementById('scheduleHeroSub').textContent = meta.sub;

    const heroIcon = document.getElementById('scheduleHeroIcon');
    heroIcon.className = `w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl flex-shrink-0 ${meta.gradient}`;
    heroIcon.innerHTML = meta.iconSvg;

    const heroBg = document.getElementById('scheduleHeroBg');
    heroBg.className = `absolute inset-0 pointer-events-none ${meta.bgBlob} opacity-5 dark:opacity-10`;

    // Show loading
    monthsContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 opacity-60">
            <svg class="animate-spin h-10 w-10 text-primary-500 mb-4" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-500 dark:text-gray-400">Memuat data pelatihan...</p>
        </div>
    `;

    navStack.push('schedule');
    showPage(schedulePage);

    try {
        // Fetch category info
        const { data: catData, error: catError } = await window.supabaseClient
            .from('categories').select('*').eq('id', level).single();
        if (catError) throw catError;

        // Fetch trainings
        const { data: trainings, error: trainError } = await window.supabaseClient
            .from('trainings').select('*').eq('category_id', level).order('month_index', { ascending: true });
        if (trainError) throw trainError;

        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const groupedData = {
            title: catData.title,
            months: monthNames.map((name, index) => ({
                name,
                trainings: trainings.filter(t => t.month_index === index)
            }))
        };
        currentLevelData = groupedData;

        renderSchedule(groupedData, meta);

    } catch (err) {
        console.error('Fetch Error:', err);
        monthsContainer.innerHTML = `
            <div class="p-12 text-center">
                <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Gagal Memuat Data</h4>
                <p class="text-gray-500 dark:text-gray-400 mb-6 text-sm">Pastikan tabel 'categories' dan 'trainings' sudah dibuat di Supabase.</p>
                <button onclick="navigateToSchedule('${level}')" class="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium">Coba Lagi</button>
            </div>
        `;
    }
}

// ===================================
// Render Schedule Months
// ===================================
function renderSchedule(data, meta) {
    monthsContainer.innerHTML = '';
    data.months.forEach((month, index) => {
        const trainingCount = month.trainings.length;
        const item = document.createElement('div');
        item.className = 'rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow';

        const countBadge = trainingCount > 0
            ? `<span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400">${trainingCount} Pelatihan</span>`
            : `<span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400">Kosong</span>`;

        // Month header (accordion trigger)
        const header = document.createElement('button');
        header.className = 'w-full flex justify-between items-center px-5 py-4 text-left bg-gray-50 dark:bg-gray-800/70 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors focus:outline-none';
        header.onclick = () => toggleAccordion(index);
        header.innerHTML = `
            <span class="flex items-center gap-3">
                <span class="w-9 h-9 rounded-xl ${meta.gradient} text-white flex items-center justify-center text-xs font-bold shadow-sm flex-shrink-0">${index + 1}</span>
                <span class="font-semibold text-gray-800 dark:text-gray-200 text-base">${month.name}</span>
                ${countBadge}
            </span>
            <svg id="icon-${index}" class="w-5 h-5 text-gray-400 transform transition-transform duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
        `;

        // Month content
        const content = document.createElement('div');
        content.id = `content-${index}`;
        content.className = 'hidden p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30';

        if (trainingCount === 0) {
            content.innerHTML = `<p class="text-sm text-gray-400 italic p-5">Belum ada pelatihan untuk bulan ini.</p>`;
        } else {
            month.trainings.forEach((training, tIndex) => {
                const price = formatPrice(training.price);
                const hasRegUrl = !!training.registration_url;
                const hasTaskUrl = !!training.assignment_url;
                const hasCertUrl = !!training.certificate_url;

                const btnDisabledClass = 'opacity-40 cursor-not-allowed';

                const isRegistrationOpen = training.registration_status === 'open' || !training.registration_status;

                // For Native Registration
                const regBtn = isRegistrationOpen
                    ? `<button onclick="event.stopPropagation(); openRegistrationModal('${training.id}')" class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-primary-600 hover:bg-primary-700 text-white shadow-sm shadow-primary-500/20 cursor-pointer">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                        Daftar
                    </button>`
                    : `<button disabled class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Selesai
                    </button>`;

                // For Option B (Dynamic GAS Integration)
                const hasGasUrl = !!training.gas_url;
                const gasUrl = training.gas_url ? `${training.gas_url}?id=${training.id}` : '';

                const gasBtn = `<button onclick="event.stopPropagation(); ${hasGasUrl ? `openIframeModalWithData('${gasUrl}','Tugas & Sertifikat','${training.name}','gas_webapp')` : ''}" class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${hasGasUrl ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 cursor-pointer' : `bg-blue-100 dark:bg-blue-900/30 text-blue-400 dark:text-blue-500 ${btnDisabledClass}`}" ${!hasGasUrl ? 'disabled' : ''}>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                    Tugas & Sertifikat
                </button>`;

                const card = document.createElement('div');
                card.className = 'group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex flex-col h-full cursor-pointer overflow-hidden';
                card.setAttribute('onclick', `navigateToDetail(${index}, ${tIndex})`);

                const bannerHtml = training.banner_url
                    ? `<div class="w-full aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden relative shrink-0">
                          <img src="${training.banner_url}" alt="${training.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                       </div>`
                    : `<div class="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shrink-0">
                          <svg class="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                       </div>`;

                card.innerHTML = `
                    ${bannerHtml}
                    <div class="p-5 flex flex-col flex-1">
                        <div class="flex-1">
                            <div class="flex items-start justify-between gap-3 mb-3 flex-wrap">
                                <span class="px-2.5 py-1 rounded-md text-xs font-semibold ${price.className}">${price.text}</span>
                                <span class="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    ${training.duration || '1 Hari'}
                                </span>
                            </div>
                            <div class="text-left w-full group/title mb-4">
                                <h5 class="font-bold text-gray-900 dark:text-gray-100 group-hover/title:text-primary-600 dark:group-hover/title:text-primary-400 transition-colors text-base line-clamp-2">${training.name}</h5>
                            </div>
                            
                            <div class="space-y-2 mb-6">
                                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    <span>${training.date || 'Belum Ditentukan'}</span>
                                </div>
                                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    <span>${training.time || 'Belum Ditentukan'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between flex-wrap gap-3">
                            <div class="flex items-center gap-2 flex-wrap text-left">
                                ${regBtn}
                                ${gasBtn}
                                <button onclick="event.stopPropagation(); openIframeModalWithData(null, 'Daftar Peserta', '${training.name}', 'participants', '${training.id}')" class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-indigo-500 dark:bg-indigo-600 text-white dark:text-white hover:bg-indigo-600 dark:hover:bg-indigo-700 cursor-pointer">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                                    Peserta
                                </button>
                            </div>
                            <div class="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                                Detail
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                            </div>
                        </div>
                    </div>
                `;
                content.appendChild(card);
            });
        }

        item.appendChild(header);
        item.appendChild(content);
        monthsContainer.appendChild(item);
    });
}

function toggleAccordion(index) {
    const content = document.getElementById(`content-${index}`);
    const icon = document.getElementById(`icon-${index}`);
    content.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
}

// ===================================
// Navigate To: Detail Page
// ===================================
function navigateToDetail(monthIndex, trainingIndex) {
    if (!currentLevelData) return;
    const month = currentLevelData.months[monthIndex];
    const training = month ? month.trainings[trainingIndex] : null;
    if (!training) return;

    currentTrainingData = training;
    const meta = categoryMeta[currentActiveLevel] || {};
    const price = formatPrice(training.price);

    // Breadcrumb
    const schedLabel = meta.title || 'Jadwal Pelatihan';
    document.getElementById('detailBreadcrumbSchedule').textContent = schedLabel;
    document.getElementById('detailBreadcrumbTitle').textContent = training.name;

    // Title & meta badges
    document.getElementById('detailTitle').textContent = training.name;
    document.getElementById('detailDuration').innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Durasi: ${training.duration || '1 Hari'}
    `;
    document.getElementById('detailCategory').textContent = meta.label || currentActiveLevel;
    document.getElementById('detailMonth').textContent = month.name;
    document.getElementById('detailDate').textContent = training.date || 'Belum Ditentukan';
    document.getElementById('detailTime').textContent = training.time || 'Belum Ditentukan';

    const priceBadge = document.getElementById('detailPriceBadge');
    priceBadge.textContent = price.text;
    priceBadge.className = `px-2.5 py-1 rounded-lg text-xs font-bold ${price.className}`;

    // Sidebar info
    document.getElementById('sidebarCategory').textContent = meta.label || currentActiveLevel;
    document.getElementById('sidebarDuration').textContent = training.duration || '1 Hari';
    document.getElementById('sidebarMonth').textContent = month.name;
    document.getElementById('sidebarDate').textContent = training.date || 'Belum Ditentukan';
    document.getElementById('sidebarTime').textContent = training.time || 'Belum Ditentukan';
    const sidebarPrice = document.getElementById('sidebarPrice');
    sidebarPrice.textContent = price.text;
    sidebarPrice.className = `font-bold text-lg ${training.price > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`;

    // Sidebar action buttons
    const regBtn = document.getElementById('sidebarRegisterBtn');
    const gasBtn = document.getElementById('sidebarAssignmentBtn');

    // Registration Status Check
    const isRegistrationOpen = training.registration_status === 'open' || !training.registration_status;

    if (isRegistrationOpen) {
        regBtn.className = "w-full text-center py-3 px-4 rounded-xl font-semibold transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20";
        regBtn.onclick = () => openRegistrationModal(training.id);
        regBtn.disabled = false;
        regBtn.textContent = 'Daftar';
    } else {
        regBtn.className = "w-full text-center py-3 px-4 rounded-xl font-semibold transition-all bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed";
        regBtn.onclick = null;
        regBtn.disabled = true;
        regBtn.textContent = 'Pendaftaran Ditutup';
    }

    // Assignment & Cert uses dynamic GAS URL
    const gasUrl = training.gas_url ? `${training.gas_url}?id=${training.id}` : '';
    setupSidebarBtn(gasBtn, gasUrl, 'gas_webapp', 'Tugas & Sertifikat', training.name);

    // Participant List Button
    const participantsBtn = document.createElement('button');
    participantsBtn.className = "participant-list-btn col-span-2 flex items-center justify-center px-4 py-3 rounded-xl bg-indigo-500 dark:bg-indigo-600 text-white dark:text-white font-bold transition-all shadow-sm hover:shadow-md hover:bg-indigo-600 dark:hover:bg-indigo-700 active:scale-95 text-sm";
    participantsBtn.innerHTML = `
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        Lihat Peserta Terdaftar
    `;
    participantsBtn.onclick = () => openIframeModalWithData(null, 'Daftar Peserta', training.name, 'participants', training.id);

    // Add to the grid in sidebar (find the container)
    const actionGrid = regBtn.parentElement;
    // Clear ALL existing participant buttons to prevent duplicates
    const existingBtns = actionGrid.querySelectorAll('.participant-list-btn');
    existingBtns.forEach(btn => btn.remove());
    actionGrid.appendChild(participantsBtn);

    // Video
    renderVideo(document.getElementById('detailVideoContainer'), training);

    // Materi
    document.getElementById('detailMateri').innerHTML = training.materi
        || '<p class="text-gray-400 italic">Materi untuk pelatihan ini sedang dalam tahap penyusunan. Harap cek kembali secara berkala.</p>';

    // PDF
    const pdfBtn = document.getElementById('detailPdfBtn');
    const rawPdf = training.pdf_path;
    if (rawPdf) {
        pdfBtn.href = (!rawPdf.startsWith('http') && !rawPdf.includes('/'))
            ? `https://drive.google.com/uc?export=download&id=${rawPdf}`
            : rawPdf;
        pdfBtn.classList.remove('opacity-40', 'pointer-events-none');
    } else {
        pdfBtn.href = '#';
        pdfBtn.classList.add('opacity-40', 'pointer-events-none');
    }

    navStack.push('detail');
    showPage(detailPage);
}

function setupSidebarBtn(btn, url, type, label, trainingName) {
    if (!btn) return;
    if (url) {
        btn.disabled = false;
        btn.classList.remove('opacity-40', 'cursor-not-allowed');
        btn.onclick = () => openIframeModalWithData(url, label, trainingName, type);
    } else {
        btn.disabled = true;
        btn.classList.add('opacity-40', 'cursor-not-allowed');
        btn.onclick = null;
    }
}

// ===================================
// Render Video (supports YT, Vimeo, GDrive, direct)
// ===================================
function renderVideo(container, training) {
    const youtubeId = training.youtube_id || null;
    const vimeoId = training.vimeo_id || null;
    const googleDriveId = training.google_drive_id || null;
    const videoUrl = training.video_url || null;

    let html = '';
    if (vimeoId) {
        html = `<div class="relative w-full h-full"><iframe src="https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0" class="absolute inset-0 w-full h-full" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
    } else if (googleDriveId) {
        html = `<div class="relative w-full h-full"><iframe src="https://drive.google.com/file/d/${googleDriveId}/preview" class="absolute inset-0 w-full h-full" allow="autoplay" allowfullscreen></iframe></div>`;
    } else if (videoUrl) {
        html = `<video class="w-full h-full" controls preload="metadata"><source src="${videoUrl}" type="video/mp4">Browser Anda tidak mendukung video.</video>`;
    } else if (youtubeId) {
        html = `<div class="relative w-full h-full"><lite-youtube videoid="${youtubeId}" class="absolute inset-0 w-full h-full" style="background-image:url('https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg');"></lite-youtube></div>`;
    } else {
        html = `<div class="flex items-center justify-center w-full h-full bg-gray-900 text-gray-500 text-sm">Video belum tersedia</div>`;
    }
    container.innerHTML = html;
}

function openIframeModalWithData(url, title, trainingName, type) {
    const modal = document.getElementById('iframeModal');
    const frame = document.getElementById('iframeModalFrame');
    const placeholder = document.getElementById('iframeModalPlaceholder');
    const titleEl = document.getElementById('iframeModalTitle');
    const subEl = document.getElementById('iframeModalSub');
    const iconEl = document.getElementById('iframeModalIcon');
    const nativeView = document.getElementById('nativeModalContent');
    const participantsView = document.getElementById('participantListView');

    const typeConfig = {
        register: { label: 'Daftar Pelatihan', bg: 'bg-primary-600', iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
        assignment: { label: 'Kumpulkan Tugas', bg: 'bg-blue-600', iconPath: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
        certificate: { label: 'Unduh Sertifikat', bg: 'bg-amber-500', iconPath: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
        gas_webapp: { label: 'Tugas & Sertifikat', bg: 'bg-blue-600', iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        participants: { label: 'Daftar Peserta', bg: 'bg-gray-600', iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' }
    };
    const cfg = typeConfig[type] || typeConfig.register;

    titleEl.textContent = cfg.label;
    subEl.textContent = trainingName || '';
    iconEl.className = `w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0 ${cfg.bg}`;
    iconEl.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${cfg.iconPath}"/></svg>`;

    if (type === 'gas_webapp') {
        frame.classList.add('hidden');
        placeholder.classList.add('hidden');
        participantsView.classList.add('hidden');
        nativeView.classList.remove('hidden');
        initNativeGasUI(url);
    } else if (type === 'participants') {
        frame.classList.add('hidden');
        placeholder.classList.add('hidden');
        nativeView.classList.add('hidden');
        participantsView.classList.remove('hidden');
        const trainingId = arguments[4]; // Pass trainingId as 5th arg
        initParticipantsUI(trainingId);
    } else if (url) {
        nativeView.classList.add('hidden');
        participantsView.classList.add('hidden');
        frame.src = url;
        frame.classList.remove('hidden');
        placeholder.classList.add('hidden');
    } else {
        nativeView.classList.add('hidden');
        participantsView.classList.add('hidden');
        frame.src = '';
        frame.classList.add('hidden');
        placeholder.classList.remove('hidden');
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// ===================================
// Native GAS Integration (Option B)
// ===================================
let _gasParticipantsData = [];
let _currentGasUrl = '';
let _currentTrainingId = null;
let _currentDriveFolderId = '';

async function initNativeGasUI(gasUrl) {
    _currentGasUrl = gasUrl;
    // Capture training context
    if (currentTrainingData) {
        _currentTrainingId = currentTrainingData.id;
        _currentDriveFolderId = currentTrainingData.drive_folder_id || '';
    } else {
        try {
            const urlObj = new URL(gasUrl);
            _currentTrainingId = urlObj.searchParams.get('id') || null;
        } catch {
            _currentTrainingId = null;
        }
    }

    const searchInput = document.getElementById('gasSearchInput');
    const resultsPanel = document.getElementById('gasSearchResults');
    const statusContainer = document.getElementById('gasStatusContainer');
    const loader = document.getElementById('gasLoadingPlaceholder');
    const dataBadge = document.getElementById('gasDataStatusBadge');
    const searchGuide = document.getElementById('gasSearchGuide');

    // Reset UI
    searchInput.value = '';
    searchInput.disabled = true;
    resultsPanel.classList.add('hidden');
    statusContainer.classList.add('hidden');
    loader.classList.remove('hidden');
    if (dataBadge) dataBadge.classList.add('hidden');
    if (searchGuide) {
        searchGuide.textContent = 'Menghubungkan ke database Supabase...';
        searchGuide.className = 'mt-2 text-xs text-gray-400';
    }

    try {
        // OPTIMIZATION: Fetch directly from Supabase instead of GAS
        // Joining registrations with assignments to get status
        const { data, error } = await window.supabaseClient
            .from('registrations')
            .select(`
                id, 
                nama, 
                lembaga, 
                certificate_url, 
                assignments (
                    file_url, 
                    status, 
                    feedback,
                    created_at
                )
            `)
            .eq('training_id', _currentTrainingId);

        if (error) throw error;

        // Map data to expected format for the UI
        _gasParticipantsData = data.map(reg => {
            // Get the most recent assignment if exists
            let latestAsg = null;
            if (reg.assignments && reg.assignments.length > 0) {
                latestAsg = [...reg.assignments].sort((a, b) =>
                    new Date(b.created_at) - new Date(a.created_at)
                )[0];

                // Compatibility: 'approved' status should be treated as 'valid'
                if (latestAsg.status === 'approved') {
                    latestAsg.status = 'valid';
                }
            }

            return {
                id: reg.id,
                nama: reg.nama,
                lembaga: reg.lembaga,
                certificate_url: reg.certificate_url,
                assignment: latestAsg
            };
        });

        // Post-loading Feedback
        if (dataBadge) {
            dataBadge.textContent = `${_gasParticipantsData.length} Peserta Terdaftar`;
            dataBadge.classList.remove('hidden');
        }
        if (searchGuide) {
            searchGuide.textContent = '✅ Data peserta berhasil dimuat!. Silakan ketik nama Anda untuk mengecek status.';
            searchGuide.className = 'mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse';
        }

        // Enable and focus input
        searchInput.disabled = false;
        setTimeout(() => {
            searchInput.focus();
            searchInput.classList.add('ring-2', 'ring-emerald-500/50');
            setTimeout(() => searchInput.classList.remove('ring-2', 'ring-emerald-500/50'), 2000);
        }, 100);

    } catch (err) {
        console.error('Supabase Optimization Error:', err);
        if (searchGuide) {
            searchGuide.textContent = '⚠️ Gagal terhubung ke database. Pastikan koneksi stabil.';
            searchGuide.className = 'mt-2 text-xs text-red-500';
        }
    } finally {
        loader.classList.add('hidden');
    }

    // Search Logic
    searchInput.oninput = (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
            resultsPanel.classList.add('hidden');
            return;
        }

        const filtered = _gasParticipantsData.filter(p => p.nama.toLowerCase().includes(query));

        if (filtered.length > 0) {
            resultsPanel.innerHTML = filtered.map(p => `
                <div onclick="selectParticipant('${p.id}')" class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div class="font-semibold text-gray-900 dark:text-white">${p.nama}</div>
                    <div class="text-xs text-gray-500">${p.lembaga || '-'}</div>
                </div>
            `).join('');
            resultsPanel.classList.remove('hidden');
        } else {
            resultsPanel.innerHTML = '<div class="px-4 py-3 text-sm text-gray-500 italic">Nama tidak ditemukan</div>';
            resultsPanel.classList.remove('hidden');
        }
    };
}

function selectParticipant(regId) {
    const participant = _gasParticipantsData.find(p => p.id === regId);
    if (!participant) return;

    document.getElementById('gasSearchInput').value = participant.nama;
    document.getElementById('gasSearchResults').classList.add('hidden');

    renderParticipantStatus(participant);
}

function renderParticipantStatus(p) {
    const container = document.getElementById('gasStatusContainer');
    container.classList.remove('hidden');

    const asg = p.assignment || null;
    const certUrl = p.certificate_url || null;

    let statusHtml = '';

    if (!asg) {
        // BELUM KUMPUL TUGAS
        statusHtml = `
            <div class="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl">
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold text-blue-900 dark:text-blue-100">Belum Ada Tugas</h4>
                        <p class="text-sm text-blue-700 dark:text-blue-300">Anda belum mengumpulkan tugas untuk pelatihan ini.</p>
                    </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 rounded-xl text-center">
                    <input type="file" id="assignmentFileInput" class="hidden" onchange="handleFileChange(event)">
                    <label for="assignmentFileInput" class="cursor-pointer block p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 transition-all duration-300 hover:border-primary-400">
                        <div class="pointer-events-none w-16 h-16 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                        </div>
                        <p class="pointer-events-none text-sm font-semibold text-gray-700 dark:text-gray-200" id="fileNameLabel">Klik atau tarik file ke sini untuk mengunggah</p>
                        <p class="pointer-events-none text-xs text-gray-500 mt-1">Format: PDF, JPG, PNG (Maks. 5MB)</p>
                    </label>
                </div>
                
                <button onclick="submitAssignment('${p.id}')" id="submitAsgBtn" class="w-full mt-6 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg transition-all hidden">
                    Kirim Tugas Sekarang
                </button>
            </div>
        `;
    } else if (asg.status === 'pending') {
        // MENUNGGU VERIFIKASI
        statusHtml = `
            <div class="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl">
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 anim-pulse">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold text-amber-900 dark:text-amber-100">Menunggu Verifikasi Panitia</h4>
                        <p class="text-sm text-amber-700 dark:text-amber-300">Tugas Anda sedang diperiksa. Harap tunggu konfirmasi.</p>
                    </div>
                </div>
            </div>
            
            <div class="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-center opacity-60 grayscale cursor-not-allowed">
                <p class="text-sm text-gray-500">Sertifikat akan tersedia setelah tugas diverifikasi.</p>
            </div>
        `;
    } else if (asg.status === 'valid') {
        // TUGAS VALID (SIAP DOWNLOAD SERTIFIKAT)
        statusHtml = `
            <div class="p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl">
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold text-emerald-900 dark:text-emerald-100">Tugas Terverifikasi</h4>
                        <p class="text-sm text-emerald-700 dark:text-emerald-300">Tugas Anda telah disetujui. Sertifikat siap diunduh.</p>
                    </div>
                </div>
                
                ${certUrl ? `
                    <a href="${certUrl}" target="_blank" class="w-full inline-flex items-center justify-center gap-3 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                        Unduh Sertifikat PDF
                    </a>
                ` : `
                    <div class="py-4 text-center text-gray-500 italic">Sertifikat sedang dalam proses generate otomatis...</div>
                `}
            </div>
        `;
    } else if (asg.status === 'invalid') {
        // TUGAS DITOLAK
        statusHtml = `
            <div class="p-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl mb-4">
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold text-red-900 dark:text-red-100">Tugas Perlu Perbaikan</h4>
                        <p class="text-sm text-red-700 dark:text-red-300">Mohon maaf, tugas Anda belum dapat diterima.</p>
                    </div>
                </div>
                <div class="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl text-sm border border-red-100 dark:border-red-900/50 italic text-red-800 dark:text-red-300">
                    <strong>Feedback Panitia:</strong> ${asg.feedback || 'Silakan unggah ulang file tugas yang benar.'}
                </div>
            </div>
            
            <div class="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <h5 class="text-sm font-bold mb-4">Kumpulkan Ulang Tugas</h5>
                <input type="file" id="assignmentFileInput" class="hidden" onchange="handleFileChange(event)">
                <label for="assignmentFileInput" class="cursor-pointer block p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-all duration-300 hover:border-red-400 text-center">
                    <p class="pointer-events-none text-sm font-semibold" id="fileNameLabel">Pilih file perbaikan...</p>
                </label>
                <button onclick="submitAssignment('${p.id}')" id="submitAsgBtn" class="w-full mt-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all hidden">
                    Kirim Perbaikan
                </button>
            </div>
        `;
    }

    container.innerHTML = statusHtml;

    // Attach Drag and Drop Listeners AFTER rendering
    const dropZone = container.querySelector('label[for="assignmentFileInput"]');
    if (dropZone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        const highlight = () => {
            dropZone.classList.add('border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-900/30', 'scale-[1.02]');
            dropZone.classList.remove('border-gray-300', 'dark:border-gray-600', 'border-dashed');
            dropZone.classList.add('border-solid');
        };
        const unhighlight = () => {
            dropZone.classList.remove('border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-900/30', 'scale-[1.02]', 'border-solid');
            dropZone.classList.add('border-gray-300', 'dark:border-gray-600', 'border-dashed');
        };

        ['dragenter', 'dragover'].forEach(eventName => dropZone.addEventListener(eventName, highlight, false));
        ['dragleave', 'drop'].forEach(eventName => dropZone.addEventListener(eventName, unhighlight, false));

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files && files.length > 0) {
                handleFileSelect(files[0]);
            }
        }, false);
    }
}

// File Upload Handlers
let _selectedFile = null;

function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
}

function handleFileSelect(file) {
    _selectedFile = file;
    const label = document.getElementById('fileNameLabel');
    if (label) {
        label.textContent = `File terpilih: ${file.name}`;
        label.classList.add('text-primary-600', 'dark:text-primary-400');
    }
    const btn = document.getElementById('submitAsgBtn');
    if (btn) btn.classList.remove('hidden');
}

async function submitAssignment(regId) {
    if (!_selectedFile) return;

    const btn = document.getElementById('submitAsgBtn');
    btn.disabled = true;
    btn.textContent = 'Sedang Mengunggah...';

    try {
        const reader = new FileReader();
        reader.onload = async () => {
            const base64 = reader.result;
            const payload = {
                action: 'upload',
                trainingId: _currentTrainingId,
                registrationId: regId,
                fileData: base64,
                filename: _selectedFile.name,
                folderId: _currentDriveFolderId
            };

            const response = await fetch(_currentGasUrl, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.success) {
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Tugas berhasil dikirim! Silakan tunggu verifikasi panitia.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                // Refresh data
                await initNativeGasUI(_currentGasUrl);
                // Reselect to show pending status
                const updatedP = _gasParticipantsData.find(p => p.id === regId);
                if (updatedP) renderParticipantStatus(updatedP);
            } else {
                Swal.fire({
                    title: 'Gagal',
                    text: 'Gagal: ' + result.message,
                    icon: 'error',
                    confirmButtonText: 'Coba Lagi'
                });
                btn.disabled = false;
                btn.textContent = 'Kirim Ulang';
            }
        };
        reader.readAsDataURL(_selectedFile);
    } catch (err) {
        Swal.fire({
            title: 'Sistem Error',
            text: 'Terjadi kesalahan: ' + err.toString(),
            icon: 'error',
            confirmButtonText: 'Tutup'
        });
        btn.disabled = false;
        btn.textContent = 'Kirim Ulang';
    }
}

// ===================================
// Participants List Integration
// ===================================
async function initParticipantsUI(trainingId) {
    const tableBody = document.getElementById('participantTableBody');
    const emptyView = document.getElementById('participantListEmpty');
    const loader = document.getElementById('participantListLoading');
    const countEl = document.getElementById('participantCount');

    console.log('Fetching participants for training ID:', trainingId);

    // Reset UI
    tableBody.innerHTML = '';
    emptyView.classList.add('hidden');
    loader.classList.remove('hidden');
    countEl.textContent = '0 Peserta';

    if (!trainingId) {
        console.error('No Training ID provided');
        loader.classList.add('hidden');
        tableBody.innerHTML = `<tr><td colspan="3" class="px-6 py-10 text-center text-red-500 font-medium">Error: ID Pelatihan tidak ditemukan.</td></tr>`;
        return;
    }

    try {
        const { data: participants, error } = await window.supabaseClient
            .from('registrations')
            .select('nama, lembaga')
            .eq('training_id', trainingId)
            .eq('payment_status', 'verified');

        if (error) {
            console.error('Supabase Error:', error);
            throw error;
        }

        loader.classList.add('hidden');
        countEl.textContent = `${participants.length} Peserta`;

        if (participants.length === 0) {
            emptyView.classList.remove('hidden');
        } else {
            tableBody.innerHTML = participants.map((p, idx) => `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">${idx + 1}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">${p.nama}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">${p.lembaga || '-'}</td>
                </tr>
            `).join('');
        }
    } catch (err) {
        console.error('Participant Fetch Error:', err);
        loader.classList.add('hidden');
        tableBody.innerHTML = `<tr><td colspan="3" class="px-6 py-10 text-center text-red-500 font-medium">Gagal memuat daftar peserta: ${err.message || err.toString()}</td></tr>`;
    }
}

function openIframeModal(type) {
    if (!currentTrainingData) return;
    const urlMap = {
        register: currentTrainingData.registration_url,
        assignment: currentTrainingData.assignment_url,
        certificate: currentTrainingData.certificate_url,
        gas_webapp: currentTrainingData.gas_url ? `${currentTrainingData.gas_url}?id=${currentTrainingData.id}` : null
    };
    const titleMap = {
        register: 'Daftar Pelatihan',
        assignment: 'Kumpulkan Tugas',
        certificate: 'Unduh Sertifikat',
        gas_webapp: 'Tugas & Sertifikat'
    };
    openIframeModalWithData(urlMap[type], titleMap[type], currentTrainingData.name, type);
}

function closeIframeModal() {
    const modal = document.getElementById('iframeModal');
    const frame = document.getElementById('iframeModalFrame');
    const nativeView = document.getElementById('nativeModalContent');
    const participantsView = document.getElementById('participantListView');

    if (frame) frame.src = '';
    if (modal) modal.classList.add('hidden');
    if (nativeView) nativeView.classList.add('hidden');
    if (participantsView) participantsView.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// ===================================
// Info Modal
// ===================================
const infoModal = document.getElementById('infoModal');
function openInfoModal() { infoModal.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
function closeInfoModal() { infoModal.classList.add('hidden'); document.body.style.overflow = 'auto'; }

// ===================================
// PSLCC Modal
// ===================================
const pslccModal = document.getElementById('pslccModal');
function openPSLCCModal() { pslccModal.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
function closePSLCCModal() { pslccModal.classList.add('hidden'); document.body.style.overflow = 'auto'; }

// ===================================
// Registration Modal
// ===================================
const registrationModal = document.getElementById('registrationModal');
const registrationForm = document.getElementById('registrationForm');
const regErrorMsg = document.getElementById('regErrorMsg');

function openRegistrationModal(trainingId) {
    currentRegistrationTrainingId = trainingId;
    if (regErrorMsg) regErrorMsg.classList.add('hidden');
    registrationModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeRegistrationModal() {
    registrationModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    currentRegistrationTrainingId = null;
}

if (registrationForm) {
    registrationForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!currentRegistrationTrainingId) {
            regErrorMsg.innerText = 'Error: ID Pelatihan tidak ditemukan.';
            regErrorMsg.classList.remove('hidden');
            return;
        }

        const btn = document.getElementById('regSubmitBtn');
        const originalText = btn.innerHTML;
        const originalClass = btn.className;

        btn.disabled = true;
        btn.innerHTML = `<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Memproses Pendaftaran...`;
        regErrorMsg.classList.add('hidden');

        try {
            // Compress and Upload File First
            const fileInput = document.getElementById('regPaymentProof');
            let paymentUrl = null;

            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];

                // Compress
                const options = {
                    maxSizeMB: 0.5,
                    maxWidthOrHeight: 1200,
                    useWebWorker: true
                };

                const compressedFile = await imageCompression(file, options);

                // Upload to Supabase Storage
                const safeName = compressedFile.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
                const fileName = `${Date.now()}_${safeName}`;

                const { data: uploadData, error: uploadError } = await window.supabaseClient
                    .storage
                    .from('payment_proofs')
                    .upload(`proofs/${fileName}`, compressedFile);

                if (uploadError) {
                    throw new Error('Gagal mengunggah bukti pembayaran: ' + uploadError.message);
                }

                // Get public URL
                const { data: publicUrlData } = window.supabaseClient
                    .storage
                    .from('payment_proofs')
                    .getPublicUrl(`proofs/${fileName}`);

                paymentUrl = publicUrlData.publicUrl;
            } else {
                throw new Error('Bukti pembayaran wajib dilampirkan.');
            }

            const formData = {
                training_id: currentRegistrationTrainingId,
                nama: document.getElementById('regNama').value,
                email: document.getElementById('regEmail').value,
                lembaga: document.getElementById('regLembaga').value,
                phone: document.getElementById('regPhone').value,
                payment_url: paymentUrl,
                payment_status: 'pending'
            };

            const { data, error } = await window.supabaseClient
                .from('registrations')
                .insert([formData]);

            if (error) {
                console.error("Supabase Error:", error);
                throw error;
            }

            // Trigger Confirmation Email via GAS
            try {
                let gasUrl = currentTrainingData ? currentTrainingData.gas_url : null;

                // If currentTrainingData is null (e.g. registered from schedule page directly)
                // fetch the gas_url from Supabase
                if (!gasUrl && currentRegistrationTrainingId) {
                    const { data: trainData } = await window.supabaseClient
                        .from('trainings')
                        .select('gas_url')
                        .eq('id', currentRegistrationTrainingId)
                        .single();
                    if (trainData) gasUrl = trainData.gas_url;
                }

                if (gasUrl) {
                    fetch(gasUrl, {
                        method: 'POST',
                        mode: 'no-cors',
                        body: JSON.stringify({
                            action: 'sendRegistrationConfirmation',
                            registration_data: formData
                        })
                    }).catch(err => console.error("Email trigger error:", err));
                }
            } catch (emailErr) {
                console.error("Failed to trigger confirmation email:", emailErr);
            }

            // Sukses
            btn.innerHTML = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Berhasil Terdaftar!`;
            btn.className = "w-full py-4 rounded-xl bg-emerald-600 text-white font-semibold flex justify-center items-center gap-2";

            setTimeout(() => {
                Swal.fire({
                    title: 'Pendaftaran Berhasil!',
                    text: 'Pendaftaran Anda telah berhasil dilakukan! Silakan ikuti kelas dan kumpulkan tugas sesuai jadwal.',
                    icon: 'success',
                    confirmButtonText: 'Siap!'
                }).then(() => {
                    btn.disabled = false;
                    btn.className = originalClass;
                    btn.innerHTML = originalText;
                    registrationForm.reset();
                    closeRegistrationModal();
                });
            }, 1000);

        } catch (err) {
            regErrorMsg.innerText = 'Terjadi kesalahan sistem saat mendaftar: ' + (err.message || 'Error tidak diketahui');
            regErrorMsg.classList.remove('hidden');
            btn.disabled = false;
            btn.className = originalClass;
            btn.innerHTML = originalText;
        }
    });
}

// ===================================
// PDF Generation (Schedule)
// ===================================
function downloadPDF() {
    if (!currentActiveLevel || !currentLevelData) return;
    const data = currentLevelData;
    const title = data.title;

    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<svg class="animate-spin h-4 w-4 mr-2 inline-block" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Membuat PDF...';
    btn.disabled = true;

    let htmlContent = `
        <div style="font-family:'Inter',sans-serif;padding:40px;color:#111827;background:white;">
            <div style="text-align:center;margin-bottom:40px;border-bottom:3px solid #10b981;padding-bottom:20px;">
                <h1 style="font-size:28px;margin:0;color:#10b981;">GESIT</h1>
                <h2 style="font-size:22px;margin:10px 0 0 0;color:#374151;">${title}</h2>
                <p style="color:#6b7280;font-size:14px;margin-top:5px;">Jadwal Pelatihan Tahunan</p>
            </div>
    `;

    data.months.forEach((month, index) => {
        if (month.trainings.length === 0) return;
        htmlContent += `
            <div style="margin-bottom:30px;page-break-inside:avoid;">
                <h3 style="font-size:18px;color:#111827;margin-bottom:15px;background:#f9fafb;padding:10px 15px;border-radius:8px;">
                    ${index + 1}. ${month.name}
                </h3>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
        `;
        month.trainings.forEach(training => {
            const priceText = (!training.price || training.price === 0) ? 'Gratis' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(training.price);
            htmlContent += `
                <div style="padding:12px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;">
                    <div style="font-weight:600;font-size:14px;color:#111827;margin-bottom:4px;">${training.name}</div>
                    <div style="font-size:12px;color:#6b7280;">Durasi: ${training.duration || '1 Hari'}</div>
                    <div style="font-size:12px;color:#10b981;font-weight:600;margin-top:2px;">${priceText}</div>
                </div>
            `;
        });
        htmlContent += `</div></div>`;
    });

    htmlContent += `
            <div style="margin-top:50px;text-align:center;font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:20px;">
                &copy; 2026 GESIT. Platform Pengembangan Guru Indonesia.
            </div>
        </div>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;visibility:hidden;pointer-events:none;';
    document.body.appendChild(iframe);
    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`<!DOCTYPE html><html><head><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"><style>body{margin:0;padding:0;}</style></head><body><div id="capture-area">${htmlContent}</div></body></html>`);
    iframeDoc.close();

    const opt = {
        margin: [10, 10, 10, 10],
        filename: `${title}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollY: 0, scrollX: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    setTimeout(() => {
        const element = iframeDoc.getElementById('capture-area');
        html2pdf().from(element).set(opt).save().then(() => {
            document.body.removeChild(iframe);
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }).catch(err => {
            console.error('PDF Error:', err);
            document.body.removeChild(iframe);
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        });
    }, 500);
}
