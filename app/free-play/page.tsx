'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { AudioManager } from '@/game/systems/AudioManager';
import { LevelManager } from '@/game/systems/LevelManager';
import { ProgressManager } from '@/game/systems/ProgressManager';
import type { Settings } from '@/game/types';

export default function FreePlayPage() {
  const [settings, setSettings] = useState<Settings>(ProgressManager.defaultSettings);
  const [activeTab, setActiveTab] = useState<'sounds' | 'forest'>('sounds');
  const [activeForestMessage, setActiveForestMessage] = useState<string>('');

  useEffect(() => {
    let alive = true;

    async function load() {
      const savedSettings = await ProgressManager.getSettings();
      if (alive) {
        setSettings(savedSettings);
      }
    }

    void load();
    return () => {
      alive = false;
    };
  }, []);

  const animals = LevelManager.getAnimals();

  const animalSoundData: Record<string, { soundVi: string; soundEn: string; emoji: string }> = {
    rabbit: { soundVi: 'Khịt khịt! Thỏ nhảy nhót tung tăng!', soundEn: 'Hop hop! Little bunny leaps happily!', emoji: '🐰' },
    duck: { soundVi: 'Cạp cạp cạp! Vịt bơi tung tăng dưới nước!', soundEn: 'Quack quack! Duck splashes in the pond!', emoji: '🦆' },
    bear: { soundVi: 'Gừ gừ! Bác Gấu no nê mật ngọt!', soundEn: 'Growl growl! Gentle bear enjoys honey!', emoji: '🐻' },
    monkey: { soundVi: 'Khẹc khẹc! Khỉ con chuyền cành thoăn thoắt!', soundEn: 'Ooh ooh aah aah! Monkey swings from tree to tree!', emoji: '🐵' },
    panda: { soundVi: 'Rôm rốp! Gấu trúc nhai cành trúc non ngon lành!', soundEn: 'Crunch crunch! Panda munches on sweet bamboo!', emoji: '🐼' },
    dolphin: { soundVi: 'Chít chít tíu tít! Cá heo nhào lộn trên sóng biển!', soundEn: 'Click click whistle! Dolphin leaps above ocean waves!', emoji: '🐬' },
    turtle: { soundVi: 'Bì bõm bì bõm! Rùa biển bơi êm ả qua ngàn dặm khơi xa!', soundEn: 'Splash glide! Gentle sea turtle journeys across the ocean!', emoji: '🐢' },
    octopus: { soundVi: 'Xì xào xì xào! Bạch tuộc khua 8 xúc tu khám phá kho báu!', soundEn: 'Swish swish! Clever octopus moves 8 arms to explore!', emoji: '🐙' },
    crab: { soundVi: 'Lách cách lách cách! Cua càng vẫy tay đi ngang trên bờ cát!', soundEn: 'Click-clack click-clack! Friendly crab walks sideways on warm sand!', emoji: '🦀' },
    whale: { soundVi: 'Ù ù du dương! Bác cá voi xanh hát khúc ca đại dương bình yên!', soundEn: 'Whoo whoo! Giant blue whale sings a peaceful sea lullaby!', emoji: '🐳' },
  };

  const forestInteractives = [
    {
      id: 'sun',
      icon: '☀️',
      title: 'Mặt Trời',
      msgVi: 'Mặt trời chiếu những tia nắng vàng ấm áp xuống khu rừng!',
      msgEn: 'The warm golden sun shines brightly over the forest!',
    },
    {
      id: 'cloud',
      icon: '🌧️',
      title: 'Đám Mây',
      msgVi: 'Mưa rơi tí tách tí tách tưới mát cho cây cỏ tốt tươi!',
      msgEn: 'Pitter-patter! Gentle raindrops water the green trees!',
    },
    {
      id: 'rainbow',
      icon: '🌈',
      title: 'Cầu Vồng',
      msgVi: 'Cầu vồng bảy sắc rực rỡ xuất hiện sau cơn mưa rào!',
      msgEn: 'A magical seven-color rainbow appears across the sky!',
    },
    {
      id: 'butterfly',
      icon: '🦋',
      title: 'Cánh Bướm',
      msgVi: 'Chú bướm rập rờn bay lượn bên khóm hoa thơm ngát!',
      msgEn: 'A colorful butterfly flutters around fragrant flowers!',
    },
    {
      id: 'frog',
      icon: '🐸',
      title: 'Chú Ếch',
      msgVi: 'Ộp ộp! Chú ếch xanh ngồi trên lá sen đón gió!',
      msgEn: 'Ribbit ribbit! A friendly green frog sits on the lotus leaf!',
    },
    {
      id: 'tree',
      icon: '🌳',
      title: 'Cây Cổ Thụ',
      msgVi: 'Cây xanh tỏa bóng râm mát rượi cho muông thú nghỉ ngơi!',
      msgEn: 'The giant oak tree gives cool shade to all forest friends!',
    },
  ];

  function playAnimalSound(id: string) {
    const data = animalSoundData[id];
    if (!data) return;
    const text = settings.language === 'vi' ? data.soundVi : data.soundEn;
    AudioManager.speak(text, settings.language);
  }

  function playForestItem(item: (typeof forestInteractives)[0]) {
    const text = settings.language === 'vi' ? item.msgVi : item.msgEn;
    setActiveForestMessage(text);
    AudioManager.speak(text, settings.language);
  }

  return (
    <main className="app-shell page-band">
      <div className="page-inner">
        <Header />

        <div className="page-title-row">
          <div>
            <h1>Khu Vui Chơi Tự Do</h1>
            <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontWeight: 800 }}>
              Khám phá âm thanh muôn loài và tương tác tự do với thiên nhiên, không áp lực!
            </p>
          </div>
        </div>

        {/* Mode Switch Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            type="button"
            className={`kid-button ${activeTab === 'sounds' ? 'primary' : 'secondary'}`}
            onClick={() => setActiveTab('sounds')}
          >
            🐾 Tiếng Kêu Muôn Loài
          </button>
          <button
            type="button"
            className={`kid-button ${activeTab === 'forest' ? 'primary' : 'secondary'}`}
            onClick={() => setActiveTab('forest')}
          >
            🍃 Rừng Xanh Tương Tác
          </button>
        </div>

        {/* Tab 1: Animal Sounds Soundboard */}
        {activeTab === 'sounds' && (
          <section aria-label="Bảng âm thanh động vật">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '18px',
              }}
            >
              {animals.map((a) => {
                const s = animalSoundData[a.id];
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => playAnimalSound(a.id)}
                    style={{
                      border: '4px solid var(--leaf-deep)',
                      borderRadius: '20px',
                      padding: '24px 16px',
                      background: '#fffdf7',
                      textAlign: 'center',
                      boxShadow: 'var(--shadow)',
                      cursor: 'pointer',
                      transition: 'transform 140ms ease',
                    }}
                    className="soundboard-btn"
                  >
                    <div style={{ fontSize: '5.5rem', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.15))', marginBottom: '8px' }}>{s?.emoji ?? '🐾'}</div>
                    <strong
                      style={{
                        display: 'block',
                        color: 'var(--leaf-deep)',
                        fontSize: '1.4rem',
                        marginBottom: '4px',
                      }}
                    >
                      {settings.language === 'vi' ? a.nameVi : a.nameEn}
                    </strong>
                    <span style={{ color: 'var(--muted)', fontWeight: 800, fontSize: '0.9rem' }}>
                      Chạm để nghe tiếng! 🔊
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Tab 2: Interactive Forest */}
        {activeTab === 'forest' && (
          <section aria-label="Khu rừng tương tác">
            {activeForestMessage && (
              <div
                style={{
                  border: '3px solid var(--leaf-deep)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  background: '#fff9ec',
                  marginBottom: '20px',
                  fontWeight: 900,
                  color: 'var(--leaf-deep)',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                }}
              >
                {activeForestMessage}
              </div>
            )}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
              }}
            >
              {forestInteractives.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => playForestItem(item)}
                  style={{
                    border: '3px solid rgba(35, 107, 76, 0.3)',
                    borderRadius: '16px',
                    padding: '20px 14px',
                    background: '#ffffff',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '4.5rem', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.12))', marginBottom: '8px' }}>{item.icon}</div>
                  <strong style={{ display: 'block', color: 'var(--leaf-deep)', fontSize: '1.2rem' }}>
                    {item.title}
                  </strong>
                  <span style={{ color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 800 }}>
                    Chạm để khám phá ✨
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
