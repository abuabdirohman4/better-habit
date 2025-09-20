# Versioning & Release Prompts

## Quick Release Commands

### 🐛 Bug Fix Release (Patch)
```
Saya mau melakukan bug fix release. Tolong bantu saya:
1. Update CHANGELOG.md dengan bug fixes yang sudah saya lakukan
2. Jalankan patch release script
3. Push ke GitHub dengan tag
4. Verifikasi semua proses berjalan dengan benar

Bug fixes yang sudah dilakukan:
- [Deskripsikan bug fixes yang sudah Anda lakukan]
- [Contoh: Fixed calendar display issue]
- [Contoh: Resolved PWA installation bug]
```

### ✨ Feature Release (Minor)
```
Saya mau melakukan feature release. Tolong bantu saya:
1. Update CHANGELOG.md dengan fitur baru yang sudah saya buat
2. Jalankan minor release script
3. Push ke GitHub dengan tag
4. Verifikasi semua proses berjalan dengan benar

Fitur baru yang sudah ditambahkan:
- [Deskripsikan fitur baru yang sudah Anda buat]
- [Contoh: Added habit streak tracking]
- [Contoh: Implemented calendar view]
```

### 🔥 Major Release (Major)
```
Saya mau melakukan major release. Tolong bantu saya:
1. Update CHANGELOG.md dengan perubahan besar yang sudah saya lakukan
2. Jalankan major release script
3. Push ke GitHub dengan tag
4. Verifikasi semua proses berjalan dengan benar

Perubahan besar yang sudah dilakukan:
- [Deskripsikan perubahan besar yang sudah Anda lakukan]
- [Contoh: Complete UI redesign]
- [Contoh: New authentication system]
```

### 🧪 Pre-release (Alpha/Beta)
```
Saya mau melakukan pre-release. Tolong bantu saya:
1. Update CHANGELOG.md dengan fitur yang sedang dalam testing
2. Jalankan prerelease script
3. Push ke GitHub dengan tag
4. Verifikasi semua proses berjalan dengan benar

Fitur yang sedang dalam testing:
- [Deskripsikan fitur yang sedang dalam testing]
- [Contoh: New analytics dashboard (alpha)]
- [Contoh: Social features (beta)]
```

## Detailed Release Prompts

### 📝 Update Changelog Only
```
Tolong bantu saya update CHANGELOG.md untuk release yang akan datang:

Perubahan yang sudah saya lakukan:
- [List semua perubahan yang sudah Anda buat]
- [Kategorikan ke: Added, Changed, Fixed, Removed, Security]
- [Gunakan format yang user-friendly]

Contoh:
- Added: Habit streak tracking with fire emoji indicators
- Fixed: Calendar not displaying habit completions correctly
- Changed: Improved mobile responsiveness for habit cards
```

### 🔄 Version Bump Only
```
Tolong bantu saya jalankan version bump untuk [patch|minor|major|prerelease]:

Jenis release: [pilih salah satu]
Alasan: [jelaskan mengapa perlu release ini]
```

### 🚀 Complete Release Process
```
Tolong bantu saya melakukan complete release process:

1. Review semua perubahan yang sudah saya commit
2. Update CHANGELOG.md dengan perubahan tersebut
3. Jalankan version script yang sesuai
4. Push ke GitHub dengan tag
5. Verifikasi semua proses berjalan dengan benar
6. Berikan summary release yang sudah dibuat

Jenis release: [patch|minor|major|prerelease]
```

## Emergency Release Prompts

### 🚨 Hotfix Release
```
URGENT: Saya perlu melakukan hotfix release untuk bug kritis:

Bug kritis yang perlu diperbaiki:
- [Deskripsikan bug kritis]
- [Contoh: Authentication not working]
- [Contoh: Data not syncing with Google Sheets]

Tolong bantu saya:
1. Update CHANGELOG.md dengan hotfix
2. Jalankan patch release script
3. Push ke GitHub dengan tag
4. Verifikasi deployment
```

### 🔄 Rollback Release
```
Saya perlu melakukan rollback ke versi sebelumnya:

Versi yang akan di-rollback: [contoh: v1.1.0]
Alasan rollback: [jelaskan mengapa perlu rollback]

Tolong bantu saya:
1. Checkout ke versi sebelumnya
2. Update CHANGELOG.md dengan rollback info
3. Create rollback release
4. Push ke GitHub
```

## Verification Prompts

### ✅ Check Release Status
```
Tolong bantu saya verifikasi status release:

1. Check current version di package.json
2. Check git tags yang tersedia
3. Check CHANGELOG.md terbaru
4. Check status git repository
5. Berikan summary status release
```

### 🔍 Review Release
```
Tolong bantu saya review release yang akan dibuat:

1. Review semua perubahan di CHANGELOG.md
2. Check apakah version number sudah benar
3. Verify git tags sudah dibuat
4. Check apakah ada yang missing
5. Berikan rekomendasi perbaikan jika ada
```

## Custom Prompts

### 🎯 Specific Feature Release
```
Saya mau release fitur [nama fitur]. Tolong bantu saya:

Fitur: [nama fitur]
Deskripsi: [deskripsi fitur]
Jenis release: [patch|minor|major]
Dampak: [dampak ke user]

Tolong bantu saya:
1. Update CHANGELOG.md dengan fitur ini
2. Jalankan release script
3. Push ke GitHub
4. Verifikasi release
```

### 🔧 Technical Release
```
Saya mau release perubahan teknis. Tolong bantu saya:

Perubahan teknis:
- [List perubahan teknis]
- [Contoh: Updated dependencies]
- [Contoh: Improved performance]
- [Contoh: Fixed security issues]

Jenis release: [patch|minor|major]
Tolong bantu saya dengan complete release process
```

## Usage Instructions

### 📋 How to Use These Prompts

1. **Copy prompt yang sesuai** dengan jenis release yang Anda mau
2. **Isi bagian yang kosong** dengan detail perubahan Anda
3. **Paste ke Cursor** dan AI akan membantu Anda
4. **Follow instructions** yang diberikan AI
5. **Verify hasil** sebelum melanjutkan

### 🎯 Tips for Better Results

- **Be specific** tentang perubahan yang sudah Anda lakukan
- **Include examples** untuk bug fixes atau fitur baru
- **Mention impact** ke user experience
- **Check git status** sebelum meminta bantuan
- **Review CHANGELOG** sebelum release

### ⚡ Quick Commands

```bash
# Check current status
git status
npm version

# Quick patch release
./scripts/version.sh patch

# Quick minor release
./scripts/version.sh minor

# Quick major release
./scripts/version.sh major
```

---

**📚 Related Files**: `CHANGELOG.md`, `VERSION.md`, `scripts/version.sh`
**🔧 Scripts**: `./scripts/version.sh [patch|minor|major|prerelease]`
**📋 Guidelines**: See versioning.mdc for detailed guidelines






