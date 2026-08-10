import type { ReactNode } from 'react';
import { X } from 'lucide-react';

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div className={`rounded-xl border border-navy-600 bg-navy-800/80 shadow-sm ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="font-display text-lg font-semibold text-ink-100">{children}</h2>
      {action}
    </div>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-navy-600 hover:bg-navy-500 text-ink-100 border border-navy-500',
  secondary: 'bg-navy-700 hover:bg-navy-600 text-ink-200 border border-navy-600',
  ghost: 'bg-transparent hover:bg-navy-700 text-ink-300 border border-transparent',
  danger: 'bg-red-900/40 hover:bg-red-900/60 text-red-200 border border-red-800',
  gold: 'bg-gold-500 hover:bg-gold-400 text-navy-950 border border-gold-400 font-semibold',
};

export function Button({
  children, onClick, variant = 'primary', disabled, className = '', type = 'button', title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  title?: string;
}) {
  return (
    <button
      type={type}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'good' | 'bad' | 'gold' | 'info' }) {
  const toneClasses: Record<string, string> = {
    neutral: 'bg-navy-700 text-ink-300 border-navy-500',
    good: 'bg-emerald-900/40 text-emerald-300 border-emerald-700',
    bad: 'bg-red-900/40 text-red-300 border-red-700',
    gold: 'bg-gold-500/15 text-gold-400 border-gold-600/50',
    info: 'bg-blue-900/40 text-blue-300 border-blue-700',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}

export function ProgressBar({ value, tone = 'gold' }: { value: number; tone?: 'gold' | 'good' | 'bad' | 'info' }) {
  const toneClasses: Record<string, string> = {
    gold: 'bg-gold-500',
    good: 'bg-emerald-500',
    bad: 'bg-red-500',
    info: 'bg-blue-500',
  };
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy-600">
      <div className={`h-full rounded-full ${toneClasses[tone]}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function Modal({
  title, onClose, children, wide = false, hideClose = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  hideClose?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in" onClick={hideClose ? undefined : onClose}>
      <div
        className={`max-h-[90vh] w-full ${wide ? 'max-w-2xl' : 'max-w-md'} overflow-y-auto rounded-2xl border border-navy-600 bg-navy-800 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-navy-600 bg-navy-800 px-5 py-4">
          <h3 className="font-display text-lg font-semibold text-ink-100">{title}</h3>
          {!hideClose && (
            <button onClick={onClose} className="rounded-lg p-1 text-ink-400 hover:bg-navy-700 hover:text-ink-100" aria-label="Schließen">
              <X size={18} />
            </button>
          )}
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-navy-600 py-14 text-center">
      <div className="text-ink-500">{icon}</div>
      <p className="font-medium text-ink-200">{title}</p>
      <p className="max-w-sm text-sm text-ink-400">{description}</p>
    </div>
  );
}
