import { useState } from 'react';
import {
  ArrowLeft, FileText, Search, Phone, Handshake, Gavel, FileSignature,
  CalendarCheck, MessageCircle, Receipt, Clock, Landmark, User,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Card, Badge, Button, ProgressBar } from '../components/common/ui';
import { formatMoney, formatDate } from '../engine/util';
import type { CaseActionId } from '../engine/cases';
import { MAX_ACTIONS_PER_DAY } from '../engine/cases';
import { sourceLabel } from '../engine/clients';
import { CourtTrialModal } from '../components/court/CourtTrialModal';

type Tab = 'uebersicht' | 'mandant' | 'dokumente' | 'fristen' | 'gericht' | 'strategie' | 'finanzen' | 'timeline';

const TABS: { id: Tab; label: string }[] = [
  { id: 'uebersicht', label: 'Übersicht' },
  { id: 'mandant', label: 'Mandant' },
  { id: 'dokumente', label: 'Dokumente' },
  { id: 'fristen', label: 'Fristen' },
  { id: 'gericht', label: 'Gericht' },
  { id: 'strategie', label: 'Strategie' },
  { id: 'finanzen', label: 'Finanzen' },
  { id: 'timeline', label: 'Timeline' },
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

const ACTIONS: { id: CaseActionId; label: string; icon: typeof FileText; cost: number }[] = [
  { id: 'document', label: 'Dokument erstellen', icon: FileText, cost: 50 },
  { id: 'research', label: 'Recherche durchführen', icon: Search, cost: 30 },
  { id: 'contact_client', label: 'Mandant kontaktieren', icon: Phone, cost: 0 },
  { id: 'offer_settlement', label: 'Vergleich anbieten', icon: Handshake, cost: 0 },
  { id: 'file_lawsuit', label: 'Klage einbringen', icon: Gavel, cost: 0 },
  { id: 'schriftsatz', label: 'Schriftsatz erstellen', icon: FileSignature, cost: 80 },
  { id: 'prepare_hearing', label: 'Gerichtstermin vorbereiten', icon: CalendarCheck, cost: 100 },
  { id: 'contact_opponent', label: 'Gegner kontaktieren', icon: MessageCircle, cost: 0 },
  { id: 'invoice', label: 'Rechnung stellen', icon: Receipt, cost: 0 },
];

export function CaseDetail({ caseId, onBack }: { caseId: string; onBack: () => void }) {
  const game = useGameStore((s) => s.game)!;
  const performAction = useGameStore((s) => s.performAction);
  const respondSettlement = useGameStore((s) => s.respondSettlement);
  const assignEmployee = useGameStore((s) => s.assignEmployee);
  const unassignEmployee = useGameStore((s) => s.unassignEmployee);
  const takeCase = useGameStore((s) => s.takeCase);
  const rejectCase = useGameStore((s) => s.rejectCase);

  const [tab, setTab] = useState<Tab>('uebersicht');
  const [message, setMessage] = useState<string | null>(null);
  const [counterAmount, setCounterAmount] = useState('');
  const [showTrial, setShowTrial] = useState(false);

  const c = game.cases.find((x) => x.id === caseId);
  if (!c) {
    return (
      <div className="space-y-4">
        <BackButton onBack={onBack} />
        <p className="text-sm text-ink-400">Fall nicht gefunden.</p>
      </div>
    );
  }
  const client = game.clients.find((cl) => cl.id === c.clientId);
  const isEditable = c.status === 'aktiv' || c.status === 'vor_gericht';
  const openOffers = c.settlementOffers.filter((o) => o.status === 'offen');

  function runAction(id: CaseActionId) {
    const result = performAction(c!.id, id);
    setMessage(result.message);
  }

  return (
    <div className="space-y-4 pb-10">
      <BackButton onBack={onBack} />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl font-bold text-ink-100">{c.title}</h1>
            <Badge tone={c.status.startsWith('abgeschlossen_gewonnen') ? 'good' : c.status.startsWith('abgeschlossen_verloren') ? 'bad' : 'gold'}>
              {STATUS_LABEL[c.status]}
            </Badge>
          </div>
          <p className="text-sm text-ink-400">{c.caseNumber} · {c.type} · {client?.name}</p>
        </div>
        {c.status === 'anfrage' && (
          <div className="flex gap-2">
            <Button variant="gold" onClick={() => takeCase(c.id)}>Mandat annehmen</Button>
            <Button variant="danger" onClick={() => { rejectCase(c.id); onBack(); }}>Ablehnen</Button>
          </div>
        )}
      </div>

      {message && (
        <div className="rounded-lg border border-gold-600/40 bg-gold-500/10 px-3.5 py-2.5 text-sm text-gold-300">
          {message}
          <button onClick={() => setMessage(null)} className="float-right text-ink-500 hover:text-ink-200">×</button>
        </div>
      )}

      {openOffers.length > 0 && (
        <Card className="border-gold-600/50 p-4">
          <p className="mb-3 font-medium text-gold-400">Offenes Vergleichsangebot</p>
          {openOffers.map((offer) => (
            <div key={offer.id} className="mb-3 rounded-lg border border-navy-600 bg-navy-900/50 p-3 last:mb-0">
              <p className="text-sm text-ink-200">
                {offer.from === 'gegner' ? 'Die Gegenseite bietet' : 'Eigenes Angebot an die Gegenseite'}: <strong>{formatMoney(offer.amount)}</strong>
              </p>
              {offer.from === 'gegner' && (
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <Button variant="gold" onClick={() => respondSettlement(c.id, offer.id, 'annehmen')}>Annehmen</Button>
                  <Button variant="secondary" onClick={() => respondSettlement(c.id, offer.id, 'ablehnen')}>Ablehnen</Button>
                  <input
                    value={counterAmount}
                    onChange={(e) => setCounterAmount(e.target.value)}
                    placeholder="Gegenangebot €"
                    className="w-32 rounded-lg border border-navy-600 bg-navy-900 px-2.5 py-1.5 text-sm text-ink-100 outline-none focus:border-gold-500"
                  />
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const amt = Number(counterAmount);
                      if (amt > 0) { respondSettlement(c.id, offer.id, 'gegenangebot', amt); setCounterAmount(''); }
                    }}
                  >
                    Gegenangebot senden
                  </Button>
                </div>
              )}
            </div>
          ))}
        </Card>
      )}

      {isEditable && (
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-ink-200">Aktionen</p>
            <span className="text-xs text-ink-500">{c.lastActionDay === game.day ? c.actionsUsedToday : 0}/{MAX_ACTIONS_PER_DAY} heute genutzt</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {ACTIONS.map((a) => (
              <Button key={a.id} variant="secondary" className="justify-start" onClick={() => runAction(a.id)}>
                <a.icon size={15} /> {a.label}{a.cost > 0 ? ` (${a.cost}€)` : ''}
              </Button>
            ))}
          </div>
          {c.status === 'vor_gericht' && c.court && (
            <div className="mt-3 border-t border-navy-600 pt-3">
              {game.day >= c.court.hearingDay ? (
                <Button variant="gold" className="w-full" onClick={() => setShowTrial(true)}>
                  <Gavel size={16} /> Zur Gerichtsverhandlung
                </Button>
              ) : (
                <p className="text-center text-xs text-ink-500">Verhandlung am {formatDate(c.court.hearingDay)} – vorher noch vorbereiten.</p>
              )}
            </div>
          )}
        </Card>
      )}

      <div className="flex gap-1 overflow-x-auto border-b border-navy-700 pb-px">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 border-b-2 px-3 py-2 text-sm ${tab === t.id ? 'border-gold-500 text-gold-400' : 'border-transparent text-ink-400 hover:text-ink-200'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'uebersicht' && <OverviewTab c={c} />}
      {tab === 'mandant' && client && <ClientTab client={client} />}
      {tab === 'dokumente' && <DocumentsTab c={c} />}
      {tab === 'fristen' && <DeadlinesTab c={c} />}
      {tab === 'gericht' && <CourtTab c={c} />}
      {tab === 'strategie' && (
        <StrategyTab
          c={c}
          employees={game.employees}
          onAssign={(empId) => assignEmployee(c.id, empId)}
          onUnassign={(empId) => unassignEmployee(c.id, empId)}
        />
      )}
      {tab === 'finanzen' && <FinanceTab c={c} />}
      {tab === 'timeline' && <TimelineTab c={c} />}

      {showTrial && <CourtTrialModal caseId={c.id} onClose={() => setShowTrial(false)} />}
    </div>
  );
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-100">
      <ArrowLeft size={15} /> Zurück zu Fällen
    </button>
  );
}

