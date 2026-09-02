'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { ParentGateModal } from '@/components/ParentGateModal';
import { ProgressManager } from '@/game/systems/ProgressManager';
import type { AgeMode, Language, Progress, Settings } from '@/game/types';

const languages: Array<{ label: string; value: Language }> = [
  { label: 'Tiếng Việt', value: 'vi' },
  { label: 'English', value: 'en' },
];

const ageModes: Array<{ label: string; value: AgeMode }> = [
  { label: '1–2 tuổi', value: '1-2' },
  { label: '3–4 tuổi', value: '3-4' },
  { label: '5–6 tuổi', value: '5-6' },
];

const skillDisplayNames: Record<string, { vi: string; en: string; icon: string }> = {
  color: { vi: 'Nhận biết màu sắc', en: 'Colors', icon: '🎨' },
  counting: { vi: 'Đếm số lượng', en: 'Counting', icon: '🔢' },
  animalRecognition: { vi: 'Tìm hiểu động vật', en: 'Animals', icon: '🐾' },
  matching: { vi: 'Ghép đôi & Chọn lọc', en: 'Matching', icon: '🧩' },
  observation: { vi: 'Quan sát tinh mắt', en: 'Observation', icon: '🔍' },
  fineMotor: { vi: 'Khéo léo ngón tay', en: 'Fine Motor', icon: '👆' },
  causeEffect: { vi: 'Tư duy nhân - quả', en: 'Logic & Cause', icon: '💡' },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(ProgressManager.defaultSettings);
  const [progress, setProgress] = useState<Progress>(ProgressManager.defaultProgress);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [resetFeedback, setResetFeedback] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      const [savedSettings, savedProgress] = await Promise.all([
        ProgressManager.getSettings(),
        ProgressManager.getProgress(),
      ]);

      if (alive) {
        setSettings(savedSettings);
        setProgress(savedProgress);
      }
    }

    void load();
    window.addEventListener('settings-changed', load);
    window.addEventListener('progress-changed', load);

    return () => {
      alive = false;
      window.removeEventListener('settings-changed', load);
      window.removeEventListener('progress-changed', load);
    };
  }, []);

  async function updateSettings(next: Partial<Settings>) {
    const saved = await ProgressManager.saveSettings({ ...settings, ...next });
    setSettings(saved);
  }

  async function handleConfirmedReset() {
    setIsGateOpen(false);
    await ProgressManager.resetProgress();
    setResetFeedback(true);
    setTimeout(() => setResetFeedback(false), 3000);
  }

  const completedMissionsCount = progress.completedMissions?.length ?? progress.completedLevels.length;
  const rescuedAnimalsCount = progress.unlockedAnimals?.length ?? 0;
  const learningProgress = progress.learningProgress ?? {};

  return (
    <main className="app-shell page-band">
      <div className="page-inner">
        <Header />

        <div className="page-title-row">
          <div>
            <h1>Góc Phụ Huynh & Cài Đặt</h1>
            <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontWeight: 800 }}>
              Không gian điều chỉnh trải nghiệm học tập an toàn cho bé
            </p>
          </div>
          <span className="compact-status">
            Đã hoàn thành: {completedMissionsCount} nhiệm vụ
          </span>
        </div>

        <section className="settings-grid" aria-label="Bảng điều khiển phụ huynh">
          {/* Main Controls Panel */}
          <div className="settings-panel">
            <h2>Âm Thanh & Lời Thoại</h2>
            <div className="control-row">
              <button
                aria-pressed={settings.sound}
                className={`toggle-button ${settings.sound ? 'on' : 'off'}`}
                onClick={() => void updateSettings({ sound: !settings.sound })}
                type="button"
              >
                <span>{settings.sound ? 'Bật âm thanh' : 'Tắt âm thanh'}</span>
                <span aria-hidden="true" className="toggle-knob" />
              </button>
            </div>

            <h2>Ngôn Ngữ Giọng Đọc</h2>
            <div className="control-row">
              <div className="segmented">
                {languages.map((language) => (
                  <button
                    className={`segment-button ${settings.language === language.value ? 'active' : ''}`}
                    key={language.value}
                    onClick={() => void updateSettings({ language: language.value })}
                    type="button"
                  >
                    {language.label}
                  </button>
                ))}
              </div>
            </div>

            <h2>Nhóm Tuổi Của Bé</h2>
            <div className="control-row">
              <div className="segmented">
                {ageModes.map((ageMode) => (
                  <button
                    className={`segment-button ${settings.ageMode === ageMode.value ? 'active' : ''}`}
                    key={ageMode.value}
                    onClick={() => void updateSettings({ ageMode: ageMode.value })}
                    type="button"
                  >
                    {ageMode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Skills Summary */}
            <h2 style={{ marginTop: '28px' }}>Kỹ Năng Bé Đã Rèn Luyện</h2>
            <p style={{ margin: '0 0 12px', color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 800 }}>
              Ghi nhận các thử thách tích cực mà bé đã tương tác:
            </p>
            <div className="skills-summary-grid">
              {Object.entries(skillDisplayNames).map(([key, item]) => {
                const count = learningProgress[key] || 0;
                return (
                  <div className="skill-tile" key={key}>
                    <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                    <span className="skill-count">{count}</span>
                    <span className="skill-name">
                      {settings.language === 'vi' ? item.vi : item.en}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Parent Security & Data Management Panel */}
          <aside className="settings-panel">
            <h2>Khu Vực Bảo Mật Phụ Huynh</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
              Mọi hành động nhạy cảm đều được bảo vệ bởi Parent Gate (câu hỏi toán người lớn) để bé không vô tình bấm nhầm.
            </p>

            <div className="control-row">
              <span className="control-label">Tiến Độ Hiện Tại</span>
              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '2px solid var(--line)' }}>
                <div style={{ fontWeight: 900, color: 'var(--leaf-deep)', marginBottom: '4px' }}>
                  🐾 {rescuedAnimalsCount}/5 Bạn thú đã được cứu
                </div>
                <div style={{ fontWeight: 900, color: 'var(--leaf-deep)', marginBottom: '4px' }}>
                  ⭐ {progress.unlockedStickers.length} Huy hiệu sưu tầm
                </div>
                <div style={{ fontWeight: 900, color: 'var(--leaf-deep)' }}>
                  🌲 Thế giới: Rừng Vui Vẻ
                </div>
              </div>
            </div>

            <div className="control-row" style={{ marginTop: '24px' }}>
              <span className="control-label">Xóa Tiến Trình Chơi</span>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '4px 0 10px' }}>
                Khởi tạo lại trò chơi từ đầu để bé chơi lại từ đầu hành trình.
              </p>
              <Button
                variant="coral"
                onClick={() => setIsGateOpen(true)}
                type="button"
              >
                🔒 Mở Parent Gate để Reset
              </Button>
              {resetFeedback && (
                <p style={{ color: 'var(--leaf-deep)', fontWeight: 900, marginTop: '8px' }}>
                  ✓ Đã làm mới tiến trình thành công!
                </p>
              )}
            </div>
          </aside>
        </section>

        {/* Parent Gate Math Modal */}
        <ParentGateModal
          isOpen={isGateOpen}
          onClose={() => setIsGateOpen(false)}
          onSuccess={handleConfirmedReset}
          title="Xác Nhận Đặt Lại Tiến Độ"
        />
      </div>
    </main>
  );
}
