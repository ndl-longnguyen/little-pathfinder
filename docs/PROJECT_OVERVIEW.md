# Animal Rescue Adventure - Tổng Quan Dự Án & Kiến Trúc

Tài liệu tổng hợp toàn diện về tính năng, kiến trúc kỹ thuật, luồng logic xử lý và hướng dẫn vận hành của dự án **Animal Rescue Adventure** (`little-pathfinder`) sau khi nâng cấp thành trò chơi phiêu lưu cứu hộ động vật theo cốt truyện.

---

## 1. Mục Tiêu & Tầm Nhìn Sản Phẩm

- **Tên dự án:** Animal Rescue Adventure (repo: `little-pathfinder`).
- **Triết lý thiết kế mới:** Chuyển đổi từ cơ chế trắc nghiệm câu hỏi sang **cuộc phiêu lưu giải cứu bạn động vật theo cốt truyện**:
  $$\text{Khám phá thế giới} \longrightarrow \text{Nhận nhiệm vụ cứu hộ} \longrightarrow \text{Chuỗi 2-3 thử thách nhỏ} \longrightarrow \text{Giải cứu thành công & Đại tiệc} \longrightarrow \text{Nhận thưởng & Đón bạn thú về Đảo Rừng}$$
- **Đối tượng người dùng:**
  - *Trẻ em 1–6 tuổi:* Học kỹ năng nhận thức, nguyên nhân - kết quả, màu sắc, động vật, hình dạng, số đếm và tư duy lựa chọn đơn giản.
  - *Phụ huynh:* Tìm kiếm trò chơi lành mạnh, giáo dục, không chứa nội dung gây nghiện hay quảng cáo độc hại.
- **Tiêu chí an toàn cho trẻ (Child Safety):**
  - Chạy **Offline 100%**, không cần server backend, không yêu cầu đăng nhập/tạo tài khoản.
  - Không có quảng cáo từ bên thứ ba (No 3rd-party Ads).
  - Không thu thập thông tin cá nhân của trẻ nhỏ.
  - Không có chat tự do hay User Generated Content.
  - Lời thoại và âm thanh được biên soạn, kiểm duyệt cố định theo kịch bản giáo dục.
- **Định dạng hiển thị:** Thiết kế chuẩn di động màn hình dọc (**Portrait 9:16**, độ phân giải gốc 900x1600), tương thích điện thoại, tablet và desktop browser (tự động căn giữa khung hình đẹp mắt).

---

## 2. Kiến Trúc Công Nghệ (Tech Stack)

| Lớp kiến trúc | Công nghệ sử dụng | Mục đích & Đặc tả |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15+ (App Router, React 19, TypeScript)** | Điều hướng các trang chức năng (Home, Bản Đồ, Đảo Rừng, Stickers, Chơi Tự Do, Phụ Huynh). Cấu hình static export (`output: 'export'`) sẵn sàng deploy Vercel và đóng gói mobile. |
| **Game Engine** | **Phaser 3 (`^3.85.2`)** | Render toàn bộ gameplay trên HTML5 Canvas. Tích hợp thông qua dynamic import trong React component (`GameCanvas`) để tránh lỗi SSR (Server-Side Rendering). |
| **Cơ chế Gameplay** | **Mechanic Abstraction Pattern** | Tách rời logic mini-game khỏi scene qua `BaseMechanic` & `MechanicFactory` (`choose`, `drag_drop`, `find_object`, `counting`). |
| **Lưu trữ dữ liệu** | **ProgressManager v2** | Lưu trữ phiên bản v2 hỗ trợ tự động migration dữ liệu cũ, ghi nhận kỹ năng học tập (`learningProgress`), sao cứu hộ và đồ trang trí. |
| **Bảo vệ Phụ huynh** | **Parent Gate** | Modal câu hỏi toán người lớn bảo vệ cài đặt nhạy cảm và thao tác reset dữ liệu. |
| **Âm thanh & Giọng đọc** | **HTML5 Audio + Web SpeechSynthesis API** | Phát file audio `.mp3` chất lượng cao, tự động ngắt âm thanh cũ an toàn và fallback sang Web SpeechSynthesis (tiếng Việt `vi-VN` / tiếng Anh `en-US`). |

---

## 3. Cấu Trúc Thư Mục & Modules

