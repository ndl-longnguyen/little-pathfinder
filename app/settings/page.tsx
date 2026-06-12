'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { ProgressManager } from '@/game/systems/ProgressManager';
import type { AgeMode, Language, Progress, Settings } from '@/game/types';

const languages: Array<{ label: string; value: Language }> = [
  { label: 'Tiếng Việt', value: 'vi' },
  { label: 'English', value: 'en' },
];

const ageModes: Array<{ label: string; value: AgeMode }> = [
  { label: '1-2', value: '1-2' },
  { label: '3-4', value: '3-4' },
  { label: '5-6', value: '5-6' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(ProgressManager.defaultSettings);
  const [progress, setProgress] = useState<Progress>(ProgressManager.defaultProgress);
  const [holding, setHolding] = useState(false);

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

  async function resetProgress() {
    if (!holding) {
      return;
    }

    await ProgressManager.resetProgress();
    setHolding(false);
  }

  return (
    <main className="app-shell page-band">
      <div className="page-inner">
        <Header />
        <div className="page-title-row">
          <h1>Settings</h1>
          <span className="compact-status">
            {progress.completedLevels.length} done
          </span>
        </div>
        <section className="settings-grid" aria-label="Settings controls">
          <div className="settings-panel">
            <h2>Sound</h2>
            <div className="control-row">
              <button
                aria-pressed={settings.sound}
                className={`toggle-button ${settings.sound ? 'on' : 'off'}`}
                onClick={() => void updateSettings({ sound: !settings.sound })}
                type="button"
              >
                <span>{settings.sound ? 'On' : 'Off'}</span>
                <span aria-hidden="true" className="toggle-knob" />
              </button>
            </div>
            <h2>Language</h2>
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
            <h2>Age Mode</h2>
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
          </div>
          <aside className="settings-panel">
            <h2>Parent Area</h2>
            <div className="control-row">
              <span className="control-label">Premium</span>
              <Button disabled variant="ghost">
                Locked
              </Button>
            </div>
            <div className="control-row">
              <span className="control-label">Progress</span>
              <Button
                onMouseDown={() => setHolding(true)}
                onMouseLeave={() => setHolding(false)}
                onMouseUp={() => void resetProgress()}
                onTouchCancel={() => setHolding(false)}
                onTouchEnd={() => void resetProgress()}
                onTouchStart={() => setHolding(true)}
                variant={holding ? 'coral' : 'secondary'}
              >
                {holding ? 'Release to reset' : 'Hold reset'}
              </Button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
