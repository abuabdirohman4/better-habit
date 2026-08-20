export type Lang = "id" | "en";

// Copy landing page dalam dua bahasa — dipilih lewat toggle, disimpan di localStorage.
export const LANDING_COPY = {
    id: {
        nav: {
            signIn: "Masuk",
            start: "Mulai Sekarang",
            links: [
                { href: "#features", label: "Fitur" },
                { href: "#how", label: "Cara Kerja" },
                { href: "#faq", label: "FAQ" },
            ],
        },
        hero: {
            badge: "Gratis · Bisa dipasang seperti aplikasi",
            title: "Bangun kebiasaan kecil,",
            titleAccent: "jadi dirimu yang lebih baik.",
            subtitle:
                "Pelacak kebiasaan yang tidak cuma centang-centangan. Kamu tetapkan target bulanan, Better Habit yang menghitung streak, persentase keberhasilan, dan menegur kebiasaan yang mulai kamu tinggalkan.",
            ctaPrimary: "Mulai Sekarang — Gratis",
            ctaSecondary: "Lihat cara kerjanya",
        },
        stats: [
            { value: "8", label: "Kategori hidup" },
            { value: "3", label: "Pola frekuensi" },
            { value: "2", label: "Arah kebiasaan" },
            { value: "0", label: "Rupiah biaya" },
        ],
        problem: {
            title: "Kenapa kebiasaan itu gugur di tengah jalan",
            subtitle:
                "Bukan karena kamu malas. Biasanya karena tiga hal ini.",
            items: [
                {
                    title: "Semua ditarget harian",
                    body: "Tidak semua kebiasaan cocok tiap hari. Olahraga 12x sebulan itu target sehat — dipaksa harian malah kamu gagal di hari ketiga lalu berhenti.",
                },
                {
                    title: "Yang berhenti tidak ketahuan",
                    body: "Kebiasaan tidak mati mendadak. Dia pelan-pelan ditinggal, dan kamu baru sadar sebulan kemudian waktu sudah terlanjur jauh.",
                },
                {
                    title: "Cuma bisa menambah, tidak mengurangi",
                    body: "Sebagian perbaikan terbesar justru soal berhenti — berhenti main HP sebelum tidur. Kebanyakan aplikasi tidak punya tempat untuk itu.",
                },
            ],
        },
        features: {
            title: "Yang membuat Better Habit beda",
            subtitle: "Empat hal yang jarang ada bareng di satu aplikasi.",
            items: [
                {
                    title: "Target bulanan, bukan paksaan harian",
                    body: "Pilih daily, weekly, atau flexible. Untuk yang flexible kamu cukup tentukan berapa kali sebulan — progresnya dihitung terhadap target itu, bukan terhadap 30 hari penuh.",
                },
                {
                    title: "Kebiasaan positif dan negatif",
                    body: "Lacak yang ingin kamu bangun sekaligus yang ingin kamu tinggalkan. To-don't list diperlakukan sebagai warga kelas satu, bukan tempelan.",
                },
                {
                    title: "Peringatan kebiasaan terbengkalai",
                    body: "Lewat 30 hari tanpa tercatat, kebiasaan itu muncul di banner dashboard. Kamu diingatkan sebelum lupa sama sekali.",
                },
                {
                    title: "Delapan kategori kehidupan",
                    body: "Spiritual, kesehatan, karir, keuangan, relasi, petualangan, kontribusi. Jadi kelihatan sisi mana yang selama ini kamu abaikan.",
                },
            ],
        },
        how: {
            title: "Tiga langkah, selesai",
            steps: [
                {
                    title: "Buat kebiasaan",
                    body: "Kasih nama, pilih kategori, tentukan frekuensi dan target bulanannya. Setengah menit.",
                },
                {
                    title: "Centang tiap hari",
                    body: "Dashboard cuma menampilkan yang jatuh tempo hari itu. Tidak ada daftar panjang yang bikin ciut.",
                },
                {
                    title: "Baca perkembanganmu",
                    body: "Streak, persentase keberhasilan, dan kalender bulanan per kebiasaan — supaya kelihatan mana yang jalan.",
                },
            ],
        },
        tracking: {
            title: "Angka yang sebenarnya berarti",
            subtitle:
                "Tiap kebiasaan punya halaman sendiri berisi tiga hal ini.",
            items: [
                {
                    label: "Day Streak",
                    body: "Berapa hari berturut-turut kamu bertahan.",
                },
                {
                    label: "Success Rate",
                    body: "Persentase keberhasilan sejak kebiasaan dibuat.",
                },
                {
                    label: "Monthly Progress",
                    body: "Kalender bulan berjalan plus progres terhadap target.",
                },
            ],
        },
        pwa: {
            title: "Pasang di layar utama",
            body: "Better Habit adalah PWA — bisa dipasang di HP seperti aplikasi biasa, tanpa lewat app store. Buka dari home screen, langsung ke dashboard.",
        },
        faq: {
            title: "Pertanyaan yang sering muncul",
            items: [
                {
                    q: "Ini gratis?",
                    a: "Gratis. Tidak ada tier berbayar, tidak ada batas jumlah kebiasaan.",
                },
                {
                    q: "Perlu install dari App Store atau Play Store?",
                    a: "Tidak. Buka lewat browser, lalu pilih \"Add to Home Screen\". Setelah itu jalan seperti aplikasi biasa.",
                },
                {
                    q: "Bedanya daily, weekly, dan flexible apa?",
                    a: "Daily jatuh tempo tiap hari. Weekly jatuh tempo tiap Senin. Flexible tidak pernah menuntut hari tertentu — dinilai murni dari target bulanan yang kamu tetapkan.",
                },
                {
                    q: "Kalau saya lupa mencatat beberapa hari?",
                    a: "Dashboard bisa dimundurkan ke tanggal sebelumnya, jadi catatan yang tertinggal masih bisa diisi.",
                },
                {
                    q: "Data saya aman?",
                    a: "Data disimpan di Supabase dengan row-level security — tiap akun hanya bisa membaca datanya sendiri.",
                },
            ],
        },
        finalCta: {
            title: "Kebiasaan hari ini menentukan dirimu tahun depan.",
            body: "Mulai dari satu kebiasaan kecil. Hari ini.",
            button: "Mulai Sekarang — Gratis",
        },
        footer: { tagline: "Bangun kebiasaan kecil, jadi dirimu yang lebih baik." },
    },
    en: {
        nav: {
            signIn: "Sign In",
            start: "Get Started",
            links: [
                { href: "#features", label: "Features" },
                { href: "#how", label: "How It Works" },
                { href: "#faq", label: "FAQ" },
            ],
        },
        hero: {
            badge: "Free · Installs like an app",
            title: "Build small habits,",
            titleAccent: "build your better self.",
            subtitle:
                "A habit tracker that does more than tick boxes. You set the monthly target; Better Habit counts the streak, the success rate, and flags the habits you've quietly stopped doing.",
            ctaPrimary: "Get Started — Free",
            ctaSecondary: "See how it works",
        },
        stats: [
            { value: "8", label: "Life categories" },
            { value: "3", label: "Frequency modes" },
            { value: "2", label: "Habit directions" },
            { value: "0", label: "Cost to use" },
        ],
        problem: {
            title: "Why habits fall apart",
            subtitle: "It isn't laziness. It's usually one of these three.",
            items: [
                {
                    title: "Everything gets a daily target",
                    body: "Not every habit belongs on a daily streak. Working out 12 times a month is a healthy goal — force it daily and you break on day three, then quit.",
                },
                {
                    title: "Fading habits go unnoticed",
                    body: "Habits rarely die at once. They get quietly dropped, and you only notice a month later when the gap is already wide.",
                },
                {
                    title: "You can only add, never subtract",
                    body: "Some of the biggest wins are about stopping — no phone before bed. Most trackers have nowhere to put that.",
                },
            ],
        },
        features: {
            title: "What makes Better Habit different",
            subtitle: "Four things that rarely show up in one app.",
            items: [
                {
                    title: "Monthly goals, not daily guilt",
                    body: "Pick daily, weekly, or flexible. Flexible habits only need a count per month — progress is measured against that target, not against all 30 days.",
                },
                {
                    title: "Positive and negative habits",
                    body: "Track what you're building alongside what you're quitting. The to-don't list is a first-class citizen, not an afterthought.",
                },
                {
                    title: "Stale habit warnings",
                    body: "Go 30 days without logging one and it surfaces in a dashboard banner. You get nudged before you forget it entirely.",
                },
                {
                    title: "Eight life categories",
                    body: "Spiritual, health, career, finance, relationships, adventure, contribution. So it's obvious which side of life you've been neglecting.",
                },
            ],
        },
        how: {
            title: "Three steps, that's it",
            steps: [
                {
                    title: "Create a habit",
                    body: "Name it, pick a category, set the frequency and monthly target. Takes half a minute.",
                },
                {
                    title: "Check in daily",
                    body: "The dashboard shows only what's due today. No intimidating wall of tasks.",
                },
                {
                    title: "Read your progress",
                    body: "Streak, success rate, and a monthly calendar per habit — so you can see what's actually working.",
                },
            ],
        },
        tracking: {
            title: "Numbers that actually mean something",
            subtitle: "Every habit gets its own page with these three.",
            items: [
                {
                    label: "Day Streak",
                    body: "How many consecutive days you've kept it up.",
                },
                {
                    label: "Success Rate",
                    body: "Your completion percentage since the habit began.",
                },
                {
                    label: "Monthly Progress",
                    body: "This month's calendar plus progress toward your target.",
                },
            ],
        },
        pwa: {
            title: "Put it on your home screen",
            body: "Better Habit is a PWA — install it on your phone like a normal app, no app store required. Open it from the home screen and land straight on your dashboard.",
        },
        faq: {
            title: "Common questions",
            items: [
                {
                    q: "Is it free?",
                    a: "Yes. No paid tiers, no cap on how many habits you track.",
                },
                {
                    q: "Do I need the App Store or Play Store?",
                    a: "No. Open it in your browser and choose \"Add to Home Screen\". After that it behaves like any other app.",
                },
                {
                    q: "What's the difference between daily, weekly, and flexible?",
                    a: "Daily is due every day. Weekly is due each Monday. Flexible never demands a specific day — it's judged purely on the monthly target you set.",
                },
                {
                    q: "What if I forget to log for a few days?",
                    a: "The dashboard scrolls back to earlier dates, so you can still fill in what you missed.",
                },
                {
                    q: "Is my data safe?",
                    a: "Data lives in Supabase behind row-level security — each account can only read its own records.",
                },
            ],
        },
        finalCta: {
            title: "The habits you keep today decide who you are next year.",
            body: "Start with one small habit. Today.",
            button: "Get Started — Free",
        },
        footer: { tagline: "Build small habits, build your better self." },
    },
} as const;