```txt
little-pathfinder/
├── app/                        # Next.js App Router (UI chính)
│   ├── page.tsx                # Trang chủ (CTA "Tiếp Tục Cuộc Phiêu Lưu", thú cưng tương tác)
│   ├── levels/page.tsx         # Bản Đồ Thế Giới (World Map) tương tác với mốc nhiệm vụ
│   ├── animal-home/page.tsx    # Ngôi Nhà Động Vật (Khu vườn thú sum vầy & đồ trang trí)
│   ├── free-play/page.tsx      # Chơi Tự Do (Âm thanh muôn loài & Rừng xanh tương tác)
│   ├── stickers/page.tsx       # Bộ Sưu Tập Sticker tương tác chạm & đọc fun facts
│   ├── settings/page.tsx       # Góc Phụ Huynh (Báo cáo kỹ năng học tập, Parent Gate)
│   ├── game/                   # Trang chạy game
│   │   ├── page.tsx            # Suspense wrapper
│   │   └── GamePageClient.tsx  # Mount GameCanvas hỗ trợ cả param ?level=X và ?mission=X
│   └── globals.css             # Hệ thống CSS toàn cục cho UI & Responsive
├── components/                 # Các component React tái sử dụng
│   ├── GameCanvas.tsx          # Wrapper khởi tạo và hủy Phaser instance
│   ├── ParentGateModal.tsx     # Modal câu hỏi toán người lớn an toàn cho phụ huynh
│   ├── LevelCard.tsx           # Thẻ hiển thị level cũ
│   ├── Header.tsx              # Thanh điều hướng với 5 khu vực chính
│   └── Button.tsx              # Nút bấm phong cách trẻ em thân thiện
├── data/                       # Dữ liệu tĩnh JSON
│   ├── worlds.json             # Cấu hình thế giới (Rừng Vui Vẻ, Đại Dương, Nông Trại, Thung Lũng Khủng Long)
│   ├── missions.json           # 6 nhiệm vụ giải cứu giàu cốt truyện với các mini challenge
│   ├── animals.json            # 5 bạn thú kèm tính cách và sự thật thú vị giáo dục
│   ├── stickers.json           # 20 sticker kèm fun facts song ngữ
│   └── decorations.json        # 6 vật phẩm trang trí mở khóa cho Đảo Rừng
├── game/                       # Toàn bộ mã nguồn Phaser Engine
│   ├── PhaserGame.ts           # Factory khởi tạo Phaser Game config (FIT scale, 900x1600)
│   ├── types.ts                # TypeScript types & discriminated unions (ChallengeConfig, Progress v2...)
│   ├── mechanics/              # Hệ thống cơ chế mini-game độc lập
│   │   ├── BaseMechanic.ts     # Abstract class cho mọi mechanic
│   │   ├── ChooseMechanic.ts   # Chọn đáp án (màu, nhà, đường, thức ăn, cầu)
│   │   ├── DragDropMechanic.ts # Kéo thả thức ăn cho thú hoặc kéo thú về nhà
│   │   ├── FindObjectMechanic.ts# Tìm đồ vật/con vật ẩn nấp trong bối cảnh
│   │   ├── CountingMechanic.ts # Đếm số lượng mầm non (1, 2, 3) với chuyển động nhảy
│   │   └── MechanicFactory.ts  # Factory khởi tạo mechanic linh hoạt
│   ├── scenes/                 # Các màn hình (Scenes) của Phaser
│   │   ├── BootScene.ts        # Scene đầu vào
│   │   ├── PreloadScene.ts     # Vẽ vector placeholder textures bằng Phaser Graphics
│   │   ├── LevelScene.ts       # Mission Runner: Cốt truyện intro, chuỗi thử thách, Smart Hint
│   │   └── RewardScene.ts      # Đại tiệc ăn mừng, bạn thú nhảy múa, sao vàng, sticker & đồ trang trí
│   └── systems/                # Các hệ thống quản lý logic trò chơi
│       ├── AudioManager.ts     # Quản lý phát audio tĩnh, ngắt thoại cũ, Web Speech fallback
│       ├── LevelManager.ts     # Truy vấn & dev-time validation cho Missions, Worlds, Animals
│       ├── ProgressManager.ts  # Quản lý lưu trữ/đồng bộ tiến độ v2 & tự động migration
│       └── ResponsiveScale.ts  # Chuẩn hóa kích thước 900x1600 và scale options
```

