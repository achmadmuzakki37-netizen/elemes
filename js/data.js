// Course Data
const courseData = {
    tk: {
        title: "Jadwal Pelatihan TK/PAUD",
        months: [
            {
                name: "Januari",
                trainings: [
                    {
                        name: "Metode Montessori Dasar",
                        duration: "2 Hari",
                        youtubeId: "dQw4w9WgXcQ",
                        // vimeoId: "123456789", // Uncomment untuk menggunakan Vimeo
                        // googleDriveId: "FILE_ID", // Uncomment untuk menggunakan Google Drive
                        // videoUrl: "https://example.com/video.mp4", // Uncomment untuk direct video URL
                        materi: "Metode Montessori adalah suatu metode pendidikan untuk anak-anak, berdasar pada teori psikologi yang berpendapat bahwa anak secara alamiah memiliki kemampuan untuk belajar sendiri. <br/><br/>Poin penting dalam pelatihan ini:<br/>• Menyiapkan Lingkungan Belajar yang Menarik<br/>• Kebebasan yang Terstruktur<br/>• Pembelajaran Sensorik<br/>• Fokus pada Kemandirian Anak",
                        pdf: "docs/montessori_dasar.pdf"
                    },
                    {
                        name: "Penanganan Anak Aktif",
                        duration: "1 Hari",
                        youtubeId: "dQw4w9WgXcQ",
                        materi: "Pelatihan ini memberikan strategi bagi para guru untuk menangani anak-anak yang memiliki tingkat energi tinggi di kelas dengan cara yang positif dan edukatif.<br/><br/>Topik utama:<br/>• Memahami kebutuhan gerakan anak<br/>• Strategi 'Movement Break'<br/>• Teknik menenangkan diri (Calming techniques)<br/>• Komunikasi asertif dengan anak aktif",
                        pdf: "docs/anak_aktif.pdf"
                    }
                ]
            },
            { name: "Februari", trainings: [{ name: "Seni Bercerita untuk Anak", duration: "1 Hari" }, { name: "Musik dan Gerak", duration: "2 Hari" }] },
            { name: "Maret", trainings: [{ name: "Kreativitas Daur Ulang", duration: "1 Hari" }, { name: "Pengenalan Huruf & Angka", duration: "2 Hari" }] },
            { name: "April", trainings: [{ name: "Psikologi Perkembangan Anak", duration: "3 Hari" }, { name: "Manajemen Kelas PAUD", duration: "1 Hari" }] },
            { name: "Mei", trainings: [{ name: "Gizi Seimbang Anak Usia Dini", duration: "1 Hari" }, { name: "P3K untuk Guru PAUD", duration: "1 Hari" }] },
            { name: "Juni", trainings: [{ name: "Evaluasi Pembelajaran PAUD", duration: "2 Hari" }, { name: "Media Pembelajaran Digital", duration: "2 Hari" }] },
            { name: "Juli", trainings: [{ name: "Persiapan Tahun Ajaran Baru", duration: "2 Hari" }, { name: "Komunikasi dengan Ortu", duration: "1 Hari" }] },
            { name: "Agustus", trainings: [{ name: "Pendidikan Karakter", duration: "2 Hari" }, { name: "Permainan Tradisional", duration: "1 Hari" }] },
            { name: "September", trainings: [{ name: "Bahasa Inggris Dasar Anak", duration: "2 Hari" }, { name: "Pengenalan Sains Sederhana", duration: "1 Hari" }] },
            { name: "Oktober", trainings: [{ name: "Seni Rupa untuk Anak", duration: "1 Hari" }, { name: "Pencegahan Bullying Dini", duration: "1 Hari" }] },
            { name: "November", trainings: [{ name: "Dongeng Interaktif", duration: "1 Hari" }, { name: "Stimulasi Motorik Halus", duration: "1 Hari" }] },
            { name: "Desember", trainings: [{ name: "Refleksi Akhir Tahun", duration: "1 Hari" }, { name: "Peran Guru di Era Digital", duration: "1 Hari" }] },
        ]
    },
    sd: {
        title: "Jadwal Pelatihan Sekolah Dasar",
        months: [
            {
                name: "Januari",
                trainings: [
                    {
                        name: "Strategi Literasi Kreatif",
                        duration: "2 Hari",
                        vimeoId: "30957264", // Contoh menggunakan Vimeo
                        materi: "Pelatihan ini dirancang untuk guru SD guna meningkatkan minat baca dan tulis siswa melalui metode yang kreatif dan interaktif.",
                        pdf: "docs/literasi_sd.pdf"
                    },
                    { name: "Matematika Menyenangkan", duration: "2 Hari" }
                ]
            },
            { name: "Februari", trainings: [{ name: "Manajemen Kelas Efektif", duration: "2 Hari" }, { name: "Pendidikan Inklusif Dasar", duration: "3 Hari" }] },
            { name: "Maret", trainings: [{ name: "Sains Eksperimen SD", duration: "2 Hari" }, { name: "Kurikulum Merdeka Dasar", duration: "3 Hari" }] },
            { name: "April", trainings: [{ name: "Teknologi dalam Kelas", duration: "2 Hari" }, { name: "Asesmen Kompetensi Minimum", duration: "2 Hari" }] },
            { name: "Mei", trainings: [{ name: "Pendidikan Karakter SD", duration: "2 Hari" }, { name: "Public Speaking untuk Guru", duration: "1 Hari" }] },
            { name: "Juni", trainings: [{ name: "Project Based Learning", duration: "3 Hari" }, { name: "Evaluasi Rapor Siswa", duration: "1 Hari" }] },
            { name: "Juli", trainings: [{ name: "Persiapan RPP Semester Ganjil", duration: "2 Hari" }, { name: "Ice Breaking Kreatif", duration: "1 Hari" }] },
            { name: "Agustus", trainings: [{ name: "Penguatan Profil Pelajar Pancasila", duration: "2 Hari" }, { name: "Lomba Cerdas Cermat", duration: "1 Hari" }] },
            { name: "September", trainings: [{ name: "Coding untuk Anak SD", duration: "2 Hari" }, { name: "Bahasa Inggris Komunikatif", duration: "2 Hari" }] },
            { name: "Oktober", trainings: [{ name: "Konseling Dasar Siswa SD", duration: "2 Hari" }, { name: "Pencegahan Perundungan", duration: "1 Hari" }] },
            { name: "November", trainings: [{ name: "Media Pembelajaran Video", duration: "2 Hari" }, { name: "Olimpiade Sains Persiapan", duration: "2 Hari" }] },
            { name: "Desember", trainings: [{ name: "Review Kurikulum Tahunan", duration: "2 Hari" }, { name: "Team Building Guru SD", duration: "1 Hari" }] },
        ]
    },
    smp: {
        title: "Jadwal Pelatihan SMP",
        months: [
            {
                name: "Januari",
                trainings: [
                    {
                        name: "Pembelajaran Berdiferensiasi",
                        duration: "2 Hari",
                        youtubeId: "dQw4w9WgXcQ",
                        materi: "Memahami cara mengajar yang menyesuaikan dengan gaya belajar, minat, dan kemampuan siswa yang berbeda-beda di tingkat SMP.",
                        pdf: "docs/diferensiasi_smp.pdf"
                    },
                    { name: "Asesmen Diagnostik", duration: "1 Hari" }
                ]
            },
            { name: "Februari", trainings: [{ name: "STEM Education Dasar", duration: "3 Hari" }, { name: "Literasi Digital Remaja", duration: "1 Hari" }] },
            { name: "Maret", trainings: [{ name: "Psikologi Remaja Awal", duration: "2 Hari" }, { name: "Bimbingan Karir Dasar", duration: "1 Hari" }] },
            { name: "April", trainings: [{ name: "Google Workspace for Education", duration: "2 Hari" }, { name: "Penulisan Karya Ilmiah Guru", duration: "3 Hari" }] },
            { name: "Mei", trainings: [{ name: "Bahasa Asing Pilihan", duration: "3 Hari" }, { name: "Manajemen Konflik Siswa", duration: "1 Hari" }] },
            { name: "Juni", trainings: [{ name: "Design Thinking untuk Guru", duration: "2 Hari" }, { name: "Evaluasi Kinerja Guru", duration: "1 Hari" }] },
            { name: "Juli", trainings: [{ name: "Orientasi Siswa Baru (MPLS)", duration: "2 Hari" }, { name: "Kepemimpinan di Kelas", duration: "1 Hari" }] },
            { name: "Agustus", trainings: [{ name: "Nasionalisme & Wawasan Kebangsaan", duration: "1 Hari" }, { name: "Ekskul Manajemen", duration: "1 Hari" }] },
            { name: "September", trainings: [{ name: "Pembuatan Modul Ajar Digital", duration: "3 Hari" }, { name: "Robotika Dasar", duration: "2 Hari" }] },
            { name: "Oktober", trainings: [{ name: "Sex Education yang Tepat", duration: "1 Hari" }, { name: "Kesehatan Mental Remaja", duration: "2 Hari" }] },
            { name: "November", trainings: [{ name: "Persiapan Ujian Sekolah", duration: "1 Hari" }, { name: "Analisis Butir Soal", duration: "2 Hari" }] },
            { name: "Desember", trainings: [{ name: "Workshop Rencana Tahunan", duration: "2 Hari" }, { name: "Guru Penggerak Intro", duration: "1 Hari" }] },
        ]
    },
    sma: {
        title: "Jadwal Pelatihan SMA/SMK",
        months: [
            {
                name: "Januari",
                trainings: [
                    {
                        name: "Kewirausahaan Siswa",
                        duration: "3 Hari",
                        youtubeId: "dQw4w9WgXcQ",
                        materi: "Menumbuhkan jiwa entrepreneurship pada siswa SMA/SMK melalui proyek nyata dan mindset bisnis yang benar.",
                        pdf: "docs/entrepreneur_sma.pdf"
                    },
                    { name: "Teaching Factory Dasar", duration: "2 Hari" }
                ]
            },
            { name: "Februari", trainings: [{ name: "Persiapan UTBK Siswa", duration: "2 Hari" }, { name: "Manajemen Lab Komputer", duration: "2 Hari" }] },
            { name: "Maret", trainings: [{ name: "Link and Match Industri", duration: "2 Hari" }, { name: "Sertifikasi Kompetensi Guru", duration: "5 Hari" }] },
            { name: "April", trainings: [{ name: "Soft Skill Dunia Kerja", duration: "1 Hari" }, { name: "Public Relations Sekolah", duration: "2 Hari" }] },
            { name: "Mei", trainings: [{ name: "Beasiswa Kuliah Info Session", duration: "1 Hari" }, { name: "Penelitian Tindakan Kelas", duration: "3 Hari" }] },
            { name: "Juni", trainings: [{ name: "Teknologi IoT Dasar", duration: "3 Hari" }, { name: "Desain Grafis untuk Pembelajaran", duration: "2 Hari" }] },
            { name: "Juli", trainings: [{ name: "Budaya Kerja Industri", duration: "2 Hari" }, { name: "Kepemimpinan OSIS", duration: "2 Hari" }] },
            { name: "Agustus", trainings: [{ name: "Peringatan Kemerdekaan & Kreativitas", duration: "1 Hari" }, { name: "Video Editing Dasar", duration: "2 Hari" }] },
            { name: "September", trainings: [{ name: "Digital Marketing Basics", duration: "2 Hari" }, { name: "Akuntansi Dasar SMK", duration: "2 Hari" }] },
            { name: "Oktober", trainings: [{ name: "Kesehatan & Keselamatan Kerja (K3)", duration: "2 Hari" }, { name: "Bahasa Jepang/Jerman Dasar", duration: "3 Hari" }] },
            { name: "November", trainings: [{ name: "Review Portofolio Siswa", duration: "2 Hari" }, { name: "Coaching & Mentoring", duration: "2 Hari" }] },
            { name: "Desember", trainings: [{ name: "Evaluasi Program Tahunan", duration: "2 Hari" }, { name: "Leadership Camp Guru", duration: "2 Hari" }] },
        ]
    }
};

