import Link from 'next/link';
import { LinkButton } from './Button';

export function Header() {
  return (
    <header className="topbar">
      <Link className="brand-link" href="/">
        <span aria-hidden="true" className="brand-mark">🐾</span>
        <span>Animal Rescue</span>
      </Link>
      <nav aria-label="Main" className="nav-actions">
        <LinkButton href="/levels" variant="ghost">
          🗺️ Bản Đồ
        </LinkButton>
        <LinkButton href="/animal-home" variant="ghost">
          🏡 Đảo Rừng
        </LinkButton>
        <LinkButton href="/stickers" variant="ghost">
          ⭐ Bộ Sưu Tập
        </LinkButton>
        <LinkButton href="/free-play" variant="ghost">
          🎈 Chơi Tự Do
        </LinkButton>
        <LinkButton href="/settings" variant="ghost">
          ⚙️ Phụ Huynh
        </LinkButton>
      </nav>
    </header>
  );
}
