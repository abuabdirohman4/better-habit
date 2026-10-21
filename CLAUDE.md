# Better Habit — CLAUDE.md

Habit tracker PWA, keluarga Better (payung: Abu Abdirohman). Produk khusus kebiasaan saja;
Better Planner punya habit tracker di dalamnya dan **memakai tabel yang sama**.

- Produksi: `better-habit.vercel.app` · dev: `npm run dev` (port 5103)
- Stack: Next 14.2.4 + React 18 + Tailwind 3 + supabase-js langsung dari klien + SWR + next-pwa.
  Tertinggal dari playbook (Next 16, Tailwind 4) — upgrade di kartu beads `app-mbwh`.
- Issue: beads hub `~/Documents/applications`, label `behabit`.
- Rapor terakhir: vault `3.Resources/programming/building-app/rapor/better-habit.md`.

## Peta kode

| Folder | Isi |
|---|---|
| `app/` | Rute: `dashboard`, `habits`, `add-habit`, `edit-habit`, `manage-habits`, `settings`, `signin`; `page.tsx` = landing |
| `components/` | Satu folder per komponen (`HabitCard/`, `Calendar/`, `Modal/`, …) |
| `hooks/` | Data lewat SWR: `useHabits`, `useHabitLogs`, `useHabitReminder` |
| `lib/` | `supabase/` klien, `landing-copy.ts` (semua teks LP), `types.ts` |
| `utils/habit-stats.ts` | Logika inti streak/statistik + `todayWIB()` |

Aturan `.cursor/rules/*.mdc` lama dan `docs/` sebagian masih era Google Sheets — anggap basi kalau bertentangan dengan kode.

## Database (numpang Better Planner)

- Skema & migrasi tabel habit ada di repo **better-planner** (`supabase/migrations/20260328000001_habit_tracker.sql`), bukan di sini. Ubah skema di sana.
- Keamanan data = RLS `auth.uid() = user_id`. `middleware.ts` hanya mengalihkan halaman, bukan penjaga data.
- **Tabel baru wajib `GRANT` eksplisit (Supabase, berlaku 30 Okt 2026).** Tabel baru di `public` tidak lagi otomatis terbuka ke supabase-js. Migrasi wajib memuat `ENABLE ROW LEVEL SECURITY` + policy + `GRANT SELECT, INSERT, UPDATE, DELETE ON public.<tabel> TO authenticated;`. Tanpa itu query gagal `permission denied` walau kodenya benar.

## Kesalahan yang pasti kamu buat

| Jangan | Lakukan |
|---|---|
| Query `habit_completions` tanpa batas | PostgREST memotong diam-diam di 1000 baris; pakai rentang tanggal / `.range()` (lihat `hooks/useHabitLogs.ts`) |
| `toISOString().split("T")` untuk tanggal | `todayWIB()` di `utils/habit-stats.ts` |
| Aksi (centang/arsip/hapus) gagal hanya ke `console` | Tampilkan pesan ke user + status menunggu di tombol (cegah tap ganda) |
| Teks UI langsung di komponen | Copy LP di `lib/landing-copy.ts`; ikuti sapaan & janji di `docs/brand.md` (belum ada, kartu `app-3ycd`) |
| Menganggap middleware melindungi data | RLS yang melindungi; jangan pakai service-role di klien |

## Perintah

`npm run dev` · `npm run lint` · `npm run format` · rilis lewat skill `/app-release` (tag `v*`).
Belum ada tes — logika `utils/habit-stats.ts` kandidat pertama untuk Vitest.
