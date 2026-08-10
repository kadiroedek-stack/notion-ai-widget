import { useState } from 'react';
import { Phone, Mail, Users2, Star, Wallet } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Card, SectionTitle, Badge, EmptyState, Button, Modal, ProgressBar } from '../components/common/ui';
import { sourceLabel } from '../engine/clients';
import type { PageId } from '../nav';
import { formatDate } from '../engine/util';

export function Clients({ onNavigate }: { onNavigate: (page: PageId, caseId?: string) => void }) {
  const game = useGameStore((s) => s.game)!;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = game.clients.find((c) => c.id === selectedId) ?? null;

  const sortedClients = [...game.clients].sort((a, b) => b.createdOnDay - a.createdOnDay);

  return (
    <div className="space-y-4">
      <SectionTitle>Mandanten ({game.clients.length})</SectionTitle>

      {sortedClients.length === 0 ? (
        <EmptyState icon={<Users2 size={28} />} title="Noch keine Mandanten" description="Sobald Anfragen eingehen, erscheinen deine Mandanten hier. Lass Zeit vergehen, um neue Anfragen zu erhalten." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedClients.map((client) => {
            const clientCases = game.cases.filter((c) => c.clientId === client.id);
            return (
              <Card key={client.id} className="cursor-pointer p-4 transition-colors hover:border-gold-600/50" onClick={() => setSelectedId(client.id)}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-ink-100">{client.name}</p>
                    <p className="text-xs text-ink-400">{client.age} Jahre · {client.profession}</p>
                  </div>
                  <Badge tone="info">{sourceLabel(client.source)}</Badge>
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-ink-400">
                    <span>Zufriedenheit</span><span>{client.satisfaction}%</span>
                  </div>
                  <ProgressBar value={client.satisfaction} tone={client.satisfaction >= 60 ? 'good' : client.satisfaction >= 35 ? 'gold' : 'bad'} />
                </div>
                <p className="mt-3 text-xs text-ink-500">{clientCases.length} Fall/Fälle</p>
              </Card>
            );
          })}
        </div>
      )}

      {selected && (
        <Modal title={selected.name} onClose={() => setSelectedId(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Alter" value={`${selected.age} Jahre`} />
              <Info label="Beruf" value={selected.profession} />
              <Info label="Quelle" value={sourceLabel(selected.source)} />
              <Info label="Seit" value={formatDate(selected.createdOnDay)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Stat icon={Wallet} label="Vermögen" value={selected.wealth} />
              <Stat icon={Star} label="Reputation" value={selected.reputation} />
              <Stat icon={Phone} label="Zahlungsbereitschaft" value={selected.paymentWillingness} />
              <Stat icon={Mail} label="Zuverlässigkeit" value={selected.reliability} />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-ink-400">Stresslevel</p>
              <ProgressBar value={selected.stressLevel} tone={selected.stressLevel > 65 ? 'bad' : 'gold'} />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-ink-400">Zufriedenheit</p>
              <ProgressBar value={selected.satisfaction} tone={selected.satisfaction >= 60 ? 'good' : 'bad'} />
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-ink-400">Fälle</p>
              <div className="space-y-2">
                {game.cases.filter((c) => c.clientId === selected.id).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedId(null); onNavigate('cases', c.id); }}
                    className="flex w-full items-center justify-between rounded-lg border border-navy-600 bg-navy-900/50 px-3 py-2 text-left text-sm hover:border-gold-600/50"
                  >
                    <span className="text-ink-200">{c.title}</span>
                    <Badge>{c.status}</Badge>
                  </button>
                ))}
                {game.cases.filter((c) => c.clientId === selected.id).length === 0 && (
                  <p className="text-sm text-ink-500">Keine Fälle vorhanden.</p>
                )}
              </div>
            </div>
            <Button variant="secondary" className="w-full" onClick={() => setSelectedId(null)}>Schließen</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink-500">{label}</p>
      <p className="text-ink-200">{value}</p>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Wallet; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-navy-600 bg-navy-900/40 p-2.5">
      <div className="flex items-center gap-1.5 text-xs text-ink-400"><Icon size={13} /> {label}</div>
      <p className="mt-1 font-display text-base font-semibold text-ink-100">{value}/100</p>
    </div>
  );
}