function OverviewTab({ c }: { c: import('../types').Case }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="p-4">
        <p className="mb-3 text-sm font-medium text-ink-200">Beschreibung</p>
        <p className="text-sm text-ink-400">{c.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Info label="Schwierigkeit" value={c.difficulty} />
          <Info label="Streitwert" value={c.disputeValue > 0 ? formatMoney(c.disputeValue) : '–'} />
          <Info label="Honorar" value={feeLabel(c)} />
          <Info label="Frist" value={formatDate(c.dueDay)} />
        </div>
      </Card>
      <Card className="p-4 space-y-3">
        <StatRow label="Erfolgschance" value={c.successChance} tone="good" />
        <StatRow label="Risiko" value={c.risk} tone="bad" />
        <StatRow label="Beweislage" value={c.evidenceStrength} tone="info" />
        <StatRow label="Vorbereitung" value={c.preparation} tone="gold" />
      </Card>
    </div>
  );
}

function feeLabel(c: import('../types').Case): string {
  if (c.fee.type === 'pauschale') return `${formatMoney(c.fee.amount)} Pauschale`;
  if (c.fee.type === 'stundensatz') return `${formatMoney(c.fee.amount)}/Stunde`;
  return `${c.fee.amount}% Erfolgshonorar`;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink-500">{label}</p>
      <p className="text-ink-200 capitalize">{value}</p>
    </div>
  );
}

