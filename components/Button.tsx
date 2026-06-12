import Link from 'next/link';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'coral' | 'ghost';

function buttonClass(variant: ButtonVariant, className?: string) {
  return ['kid-button', variant, className].filter(Boolean).join(' ');
}

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  }
>;

export function Button({
  children,
  className,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClass(variant, className)} {...props}>
      {children}
    </button>
  );
}

type LinkButtonProps = PropsWithChildren<{
  href: string;
  className?: string;
  variant?: ButtonVariant;
  ariaDisabled?: boolean;
}>;

export function LinkButton({
  children,
  className,
  href,
  variant = 'primary',
  ariaDisabled,
}: LinkButtonProps) {
  return (
    <Link
      aria-disabled={ariaDisabled}
      className={buttonClass(variant, className)}
      href={href}
      tabIndex={ariaDisabled ? -1 : undefined}
    >
      {children}
    </Link>
  );
}
