import { Landmark, Gavel } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Card, SectionTitle, Badge, Button, EmptyState, ProgressBar } from '../components/common/ui';
import { COURTS_WIEN } from '../data/courts';
import { formatDate } from '../engine/util';
import type { PageId } from '../nav';

export function Court({ onNavigate }: { onNavigate: (page: PageId, caseId?: string) => void }) {
  const game = useGameStore((s) => s.game)!;
  const hearings = [...game.cases]
    .filter((c) => c.status === 'vor_gericht' && c.court)
    .sort((a, b) => (a.court!.hearingDay - b.court!.hearingDay));

  return (
    <div className="space-y-6">
      <SectionTitle>Gericht</SectionTitle>

      <Card className="p-4">
        <p className="mb-3 text-sm font-medium text-ink-200">Gerichte in Wien</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {COURTS_WIEN.map((court) => {
            const count = hearings.filter((h) => h.court?.court === court).length;
            return (
              <div key={court} className="flex items-center justify-between rounded-lg border border-navy-600 bg-navy-900/40 px-3.5 py-2.5">
                <div className="flex items-center gap-2 text-sm text-ink-200">
                  <Landmark size={15} className="text-gold-400" /> {court}
                </div>
                {count > 0 && <Badge tone="gold">{count} Termin{count > 1 ? 'e' : ''}</Badge>}
              </div>
            );
          })}
        </div>
      </Card>

      <div>
        <SectionTitle>Anstehende Verhandlungen</SectionTitle>
        {hearings.length === 0 ? (
          <EmptyState icon={<Gavel size={28} />} title="Keine anstehenden Verhandlungen" description="Bringe eine Klage in einem aktiven Fall ein, um einen Gerichtstermin zu erhalten." />
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {hearings.map((c) => (
              <Card key={c.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-ink-100">{c.title}</p>
                    <p className="text-xs text-ink-400">{c.court?.court}</p>
                  </div>
                  <Badge tone={game.day >= (c.court?.hearingDay ?? 0) ? 'gold' : 'info'}>{formatDate(c.court!.hearingDay)}</Badge>
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs text-ink-400"><span>Argumentationsstärke</span><span>{c.court?.argumentStrength}%</span></div>
                  <ProgressBar value={c.court?.argumentStrength ?? 0} tone="gold" />
                </div>
                <Button variant="secondary" className="mt-3 w-full" onClick={() => onNavigate('cases', c.id)}>
                  Fall öffnen
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
