// ===================================
// Modal & Accordion Logic
// ===================================
const modal = document.getElementById('courseModal');
const modalTitle = document.getElementById('modalTitle');
const monthsContainer = document.getElementById('monthsContainer');
let currentActiveLevel = null;
let currentLevelData = null; // Cache data fetched from Supabase

async function openModal(level) {
    currentActiveLevel = level;
    modalTitle.innerText = "Memuat data...";
    monthsContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center py-12 opacity-50">
            <svg class="animate-spin h-8 w-8 text-primary-500 mb-4" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-500 dark:text-gray-400">Memuat data pelatihan...</p>
        </div>
    `;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    try {
        // 1. Fetch Categories info
        const { data: catData, error: catError } = await window.supabaseClient
            .from('categories')
            .select('*')
            .eq('id', level)
            .single();

        if (catError) throw catError;
        modalTitle.innerText = catData.title;

        // 2. Fetch Trainings
        const { data: trainings, error: trainError } = await window.supabaseClient
            .from('trainings')
            .select('*')
            .eq('category_id', level)
            .order('month_index', { ascending: true });

        if (trainError) throw trainError;

        // 3. Group by month (0-11)
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const groupedData = {
            title: catData.title,
            months: monthNames.map((name, index) => ({
                name: name,
                trainings: trainings.filter(t => t.month_index === index)
            }))
        };
        currentLevelData = groupedData;

        // 4. Render
        monthsContainer.innerHTML = '';
        groupedData.months.forEach((month, index) => {
            const item = document.createElement('div');
            item.className = 'border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-3 bg-white dark:bg-gray-800 transition-colors shadow-sm';

            const header = document.createElement('button');
            header.className = 'w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-left font-semibold text-gray-800 dark:text-gray-200 transition-colors focus:outline-none';
            header.onclick = () => toggleAccordion(index);

            header.innerHTML = `
                <span class="flex items-center gap-3">
                    <span class="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold">${index + 1}</span>
                    ${month.name}
                </span>
                <svg id="icon-${index}" class="w-5 h-5 text-gray-400 transform transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            `;

            const content = document.createElement('div');
            content.id = `content-${index}`;
            content.className = 'hidden bg-white dark:bg-gray-800 p-4 border-t border-gray-100 dark:border-gray-700/50';

            let trainingsHtml = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
            if (month.trainings.length === 0) {
                trainingsHtml += '<p class="text-sm text-gray-400 italic py-2 md:col-span-2">Belum ada pelatihan untuk bulan ini.</p>';
            }
            month.trainings.forEach((training, tIndex) => {
                const durationText = training.duration || "1 Hari";
                const durationColor = durationText.includes('1') ? 'text-emerald-500' : 'text-amber-500';
                trainingsHtml += `
                    <div onclick="openContentModal(${index}, ${tIndex})" 
                         class="group/item flex items-start p-3 rounded-lg border border-gray-50 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 bg-gray-50/50 dark:bg-gray-700/30 transition-all hover:shadow-md cursor-pointer">
                         <div class="mr-3 mt-1">
                            <div class="w-2.5 h-2.5 rounded-full bg-primary-500 group-hover/item:scale-125 transition-transform"></div>
                         </div>
                         <div class="flex-1">
                            <h5 class="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400 transition-colors">${training.name}</h5>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-[10px] font-medium ${durationColor} flex items-center">
                                     <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                     ${durationText}
                                </span>
                                <span class="text-[10px] text-primary-500 font-bold opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center">
                                    Mulai Belajar <svg class="w-2.5 h-2.5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                                </span>
                            </div>
                         </div>
                    </div>
                `;
            });
            trainingsHtml += '</div>';

            content.innerHTML = trainingsHtml;
            item.appendChild(header);
            item.appendChild(content);
            monthsContainer.appendChild(item);
        });

    } catch (err) {
        console.error("Fetch Error:", err);
        monthsContainer.innerHTML = `
            <div class="p-8 text-center">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Gagal Memuat Data</h4>
                <p class="text-gray-500 dark:text-gray-400 mb-6">Pastikan tabel 'categories' dan 'trainings' sudah dibuat di Supabase.</p>
                <button onclick="openModal('${level}')" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">Coba Lagi</button>
            </div>
        `;
    }
}

function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function toggleAccordion(index) {
    const content = document.getElementById(`content-${index}`);
    const icon = document.getElementById(`icon-${index}`);

    content.classList.toggle('hidden');

    if (content.classList.contains('hidden')) {
        icon.classList.remove('rotate-180');
    } else {
        icon.classList.add('rotate-180');
    }
}

