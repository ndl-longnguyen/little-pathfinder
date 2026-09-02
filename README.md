# Animal Rescue Adventure

MVP game giáo dục cho trẻ 1-6 tuổi: chọn đường, chọn đồ ăn, chọn cầu, đưa bạn động vật về đúng nhà màu.

## Chạy nhanh

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Kiểm tra

```bash
npm run typecheck
npm run build
```

Static export sẽ được tạo trong `out/` để Capacitor đóng gói mobile.

## Mobile

```bash
npm run cap:sync
npm run cap:android
npm run cap:ios
```

Android/iOS platform skeleton đã có sẵn trong repo. `cap:sync` sẽ build web và copy assets mới nhất sang native projects.

## Docs

- [Tổng quan dự án & kiến trúc](docs/PROJECT_OVERVIEW.md)
- [Hướng dẫn chạy chi tiết](docs/RUNNING.md)

## Ghi chú

- Level data nằm ở `data/levels.json`.
- Texture placeholder được tạo bằng Phaser, nên game chạy được trước khi có art thật.
- MP3 được nối theo level data. Khi file audio chưa có, bản web fallback sang browser speech cho các câu thoại đã duyệt.
- Progress/settings dùng Capacitor Preferences khi chạy native, fallback localStorage trên web.