function StatRow({ label, value, tone }: { label: string; value: number; tone: 'good' | 'bad' | 'info' | 'gold' }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-ink-400"><span>{label}</span><span>{value}%</span></div>
      <ProgressBar value={value} tone={tone} />
    </div>
  );
}

function ClientTab({ client }: { client: import('../types').Client }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-700 text-ink-300"><User size={20} /></div>
        <div>
          <p className="font-medium text-ink-100">{client.name}</p>
          <p className="text-xs text-ink-400">{client.age} Jahre · {client.profession} · {sourceLabel(client.source)}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatRow label="Vermögen" value={client.wealth} tone="gold" />
        <StatRow label="Reputation" value={client.reputation} tone="info" />
        <StatRow label="Zahlungsbereitschaft" value={client.paymentWillingness} tone="good" />
        <StatRow label="Zuverlässigkeit" value={client.reliability} tone="good" />
      </div>
    </Card>
  );
}

function DocumentsTab({ c }: { c: import('../types').Case }) {
  if (c.documents.length === 0) {
    return <Card className="p-6 text-center text-sm text-ink-500">Noch keine Dokumente erstellt. Nutze die Aktion "Dokument erstellen".</Card>;
  }
  return (
    <div className="space-y-2">
      {c.documents.map((d) => (
        <Card key={d.id} className="flex items-center justify-between p-3.5">
          <div className="flex items-center gap-2.5">
            <FileText size={16} className="text-ink-400" />
            <div>
              <p className="text-sm text-ink-200">{d.title}</p>
              <p className="text-xs text-ink-500">{formatDate(d.createdOnDay)}</p>
            </div>
          </div>
          <Badge tone={d.quality >= 70 ? 'good' : 'neutral'}>Qualität {d.quality}%</Badge>
        </Card>
      ))}
    </div>
  );
}