// Advantages Data
const advantagesData = [
    {
        title: "Sertifikat Resmi",
        description: "Dapatkan sertifikat resmi yang diakui oleh dinas pendidikan untuk setiap pelatihan yang diselesaikan.",
        icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>`,
        color: "bg-emerald-500"
    },
    {
        title: "Mentor Ahli",
        description: "Dipandu langsung oleh praktisi dan akademisi berpengalaman di bidangnya masing-masing.",
        icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`,
        color: "bg-blue-500"
    },
    {
        title: "Akses Selamanya",
        description: "Materi dapat diakses kapan saja dan di mana saja tanpa batas waktu, bahkan setelah pelatihan selesai.",
        icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
        color: "bg-amber-500"
    },
    {
        title: "Materi Terupdate",
        description: "Kurikulum yang selalu diperbarui sesuai dengan perkembangan teknologi dan kebijakan pendidikan terbaru.",
        icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`,
        color: "bg-rose-500"
    }
];

// Testimonial Data
const testimonialData = [
    {
        name: "Budi Santoso",
        role: "Guru SDN 01 Lumajang",
        quote: "Pelatihan di GESIT sangat membantu saya memahami implementasi Kurikulum Merdeka dengan cara yang sangat praktis dan menyenangkan.",
        image: "https://i.pravatar.cc/150?u=budi"
    },
    {
        name: "Siti Aminah",
        role: "Kepala Sekolah TK Pertiwi",
        quote: "Materi Montessori yang diberikan sangat mendalam. Kini guru-guru kami lebih percaya diri dalam mengelola kelas berbasis aktivitas.",
        image: "https://i.pravatar.cc/150?u=siti"
    },
    {
        name: "Rifannisa",
        role: "Guru SMK Teknologi",
        quote: "Sangat jarang menemukan platform yang fokus pada pengembangan karakter digital seperti ini. Sangat relevan dengan tantangan hari ini.",
        image: "https://i.pravatar.cc/150?u=hendra"
    }
];
