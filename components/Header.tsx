import Link from 'next/link';
import { LinkButton } from './Button';

export function Header() {
  return (
    <header className="topbar">
      <Link className="brand-link" href="/">
        <span aria-hidden="true" className="brand-mark" />
        <span>Animal Rescue</span>
      </Link>
      <nav aria-label="Main" className="nav-actions">
        <LinkButton href="/levels" variant="ghost">
          Levels
        </LinkButton>
        <LinkButton href="/stickers" variant="ghost">
          Stickers
        </LinkButton>
        <LinkButton href="/settings" variant="ghost">
          Settings
        </LinkButton>
      </nav>
    </header>
  );
}
