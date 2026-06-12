# Hướng Dẫn Chạy Animal Rescue Adventure

Tài liệu này hướng dẫn chạy dự án ở web, build static export, và đồng bộ Android/iOS bằng Capacitor.

## 1. Yêu Cầu

- Node.js 20 trở lên.
- npm đi kèm Node.js.
- Android Studio nếu muốn chạy Android.
- Xcode nếu muốn chạy iOS.

Dự án không cần backend, database, login, hay service bên ngoài để chạy MVP.

## 2. Cài Dependencies

Chạy ở thư mục gốc dự án:

```bash
npm install
```

Lệnh này đọc `package-lock.json` và cài Next.js, Phaser, Capacitor, TypeScript.

## 3. Chạy Web Dev

```bash
npm run dev
```

Mở:

```txt
http://localhost:3000
```

Các route chính:

```txt
/            Home
/levels      Chọn level
/game?level=1 Gameplay
/stickers    Sticker book
/settings    Settings
```

Nếu port `3000` bận:

```bash
npm run dev -- -p 3001
```

Sau đó mở `http://localhost:3001`.

## 4. Kiểm Tra Code

Chạy typecheck:

```bash
npm run typecheck
```

Build production/static export:

```bash
npm run build
```

Sau khi build xong, static files nằm trong:

```txt
out/
```

## 5. Chạy Android Qua Capacitor

Android platform đã có trong thư mục `android/`.

Đồng bộ web build sang Android:

```bash
npm run cap:sync
```

Mở Android Studio:

```bash
npm run cap:android
```

Trong Android Studio, chọn device/emulator rồi bấm Run.

## 6. Chạy iOS Qua Capacitor

iOS platform đã có trong thư mục `ios/`.

Đồng bộ web build sang iOS:

```bash
npm run cap:sync
```

Mở Xcode:

```bash
npm run cap:ios
```

Trong Xcode, chọn simulator/device rồi bấm Run.

## 7. Data, Asset, Audio

Level data:

```txt
data/levels.json
```

Animal/sticker data:

```txt
data/animals.json
data/stickers.json
```

Audio MP3 thật cần đặt theo các path trong level data, ví dụ:

```txt
public/audio/vi/level_001_intro.mp3
public/audio/vi/success_01.mp3
public/audio/vi/try_again_01.mp3
public/audio/vi/reward_01.mp3
```

Khi chưa có MP3, web app sẽ fallback sang browser speech bằng câu thoại cố định trong data.

## 8. Reset Progress Khi Test

Cách dễ nhất:

1. Mở `/settings`.
2. Ở Parent Area, giữ nút reset rồi thả.

Hoặc xoá localStorage của site trong DevTools nếu đang test trên web.

## 9. Lỗi Thường Gặp

### `listen EPERM 0.0.0.0:3000`

Thường xảy ra khi chạy dev server trong môi trường sandbox. Chạy lại trong terminal local:

```bash
npm run dev
```

### Port `3000` đã được dùng

Chạy port khác:

```bash
npm run dev -- -p 3001
```

### Game không có tiếng

Kiểm tra:

- Settings đang bật Sound.
- Browser cho phép phát âm thanh.
- MP3 đã có trong `public/audio/vi/`.

Nếu chưa có MP3, app vẫn dùng browser speech fallback trên web.

### Android/iOS chưa thấy thay đổi mới nhất

Chạy lại:

```bash
npm run cap:sync
```

Sau đó build/run lại trong Android Studio hoặc Xcode.

## 10. Test Trên Android Thật

Yêu cầu:

- Android Studio đã cài đầy đủ Android SDK.
- Điện thoại Android có bật Developer Options.
- USB debugging đã bật.
- Cáp USB tốt, hoặc device đã pair qua wireless debugging.

Các bước:

1. Build và sync web app sang Android:

```bash
npm run cap:sync
```

2. Mở Android project:

```bash
npm run cap:android
```

3. Cắm điện thoại Android vào máy.

4. Trên điện thoại, chọn Allow/Trust khi hiện hộp thoại USB debugging.

5. Trong Android Studio, chọn device thật ở thanh device selector.

6. Bấm Run.

Nếu muốn kiểm tra device bằng terminal:

```bash
adb devices
```

Nếu hiện `unauthorized`, mở khóa điện thoại và bấm Allow USB debugging.

Nếu muốn build APK debug để cài tay:

```bash
cd android
./gradlew assembleDebug
```

APK debug thường nằm ở:

```txt
android/app/build/outputs/apk/debug/app-debug.apk
```

## 11. Test Trên iPhone/iPad Thật

Yêu cầu:

- Máy Mac có Xcode.
- iPhone/iPad kết nối bằng cáp hoặc đã pair với Xcode.
- Apple ID đã đăng nhập trong Xcode.
- Với iOS 16 trở lên, bật Developer Mode trên device.

Các bước:

1. Build và sync web app sang iOS:

```bash
npm run cap:sync
```

2. Mở iOS project:

```bash
npm run cap:ios
```

3. Trong Xcode, mở target `App`.

4. Vào tab Signing & Capabilities.

5. Chọn Team là Apple ID hoặc Apple Developer Team của bạn.

6. Cắm iPhone/iPad, mở khóa máy và bấm Trust This Computer nếu được hỏi.

7. Chọn device thật ở thanh device selector của Xcode.

8. Bấm Run.

Nếu Xcode báo cần bật Developer Mode:

```txt
iPhone/iPad Settings -> Privacy & Security -> Developer Mode -> On
```

Sau đó restart device theo hướng dẫn của iOS rồi chạy lại từ Xcode.

## 12. Khi Nào Cần `cap:sync`

Chạy lại lệnh này mỗi khi có thay đổi ở web app, level data, CSS, Phaser code, hoặc public assets:

```bash
npm run cap:sync
```

Sau đó chạy lại app từ Android Studio hoặc Xcode.

Nếu chỉ sửa native Android/iOS project trực tiếp thì không cần `cap:sync`.
