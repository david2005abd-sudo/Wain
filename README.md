# و — Wain (وين) · Agon Preview

تطبيق Expo / React Native للخرائط والملاحة للعراق. هذا المستودع يُبنى عبر **GitHub Actions** (البناء السحابي) — لا يوجد بناء محلي على الجهاز.

## البناء السحابي

يعمل ملف `.github/workflows/android-build.yml` تلقائياً عند:

- `push` إلى الفرع `main` أو `master`
- `pull_request` إلى الفرع الرئيسي
- أو يدوياً من تبويب **Actions → Android Build → Run workflow**

### ما يفعله الـ Workflow

| # | الخطوة |
|---|--------|
| 1 | `actions/checkout@v4` — سحب الكود |
| 2 | `actions/setup-java@v4` — تثبيت **JDK 17 (Temurin)** |
| 3 | `actions/setup-node@v4` — Node.js 22 مع كاش npm |
| 4 | `npm ci` — تثبيت الاعتماديات من `package-lock.json` |
| 5 | `npm run typecheck` — `tsc --noEmit` |
| 6 | `npx expo prebuild --platform android --no-install --clean` — توليد `android/` (Continuous Native Generation) |
| 7 | `chmod +x ./android/gradlew` |
| 8 | `./gradlew assembleDebug --no-daemon` — بناء الـ APK |
| 9 | `actions/upload-artifact@v4` — رفع الـ APK |

> **ملاحظة مهمة:** المشروع Expo **مُدار** (managed). لا يوجد مجلد `android/` في المستودع ولا ملف `build.gradle`. عندما تدفع الكود، يولّد `expo prebuild` ملفات Gradle تلقائياً من `app.json` في بيئة السيرفر، ثم يعمل `./gradlew` عليها. هذا هو المسار القياسي لـ Expo 57 (Continuous Native Generation).

### تحميل الـ APK

بعد نجاح الـ workflow:

1. افتح صفحة المستودع على GitHub.
2. تبويب **Actions** → اختر آخر تشغيل ناجح (العلامة الخضراء ✓).
3. في الأسفل قسم **Artifacts** → اضغط على `agon-assembleDebug`.
4. يُنزَّل كملف ZIP؛ بعد فك الضغط تجد `app-debug.apk`.

(احتفظ بالملف فترة **30 يوماً** بحسب إعداد `retention-days`.)

### البناء اليدوي (Workflow Dispatch)

بإمكانك تشغيل البناء يدوياً من تبويب Actions، مع اختيار:
- `assembleDebug` (افتراضي) — APK غير موقّع للتجربة.
- `assembleRelease` — يحتاج إعداد توقيع (keystore) عبر secrets ليعمل بشكل نهائي.

## أوامر الرفع إلى GitHub

كل الأوامر تُنفَّذ داخل مجلد المشروع (`agon/`):

```bash
# 1) التهيئة الأولية (مرة واحدة فقط — المستودع مهيأّ مسبقاً في هذه الحالة)
git init -b main

# 2) إضافة الـ remote الخاص بحسابك
git remote add origin https://github.com/david2005abd-sudo/Wain.git

# 3) رفع الفرع الرئيسي وإعداد التتبع
git add .
git commit -m "Android Build: إعداد البناء السحابي عبر GitHub Actions"
git push -u origin main
```

### رفع تعديل لاحق

```bash
git add .
git commit -m "وصف التعديل"
git push
```

## متطلبات محلية (اختياري)

```bash
npm ci
npm run typecheck
npm run build      # expo export --platform all
npx expo doctor    # تشخيص الاعتماديات والإعداد
```

## ملاحظات

- `expo-updates` غير مثبتة، ولذلك أُزيلت `updates.url` و`runtimeVersion` من `app.json` لأنها تُفشل `expo prebuild` على السيرفر.
- `maplibre-gl` تُستخدم في الويب فقط (`MapSurface.web.tsx`)؛ على أندرويد تُستخدم `react-native-webview` (Metro يفضّل `MapSurface.tsx`).
- الخريطة تحتاج اتصالاً بالإنترنت (OpenFreeMap / OpenStreetMap)؛ يوجد بديل محفوظ `assets/maps/baghdad.webp`.