function DeadlinesTab({ c }: { c: import('../types').Case }) {
  if (c.deadlines.length === 0) {
    return <Card className="p-6 text-center text-sm text-ink-500">Keine Fristen hinterlegt.</Card>;
  }
  return (
    <div className="space-y-2">
      {c.deadlines.map((d) => (
        <Card key={d.id} className="flex items-center justify-between p-3.5">
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="text-ink-400" />
            <p className="text-sm text-ink-200">{d.label}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-500">{formatDate(d.dueDay)}</span>
            <Badge tone={d.missed ? 'bad' : d.done ? 'good' : 'neutral'}>{d.missed ? 'Versäumt' : d.done ? 'Erledigt' : 'Offen'}</Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}

function CourtTab({ c }: { c: import('../types').Case }) {
  if (!c.court) {
    return <Card className="p-6 text-center text-sm text-ink-500">Für diesen Fall wurde noch keine Klage eingebracht.</Card>;
  }
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2.5">
        <Landmark size={18} className="text-gold-400" />
        <div>
          <p className="text-sm font-medium text-ink-100">{c.court.court}</p>
          <p className="text-xs text-ink-400">Termin: {formatDate(c.court.hearingDay)}</p>
        </div>
      </div>
      <StatRow label="Argumentationsstärke" value={c.court.argumentStrength} tone="gold" />
      <Badge tone={c.court.prepared ? 'good' : 'bad'}>{c.court.prepared ? 'Vorbereitet' : 'Noch nicht vorbereitet'}</Badge>
    </Card>
  );
}

function StrategyTab({
  c, employees, onAssign, onUnassign,
}: {
  c: import('../types').Case;
  employees: import('../types').Employee[];
  onAssign: (id: string) => void;
  onUnassign: (id: string) => void;
}) {
  const assigned = employees.filter((e) => c.assignedEmployeeIds.includes(e.id));
  const available = employees.filter((e) => !c.assignedEmployeeIds.includes(e.id));
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <p className="mb-3 text-sm font-medium text-ink-200">Zugewiesene Mitarbeiter</p>
        {assigned.length === 0 ? (
          <p className="text-sm text-ink-500">Niemand zugewiesen. Zugewiesene Mitarbeiter verbessern Recherche- und Vorbereitungsergebnisse.</p>
        ) : (
          <div className="space-y-2">
            {assigned.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-navy-600 bg-navy-900/50 px-3 py-2">
                <span className="text-sm text-ink-200">{e.name} · Recherche {e.stats.research}%</span>
                <Button variant="ghost" onClick={() => onUnassign(e.id)}>Entfernen</Button>
              </div>
            ))}
          </div>
        )}
      </Card>
      {available.length > 0 && (
        <Card className="p-4">
          <p className="mb-3 text-sm font-medium text-ink-200">Verfügbare Mitarbeiter</p>
          <div className="space-y-2">
            {available.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-navy-600 bg-navy-900/50 px-3 py-2">
                <span className="text-sm text-ink-200">{e.name}</span>
                <Button variant="secondary" onClick={() => onAssign(e.id)}>Zuweisen</Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function FinanceTab({ c }: { c: import('../types').Case }) {
  return (
    <Card className="p-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Info label="Bereits bezahlt" value={formatMoney(c.paidAmount)} />
      <Info label="Offene Rechnung" value={formatMoney(c.invoicedAmount)} />
      <Info label="Erfasste Stunden" value={`${c.hoursLogged}h`} />
      <Info label="Honorarmodell" value={feeLabel(c)} />
    </Card>
  );
}

function TimelineTab({ c }: { c: import('../types').Case }) {
  return (
    <div className="relative space-y-4 border-l border-navy-600 pl-5">
      {[...c.timeline].reverse().map((entry) => (
        <div key={entry.id} className="relative">
          <div className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-gold-500" />
          <p className="text-xs text-ink-500">{entry.dateLabel || formatDate(entry.day)}</p>
          <p className="text-sm text-ink-200">{entry.text}</p>
        </div>
      ))}
    </div>
  );
}