---

## 4. Chi Tiết Tính Năng & Luồng Nghiệp Vụ

### 4.1. Trang Chủ Với 1 CTA Duy Nhất (Continue Adventure)
- Tránh việc trẻ nhỏ bị phân tâm trước quá nhiều nút bấm.
- Nút bấm lớn **"TIẾP TỤC CUỘC PHIÊU LƯU"** tự động dẫn bé vào nhiệm vụ tiếp theo cần giải cứu.
- Bạn thú đồng hành đung đưa, chớp mắt và nhảy tưng bừng khi bé chạm vào.

### 4.2. Bản Đồ Thế Giới Tương Tác (Interactive World Map)
- Đường mòn uốn lượn qua các trạm cứu hộ:
  - Trạm đã qua: Hiện dấu sao vàng ⭐ và bạn thú tương ứng.
  - Trạm hiện tại: Viền sáng rực rỡ kèm nút *"CHƠI NGAY 🚀"*.
  - Trạm chưa tới: Hiển thị biểu tượng khóa an toàn 🔒.
- Khu vực xem trước các thế giới mới: *Đại Dương Kỳ Diệu*, *Nông Trại Mặt Trời*, *Thung Lũng Khủng Long*.

### 4.3. Ngôi Nhà Động Vật (Animal Home)
- Không gian mở nơi các bạn thú đã cứu (Thỏ, Vịt, Gấu, Khỉ, Gấu trúc) cùng sinh sống.
- Bé chạm vào bạn thú để nghe giọng chào, tiếng kêu đặc trưng và sự thật thú vị.
- Các vật phẩm trang trí đã mở khóa (vườn hoa, ao nước, cầu gỗ, rừng trúc, hũ mật, nhà cầu vồng) sẽ xuất hiện tô điểm cho khu vườn.

### 4.4. Khu Chơi Tự Do (Free Play)
- **Tiếng Kêu Muôn Loài (Soundboard):** Chạm vào từng con vật để nghe tiếng kêu vui nhộn.
- **Rừng Xanh Tương Tác:** Chạm vào mặt trời, mây mưa, cầu vồng, bướm hoa để nghe lời thoại khám phá thiên nhiên.

### 4.5. Bộ Sưu Tập Sticker (Interactive Sticker Book)
- Chạm vào huy hiệu đã mở để nghe tên gọi và câu chuyện kiến thức bổ ích.
- Huy hiệu chưa mở hiển thị dạng bóng đen bí ẩn kích thích trí tò mò của trẻ.

### 4.6. Cơ Chế Gợi Ý Thông Minh 3 Cấp Độ (Smart Hint) & Không Phạt (Zero Penalty)
- **Sai lần 1:** Thẻ rung lắc nhẹ + câu động viên thân mật.
- **Sai lần 2:** Đáp án đúng nảy nhẹ / rung rinh gây chú ý.
- **Sai lần 3:** Đáp án đúng phát sáng viền vàng rực rỡ kèm ngón tay chỉ dẫn 👆.
- Tuyệt đối không trừ điểm, không Game Over, không gây áp lực tâm lý cho trẻ.

### 4.7. Góc Phụ Huynh & Bảo Mật Parent Gate
- Cài đặt âm thanh, ngôn ngữ giọng đọc (Việt - Anh), nhóm độ tuổi (1–2, 3–4, 5–6 tuổi).
- Báo cáo thống kê tích cực các kỹ năng bé đã rèn luyện: Màu sắc, Đếm số, Tìm hiểu động vật, Ghép đôi, Quan sát, Khéo léo ngón tay, Tư duy nhân - quả.
- **Parent Gate:** Bảo vệ chức năng nhạy cảm bằng câu hỏi tính nhẩm người lớn, tránh trường hợp trẻ tự xóa mất tiến trình chơi.

---

## 5. Hướng Dẫn Vận Hành & Kiểm Tra

```bash
# Cài đặt dependencies
npm install

# Kiểm tra kiểu TypeScript (Strict 0 error)
npm run typecheck

# Chạy môi trường Web Development
npm run dev

# Build bản tĩnh production (Static Export ra thư mục out/)
npm run build
```
