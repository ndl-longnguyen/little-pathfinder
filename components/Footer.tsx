import Link from 'next/link';
import { MAIN_SITE_URL } from '@/lib/config/site';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-16 pt-10 pb-12 border-t border-[var(--line)] bg-[var(--paper)] text-[var(--muted)] text-center text-xs">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Child Safety Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eef7ee] border border-[var(--leaf)] text-[var(--leaf-deep)] text-xs font-bold">
          <span>🛡️</span>
          <span>100% Không Quảng Cáo • Bảo Mật &amp; An Toàn Tuyệt Đối Cho Trẻ Em</span>
        </div>

        {/* Ecosystem & Legal Navigation */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs font-semibold text-[var(--ink)]">
          <a
            href={MAIN_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--leaf-deep)] transition-colors underline-offset-4 hover:underline"
          >
            NDL Portfolio
          </a>
          <span className="text-[var(--muted)] opacity-40">•</span>
          <a
            href="https://arcade.ndlong.site"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--leaf-deep)] transition-colors underline-offset-4 hover:underline"
          >
            NDL Arcade
          </a>
          <span className="text-[var(--muted)] opacity-40">•</span>
          <a
            href="https://click.ndlong.site"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--leaf-deep)] transition-colors underline-offset-4 hover:underline"
          >
            Click 2 Top
          </a>
          <span className="text-[var(--muted)] opacity-40">•</span>
          <a
            href={`${MAIN_SITE_URL}/privacy-policy`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--leaf-deep)] transition-colors underline-offset-4 hover:underline"
          >
            Chính Sách Bảo Mật (COPPA)
          </a>
          <span className="text-[var(--muted)] opacity-40">•</span>
          <a
            href={`${MAIN_SITE_URL}/terms`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--leaf-deep)] transition-colors underline-offset-4 hover:underline"
          >
            Điều Khoản Dịch Vụ
          </a>
        </div>

        {/* Copyright */}
        <p className="text-[11px] text-[var(--muted)] leading-relaxed">
          © {currentYear} Animal Rescue Adventure (Little Pathfinder) — Dự án giáo dục mầm non phi lợi nhuận thuộc hệ sinh thái{' '}
          <a href={MAIN_SITE_URL} className="font-bold text-[var(--leaf-deep)] hover:underline">
            ndlong.site
          </a>.
        </p>
      </div>
    </footer>
  );
}
