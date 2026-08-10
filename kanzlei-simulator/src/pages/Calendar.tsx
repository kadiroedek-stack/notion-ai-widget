import { CalendarDays, Gavel, Clock, Phone, Building } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Card, SectionTitle, Badge, EmptyState } from '../components/common/ui';
import { formatDate } from '../engine/util';
import type { CalendarEntryType } from '../types';
import type { PageId } from '../nav';

const TYPE_META: Record<CalendarEntryType, { icon: typeof Gavel; label: string; tone: 'bad' | 'info' | 'gold' | 'neutral' }> = {
  gericht: { icon: Gavel, label: 'Gerichtstermin', tone: 'bad' },
  frist: { icon: Clock, label: 'Frist', tone: 'gold' },
  termin: { icon: CalendarDays, label: 'Termin', tone: 'info' },
  telefonat: { icon: Phone, label: 'Telefonat', tone: 'info' },
  intern: { icon: Building, label: 'Intern', tone: 'neutral' },
};

export function CalendarPage({ onNavigate }: { onNavigate: (page: PageId, caseId?: string) => void }) {
  const game = useGameStore((s) => s.game)!;
  const entries = [...game.calendar].sort((a, b) => a.day - b.day);
  const upcoming = entries.filter((e) => !e.done);
  const past = entries.filter((e) => e.done).slice(-15).reverse();

  return (
    <div className="space-y-6">
      <SectionTitle>Kalender</SectionTitle>

      <div>
        <p className="mb-2 text-sm font-medium text-ink-300">Anstehend</p>
        {upcoming.length === 0 ? (
          <EmptyState icon={<CalendarDays size={28} />} title="Keine anstehenden Termine" description="Neue Termine entstehen automatisch durch Fallbearbeitung und Gerichtsverfahren." />
        ) : (
          <div className="space-y-2">
            {upcoming.map((entry) => {
              const meta = TYPE_META[entry.type];
              const Icon = meta.icon;
              return (
                <Card
                  key={entry.id}
                  className={`flex items-center justify-between p-3.5 ${entry.caseId ? 'cursor-pointer hover:border-gold-600/50' : ''}`}
                  onClick={entry.caseId ? () => onNavigate('cases', entry.caseId!) : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className="text-ink-400" />
                    <div>
                      <p className="text-sm text-ink-200">{entry.title}</p>
                      <p className="text-xs text-ink-500">{formatDate(entry.day)} · Tag {entry.day} {entry.day === game.day ? '(heute)' : ''}</p>
                    </div>
                  </div>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {past.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-ink-300">Vergangen</p>
          <div className="space-y-2 opacity-60">
            {past.map((entry) => {
              const meta = TYPE_META[entry.type];
              const Icon = meta.icon;
              return (
                <Card key={entry.id} className="flex items-center justify-between p-3.5">
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className="text-ink-400" />
                    <p className="text-sm text-ink-300">{entry.title}</p>
                  </div>
                  <span className="text-xs text-ink-500">{formatDate(entry.day)}</span>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
