import type { LucideIcon } from 'lucide-react';
import { Card } from './ui';

export function StatCard({
  icon: Icon, label, value, sub, tone = 'default',
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  tone?: 'default' | 'good' | 'bad' | 'gold';
}) {
  const toneClasses: Record<string, string> = {
    default: 'text-ink-100',
    good: 'text-emerald-400',
    bad: 'text-red-400',
    gold: 'text-gold-400',
  };
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-ink-400">
        <Icon size={15} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className={`mt-2 font-display text-xl font-bold ${toneClasses[tone]}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-ink-500">{sub}</p>}
    </Card>
  );
}
