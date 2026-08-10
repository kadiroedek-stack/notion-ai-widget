import { useState } from 'react';
import { Briefcase } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Card, Badge, Button, EmptyState, SectionTitle, ProgressBar } from '../components/common/ui';
import { formatMoney } from '../engine/util';
import { CaseDetail } from './CaseDetail';
import type { Case } from '../types';

type FilterTab = 'anfragen' | 'aktiv' | 'gericht' | 'abgeschlossen';

const FILTERS: { id: FilterTab; label: string; statuses: Case['status'][] }[] = [
  { id: 'anfragen', label: 'Anfragen', statuses: ['anfrage'] },
  { id: 'aktiv', label: 'Aktive Fälle', statuses: ['aktiv'] },
  { id: 'gericht', label: 'Vor Gericht', statuses: ['vor_gericht'] },
  { id: 'abgeschlossen', label: 'Abgeschlossen', statuses: ['abgeschlossen_gewonnen', 'abgeschlossen_verloren', 'abgeschlossen_vergleich', 'abgelehnt'] },
];

const STATUS_LABEL: Record<string, string> = {
  anfrage: 'Anfrage',
  aktiv: 'Aktiv',
  vor_gericht: 'Vor Gericht',
  abgeschlossen_gewonnen: 'Gewonnen',
  abgeschlossen_verloren: 'Verloren',
  abgeschlossen_vergleich: 'Vergleich',
  abgelehnt: 'Abgelehnt',
};

export function Cases({ selectedCaseId, onSelectCase }: { selectedCaseId: string | null; onSelectCase: (id: string | null) => void }) {
  const game = useGameStore((s) => s.game)!;
  const takeCase = useGameStore((s) => s.takeCase);
  const rejectCase = useGameStore((s) => s.rejectCase);
  const [filter, setFilter] = useState<FilterTab>('aktiv');

  if (selectedCaseId) {
    return <CaseDetail caseId={selectedCaseId} onBack={() => onSelectCase(null)} />;
  }

  const activeFilter = FILTERS.find((f) => f.id === filter)!;
  const filtered = [...game.cases]
    .filter((c) => activeFilter.statuses.includes(c.status))
    .sort((a, b) => b.createdOnDay - a.createdOnDay);

  return (
    <div className="space-y-4">
      <SectionTitle>Fälle</SectionTitle>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count = game.cases.filter((c) => f.statuses.includes(c.status)).length;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-lg border px-3.5 py-1.5 text-sm ${
                filter === f.id ? 'border-gold-600/50 bg-gold-500/10 text-gold-400' : 'border-navy-600 text-ink-300 hover:bg-navy-800'
              }`}
            >
              {f.label} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Briefcase size={28} />} title="Keine Fälle in dieser Kategorie" description="Neue Anfragen entstehen automatisch, wenn du in der Zeit voranschreitest." />
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filtered.map((c) => {
            const client = game.clients.find((cl) => cl.id === c.clientId);
            return (
              <Card key={c.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-ink-100">{c.title}</p>
                    <p className="text-xs text-ink-400">{c.caseNumber} · {client?.name} · {c.type}</p>
                  </div>
                  <Badge tone={c.status.includes('gewonnen') ? 'good' : c.status.includes('verloren') ? 'bad' : 'gold'}>
                    {STATUS_LABEL[c.status]}
                  </Badge>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-ink-400">
                  <span>Streitwert: {c.disputeValue > 0 ? formatMoney(c.disputeValue) : '–'}</span>
                  <span className="capitalize">Schwierigkeit: {c.difficulty}</span>
                </div>
                <div className="mt-2">
                  <div className="mb-1 flex justify-between text-xs text-ink-400"><span>Erfolgschance</span><span>{c.successChance}%</span></div>
                  <ProgressBar value={c.successChance} tone="good" />
                </div>

                <div className="mt-3 flex gap-2">
                  {c.status === 'anfrage' ? (
                    <>
                      <Button variant="gold" onClick={() => takeCase(c.id)}>Annehmen</Button>
                      <Button variant="danger" onClick={() => rejectCase(c.id)}>Ablehnen</Button>
                      <Button variant="ghost" onClick={() => onSelectCase(c.id)}>Details</Button>
                    </>
                  ) : (
                    <Button variant="secondary" onClick={() => onSelectCase(c.id)} className="w-full">Fall öffnen</Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
