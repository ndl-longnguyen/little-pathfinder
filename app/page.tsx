'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { LinkButton } from '@/components/Button';
import { Footer } from '@/components/Footer';
import { AudioManager } from '@/game/systems/AudioManager';
import { LevelManager } from '@/game/systems/LevelManager';
import { ProgressManager } from '@/game/systems/ProgressManager';
import type { Language, Progress, Settings } from '@/game/types';
import { pick, HOME } from '@/lib/i18n';

export default function HomePage() {
  const [progress, setProgress] = useState<Progress>(ProgressManager.defaultProgress);
  const [companionBounce, setCompanionBounce] = useState(false);
  const [settings, setSettings] = useState<Settings>(ProgressManager.defaultSettings);

  useEffect(() => {
    let alive = true;

    async function load() {
      const [saved, savedSettings] = await Promise.all([
        ProgressManager.getProgress(),
        ProgressManager.getSettings(),
      ]);
      if (alive) {
        setProgress(saved);
        setSettings(savedSettings);
      }
    }

    void load();
    window.addEventListener('progress-changed', load);
    window.addEventListener('settings-changed', load);

    return () => {
      alive = false;
      window.removeEventListener('progress-changed', load);
      window.removeEventListener('settings-changed', load);
    };
  }, []);

  const nextMission = useMemo(
    () => LevelManager.getNextPlayableMission(progress),
    [progress],
  );

  const completedMissionsCount = progress.completedMissions?.length ?? progress.completedLevels.length;
  const unlockedAnimalsCount = progress.unlockedAnimals?.length ?? 0;
  const totalMissions = LevelManager.getMissions().length;
  const totalAnimals = LevelManager.getAnimals().length;
  const animalEmojis: Record<string, { emoji: string; nameVi: string; nameEn: string; sound: string }> = {
    rabbit: { emoji: '🐰', nameVi: 'Bạn Thỏ', nameEn: 'Bunny', sound: 'Khịt khịt! Tớ là bạn Thỏ đây!' },
    duck: { emoji: '🦆', nameVi: 'Bạn Vịt', nameEn: 'Duck', sound: 'Cạp cạp! Vịt con sẵn sàng rồi!' },
    bear: { emoji: '🐻', nameVi: 'Bác Gấu', nameEn: 'Bear', sound: 'Gừ gừ! Bác Gấu chào bé!' },
    monkey: { emoji: '🐵', nameVi: 'Bạn Khỉ', nameEn: 'Monkey', sound: 'Khẹc khẹc! Khỉ con thích leo trèo!' },
    panda: { emoji: '🐼', nameVi: 'Gấu Trúc', nameEn: 'Panda', sound: 'Rôm rốp! Gấu trúc ăn trúc ngon quá!' },
    dolphin: { emoji: '🐬', nameVi: 'Cá Heo', nameEn: 'Dolphin', sound: 'Chít chít! Cá heo lướt sóng cùng bé!' },
    turtle: { emoji: '🐢', nameVi: 'Rùa Biển', nameEn: 'Sea Turtle', sound: 'Bì bõm! Rùa biển bơi êm ả!' },
    octopus: { emoji: '🐙', nameVi: 'Bạch Tuộc', nameEn: 'Octopus', sound: 'Xì xào! Bạch tuộc có 8 xúc tu!' },
    crab: { emoji: '🦀', nameVi: 'Cua Càng', nameEn: 'Crab', sound: 'Lách cách! Cua càng vẫy tay chào!' },
    whale: { emoji: '🐳', nameVi: 'Cá Voi', nameEn: 'Whale', sound: 'Ù ù! Bác cá voi hát ca!' },
  };

  const companion = animalEmojis[nextMission.animalId] || animalEmojis.rabbit;

  function handleTapCompanion() {
    setCompanionBounce(true);
    AudioManager.speak(companion.sound, settings.language);
    setTimeout(() => setCompanionBounce(false), 500);
  }

  return (
    <main className="home-scene">
      {/* Upper Forest Interactive Game World */}
      <div className="home-layout">
        <section className="home-copy" aria-labelledby="home-title">
          <div className="world-badge">
            <span>🌲</span>
            <span>{pick(HOME.worldBadge, settings.language)}</span>
          </div>

          <h1 className="home-title" id="home-title">
            Animal Rescue Adventure
          </h1>

          <p className="home-subtitle">
            {pick(HOME.subtitle, settings.language)}
          </p>

          {/* Primary Big Call To Action */}
          <div>
            <Link
              href={`/game?level=${nextMission.id}`}
              className="cta-continue"
              aria-label="Tiếp tục cuộc phiêu lưu"
            >
              <span>🚀</span>
              <span>TIẾP TỤC CUỘC PHIÊU LƯU</span>
            </Link>
          </div>

          {/* Progress Indicators */}
          <div className="home-progress" aria-label="Tiến độ cuộc phiêu lưu">
            <div className="stat-tile">
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '4px' }}>🎯</span>
              <span className="stat-number">
                {completedMissionsCount}/{totalMissions}
              </span>
              <span className="stat-label">Nhiệm vụ đã cứu</span>
            </div>
            <div className="stat-tile">
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '4px' }}>🐾</span>
              <span className="stat-number">
                {unlockedAnimalsCount}/{totalAnimals}
              </span>
              <span className="stat-label">Bạn thú trở về</span>
            </div>
            <div className="stat-tile">
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '4px' }}>⭐</span>
              <span className="stat-number">{progress.unlockedStickers.length}</span>
              <span className="stat-label">Sticker thu thập</span>
            </div>
          </div>

          {/* Secondary Quick Navigation */}
          <div className="home-actions" aria-label="Lựa chọn khám phá khác">
            <LinkButton href="/levels" variant="secondary">
              🗺️ Bản Đồ Thế Giới
            </LinkButton>
            <LinkButton href="/animal-home" variant="secondary">
              🏡 Ngôi Nhà Động Vật
            </LinkButton>
            <LinkButton href="/stickers" variant="secondary">
              ⭐ Bộ Sưu Tập
            </LinkButton>
            <LinkButton href="/free-play" variant="ghost">
              🎈 Chơi Tự Do
            </LinkButton>
            <LinkButton href="/settings" variant="ghost">
              ⚙️ Phụ Huynh
            </LinkButton>
          </div>
        </section>

        {/* Forest Stage with Enlarged Animated Mascot Avatar */}
        <section
          className="forest-stage"
          aria-label="Sân khấu khu rừng"
        >
          <div className="stage-hill" />
          <div className="stage-mascot-wrapper">
            <div className="stage-mascot-speech">
              <span>Chào bé! Tớ là {companion.nameVi}. Chạm vào tớ để chơi nhé! 🚀</span>
            </div>
            <div
              className="stage-mascot-avatar"
              onClick={handleTapCompanion}
              style={{
                transform: companionBounce ? 'scale(1.25) translateY(-24px)' : undefined,
              }}
              title="Chạm vào tớ nhé!"
            >
              <span className="stage-mascot-emoji">{companion.emoji}</span>
            </div>
            <div className="stage-house-emoji">
              <span>🏡</span>
            </div>
          </div>
        </section>
      </div>

      {/* Educational Information & Parents Guide Section */}
      <section className="parents-guide-container" aria-label="Góc Phụ Huynh & Thông Tin Giáo Dục">
        <div className="parents-guide-inner">
          <div className="parents-badge">
            <span>🎓</span>
            <span>Góc Phụ Huynh &amp; Ý Nghĩa Sư Phạm</span>
          </div>

          <h2 className="parents-title">
            Phương Pháp Học Tập Vừa Chơi Vừa Khám Phá Cho Trẻ 1–6 Tuổi
          </h2>
          <p className="parents-desc">
            Animal Rescue Adventure được thiết kế bởi đội ngũ kỹ sư và cố vấn mầm non, hướng tới môi trường chơi điện tử lành mạnh, không gây nghiện, kích thích tư duy độc lập và gieo mầm tình yêu thiên nhiên cho bé ngay từ những năm tháng đầu đời.
          </p>

          {/* 4 Educational Pillars */}
          <div className="edu-grid">
            <div className="edu-card">
              <span className="edu-card-icon">🧩</span>
              <h3 className="edu-card-title">Tư Duy Nhân - Quả &amp; Logic</h3>
              <p className="edu-card-text">
                Bé học cách quan sát và kết nối sự việc: sửa lại nhịp cầu gãy để bạn thỏ đi qua, dập đốm lửa để bảo vệ tổ chim, hay hái quả mọng cho bạn khỉ đói.
              </p>
            </div>

            <div className="edu-card">
              <span className="edu-card-icon">🎨</span>
              <h3 className="edu-card-title">Nhận Biết Màu Sắc &amp; Con Vật</h3>
              <p className="edu-card-text">
                Hình ảnh minh họa thân thiện, màu sắc tươi sáng giúp bé dễ dàng phân biệt các tông màu cơ bản và nhận diện đặc điểm sinh học của muông thú.
              </p>
            </div>

            <div className="edu-card">
              <span className="edu-card-icon">🖐️</span>
              <h3 className="edu-card-title">Rèn Luyện Vận Động Tinh</h3>
              <p className="edu-card-text">
                Thao tác chạm, kéo thả đồ vật định hướng trên màn hình cảm ứng giúp hoàn thiện sự phối hợp tay - mắt và kỹ năng điều khiển ngón tay linh hoạt.
              </p>
            </div>

            <div className="edu-card">
              <span className="edu-card-icon">🌱</span>
              <h3 className="edu-card-title">Giáo Dục Lòng Nhân Ái</h3>
              <p className="edu-card-text">
                Mỗi màn chơi là một hành trình giải cứu bạn bè khỏi hiểm nguy, dạy trẻ biết quan tâm, sẻ chia và có ý thức bảo vệ môi trường sinh thái xung quanh.
              </p>
            </div>
          </div>

          {/* Parents Age Guide Box */}
          <div className="age-guide-box">
            <div className="flex items-center gap-2">
              <span className="text-xl">💡</span>
              <h3 className="text-base sm:text-lg font-bold text-[var(--leaf-deep)] m-0">
                Gợi Ý Đồng Hành Cùng Bé Theo Từng Giai Đoạn Phát Triển
              </h3>
            </div>

            <div className="age-grid">
              <div className="age-card">
                <span className="age-card-badge">Giai đoạn 1 – 2 tuổi</span>
                <p className="text-xs text-[var(--muted)] leading-relaxed m-0">
                  Ba mẹ hãy chơi cùng, đọc to tên từng con vật và giả tiếng kêu vui tai để kích thích phản xạ ngôn ngữ và tạo sự gắn kết gia đình.
                </p>
              </div>

              <div className="age-card">
                <span className="age-card-badge">Giai đoạn 3 – 4 tuổi</span>
                <p className="text-xs text-[var(--muted)] leading-relaxed m-0">
                  Khuyến khích bé tự đưa ra quyết định tìm đường, hỏi bé: "Theo con bạn gấu đang muốn ăn gì nhỉ?" để rèn tính kiên nhẫn và tự lập.
                </p>
              </div>

              <div className="age-card">
                <span className="age-card-badge">Giai đoạn 5 – 6 tuổi</span>
                <p className="text-xs text-[var(--muted)] leading-relaxed m-0">
                  Thử thách bé với các mê cung nhiều ngã rẽ, cùng đếm số lượng sticker sưu tập và gợi ý bé kể lại một câu chuyện rừng xanh theo tưởng tượng.
                </p>
              </div>
            </div>
          </div>

          {/* Safety & Compliance Strip */}
          <div className="safety-strip">
            <div className="safety-item">
              <span className="safety-item-icon">🛡️</span>
              <div>
                <h4 className="safety-item-title">100% Không Quảng Cáo</h4>
                <p className="safety-item-desc">
                  Tuyệt đối không có banner hay video quảng cáo làm gián đoạn trải nghiệm của trẻ.
                </p>
              </div>
            </div>

            <div className="safety-item">
              <span className="safety-item-icon">🔒</span>
              <div>
                <h4 className="safety-item-title">Bảo Vệ Quyền Riêng Tư (COPPA)</h4>
                <p className="safety-item-desc">
                  Không thu thập dữ liệu cá nhân, không yêu cầu đăng ký hay cấp quyền nhạy cảm.
                </p>
              </div>
            </div>

            <div className="safety-item">
              <span className="safety-item-icon">✈️</span>
              <div>
                <h4 className="safety-item-title">Chơi Offline Tiện Lợi</h4>
                <p className="safety-item-desc">
                  Tiến độ chơi được lưu an toàn trực tiếp trên máy, bé có thể chơi bất cứ lúc nào không cần mạng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
