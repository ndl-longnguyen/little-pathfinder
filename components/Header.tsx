'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LinkButton } from './Button';
import { ProgressManager } from '@/game/systems/ProgressManager';
import type { Language, Settings } from '@/game/types';
import { NAV, pick } from '@/lib/i18n';

export function Header() {
  const [lang, setLang] = useState<Language>('vi');

  useEffect(() => {
    let alive = true;

    async function load() {
      const s = await ProgressManager.getSettings();
      if (alive) setLang(s.language);
    }

    void load();
    window.addEventListener('settings-changed', load);
    return () => {
      alive = false;
      window.removeEventListener('settings-changed', load);
    };
  }, []);

  async function toggleLang() {
    const next: Language = lang === 'vi' ? 'en' : 'vi';
    const current = await ProgressManager.getSettings();
    await ProgressManager.saveSettings({ ...current, language: next });
    setLang(next);
  }

  return (
    <header className="topbar">
      <Link className="brand-link" href="/">
        <span aria-hidden="true" className="brand-mark">🐾</span>
        <span>Animal Rescue</span>
      </Link>
      <nav aria-label="Main" className="nav-actions">
        <LinkButton href="/levels" variant="ghost">
          {pick(NAV.map, lang)}
        </LinkButton>
        <LinkButton href="/animal-home" variant="ghost">
          {pick(NAV.island, lang)}
        </LinkButton>
        <LinkButton href="/stickers" variant="ghost">
          {pick(NAV.stickers, lang)}
        </LinkButton>
        <LinkButton href="/free-play" variant="ghost">
          {pick(NAV.freePlay, lang)}
        </LinkButton>
        <LinkButton href="/settings" variant="ghost">
          {pick(NAV.settings, lang)}
        </LinkButton>
        <button
          className="lang-toggle-btn"
          onClick={toggleLang}
          type="button"
          aria-label="Toggle language"
          title={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
        >
          {lang === 'vi' ? '🇬🇧 EN' : '🇻🇳 VI'}
        </button>
      </nav>
    </header>
  );
}