// ===================================
// Info Modal Logic
// ===================================
const infoModal = document.getElementById('infoModal');

function openInfoModal() {
    infoModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeInfoModal() {
    infoModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// ===================================
// PSLCC Modal Logic
// ===================================
const pslccModal = document.getElementById('pslccModal');

function openPSLCCModal() {
    pslccModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closePSLCCModal() {
    pslccModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// ===================================
// Training Content Modal Logic
// ===================================
const contentModal = document.getElementById('contentModal');
const contentTitle = document.getElementById('contentTitle');
const contentDuration = document.getElementById('contentDuration');
const contentCategory = document.getElementById('contentCategory');
const contentVideoContainer = document.getElementById('contentVideoContainer');
const materiText = document.getElementById('materiText');
const pdfDownloadBtn = document.getElementById('pdfDownloadBtn');

function openContentModal(monthIndex, trainingIndex) {
    if (!currentLevelData) return;
    const training = currentLevelData.months[monthIndex].trainings[trainingIndex];
    if (!training) return;

    contentTitle.innerText = training.name;
    const durationText = training.duration || "1 Hari";
    contentDuration.innerHTML = `<svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Durasi: ${durationText}`;

    const categoryMap = { tk: 'TK / PAUD', sd: 'SD', smp: 'SMP', sma: 'SMA / SMK' };
    contentCategory.innerText = categoryMap[currentActiveLevel] || 'Lainnya';

    // Video Logic - Support untuk YouTube, Vimeo, dan Google Drive
    const youtubeId = training.youtube_id || 'dQw4w9WgXcQ';
    const vimeoId = training.vimeo_id || null;
    const googleDriveId = training.google_drive_id || null;
    const videoUrl = training.video_url || null;

    let videoHTML = '';

    // Prioritas: Vimeo > Google Drive > Video URL > YouTube
    if (vimeoId) {
        videoHTML = `
            <iframe 
                src="https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0"
                class="absolute inset-0 w-full h-full"
                frameborder="0" 
                allow="autoplay; fullscreen; picture-in-picture" 
                allowfullscreen>
            </iframe>
            <div class="absolute bottom-4 right-4 z-20">
                <a href="https://vimeo.com/${vimeoId}" target="_blank"
                   class="bg-black/60 hover:bg-blue-600 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition-all">
                    <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"/></svg>
                    Tonton di Vimeo
                </a>
            </div>
        `;
    } else if (googleDriveId) {
        videoHTML = `
            <iframe 
                src="https://drive.google.com/file/d/${googleDriveId}/preview"
                class="absolute inset-0 w-full h-full"
                allow="autoplay"
                allowfullscreen>
            </iframe>
            <div class="absolute bottom-4 right-4 z-20">
                <a href="https://drive.google.com/file/d/${googleDriveId}/view" target="_blank"
                   class="bg-black/60 hover:bg-green-600 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition-all">
                    <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.01 1.485c-.276 0-.616.064-.925.174l-7.31 4.233c-.617.357-.925.82-.925 1.383v8.45c0 .563.308 1.026.925 1.383l7.31 4.233c.309.11.649.174.925.174.276 0 .616-.064.925-.174l7.31-4.233c.617-.357.925-.82.925-1.383v-8.45c0-.563-.308-1.026-.925-1.383l-7.31-4.233c-.309-.11-.649-.174-.925-.174zm-.01 2.095l6.5 3.755-6.5 3.755-6.5-3.755 6.5-3.755zm-7.5 5.914l6.5 3.755v7.51l-6.5-3.755v-7.51zm15 0v7.51l-6.5 3.755v-7.51l6.5-3.755z"/></svg>
                    Buka di Drive
                </a>
            </div>
        `;
    } else if (videoUrl) {
        videoHTML = `
            <video 
                class="absolute inset-0 w-full h-full"
                controls
                preload="metadata">
                <source src="${videoUrl}" type="video/mp4">
                Browser Anda tidak mendukung video tag.
            </video>
        `;
    } else {
        videoHTML = `
            <lite-youtube 
                videoid="${youtubeId}" 
                class="absolute inset-0 w-full h-full"
                style="background-image: url('https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg');">
            </lite-youtube>
            <div class="absolute bottom-4 right-4 z-20">
                <a href="https://www.youtube.com/watch?v=${youtubeId}" target="_blank"
                   class="bg-black/60 hover:bg-red-600 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition-all">
                    <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                    Tonton di YouTube
                </a>
            </div>
        `;
    }

    contentVideoContainer.innerHTML = videoHTML;

    materiText.innerHTML = training.materi || "Materi untuk pelatihan ini sedang dalam tahap penyusunan. Harap cek kembali secara berkala untuk mendapatkan materi lengkap, panduan, dan sumber daya pendukung lainnya yang berkaitan dengan topik ini.";

    // Build correct PDF URL: if pdf_path is a bare Google Drive file ID, wrap it in the export URL
    const rawPdf = training.pdf_path;
    if (rawPdf && !rawPdf.startsWith('http') && !rawPdf.includes('/')) {
        // Bare Google Drive file ID → build download URL
        pdfDownloadBtn.href = `https://drive.google.com/uc?export=download&id=${rawPdf}`;
    } else {
        pdfDownloadBtn.href = rawPdf || "#";
    }

    contentModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeContentModal() {
    contentModal.classList.add('hidden');
    contentVideoContainer.innerHTML = '';
}

// ===================================
// PDF Generation Logic
// ===================================
function downloadPDF() {
    if (!currentActiveLevel || !currentLevelData) return;

    const data = currentLevelData;
    const title = data.title;

    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<svg class="animate-spin h-4 w-4 mr-2 inline-block" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...';
    btn.disabled = true;

    let htmlContent = `
        <div style="font-family: 'Inter', sans-serif; padding: 40px; color: #111827; background: white;">
            <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #10b981; padding-bottom: 20px;">
                <h1 style="font-size: 28px; margin: 0; color: #10b981;">EduTrain</h1>
                <h2 style="font-size: 22px; margin: 10px 0 0 0; color: #374151;">${title}</h2>
                <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Jadwal Pelatihan Tahunan - EduTrain Indonesia</p>
            </div>
    `;

    data.months.forEach((month, index) => {
        htmlContent += `
            <div style="margin-bottom: 30px; page-break-inside: avoid;">
                <h3 style="font-size: 18px; color: #111827; margin-bottom: 15px; background: #f9fafb; padding: 10px 15px; border-radius: 8px;">
                    ${index + 1}. ${month.name}
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        `;

        month.trainings.forEach(training => {
            htmlContent += `
                <div style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: #ffffff;">
                    <div style="font-weight: 600; font-size: 14px; color: #111827; margin-bottom: 4px;">${training.name}</div>
                    <div style="font-size: 12px; color: #6b7280; display: flex; align-items: center;">
                        <span style="display: inline-block; width: 10px; height: 10px; background: #10b981; border-radius: 50%; margin-right: 6px;"></span>
                        Durasi: ${training.duration}
                    </div>
                </div>
            `;
        });

        htmlContent += `
                </div>
            </div>
        `;
    });

    htmlContent += `
            <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                &copy; 2024 EduTrain Indonesia. Seluruh hak cipta dilindungi.
            </div>
        </div>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.visibility = 'hidden';
    iframe.style.pointerEvents = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
            <style>
                body { margin: 0; padding: 0; }
            </style>
        </head>
        <body>
            <div id="capture-area">${htmlContent}</div>
        </body>
        </html>
    `);
    iframeDoc.close();

    const opt = {
        margin: [10, 10, 10, 10],
        filename: `${title}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            backgroundColor: '#ffffff',
            scrollY: 0,
            scrollX: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    setTimeout(() => {
        const element = iframeDoc.getElementById('capture-area');
        html2pdf().from(element).set(opt).save().then(() => {
            document.body.removeChild(iframe);
            btn.innerHTML = originalText;
            btn.disabled = false;
        }).catch(err => {
            console.error("PDF Generation Error:", err);
            btn.innerHTML = originalText;
            btn.disabled = false;
            document.body.removeChild(iframe);
        });
    }, 500);
}

// ===================================
// Registration Modal Logic
// ===================================
const registrationModal = document.getElementById('registrationModal');
const registrationForm = document.getElementById('registrationForm');

function openRegistrationModal() {
    registrationModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeRegistrationModal() {
    registrationModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

if (registrationForm) {
    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.innerText;

        btn.disabled = true;
        btn.innerText = 'Pendaftaran Terkirim...';

        // Simulating submission
        setTimeout(() => {
            alert('Pendaftaran Anda telah berhasil dikirim! Kami akan menghubungi Anda melalui email soon.');
            btn.disabled = false;
            btn.innerText = originalText;
            registrationForm.reset();
            closeRegistrationModal();
        }, 1500);
    });
}
