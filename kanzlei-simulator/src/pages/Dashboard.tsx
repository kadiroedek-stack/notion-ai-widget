import { Wallet, Star, Briefcase, CalendarClock, Gavel, Users, UserCog, Building2, TrendingUp, Inbox } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { StatCard } from '../components/common/StatCard';
import { Card, SectionTitle, Button, Badge } from '../components/common/ui';
import { firmLevelDef } from '../data/firmLevels';
import { formatMoney, formatDate } from '../engine/util';
import type { PageId } from '../nav';

const KIND_TONE: Record<string, string> = {
  info: 'text-ink-300',
  positive: 'text-emerald-400',
  negative: 'text-red-400',
  decision: 'text-gold-400',
  money: 'text-emerald-400',
  court: 'text-blue-300',
};

export function Dashboard({ onNavigate }: { onNavigate: (page: PageId, caseId?: string) => void }) {
  const game = useGameStore((s) => s.game)!;
  const takeCase = useGameStore((s) => s.takeCase);

  const activeCases = game.cases.filter((c) => c.status === 'aktiv' || c.status === 'vor_gericht');
  const pendingLeads = game.cases.filter((c) => c.status === 'anfrage');
  const upcoming = game.calendar.filter((c) => !c.done && c.day >= game.day).sort((a, b) => a.day - b.day).slice(0, 6);
  const hearings = game.cases.filter((c) => c.status === 'vor_gericht');
  const level = firmLevelDef(game.firmLevel);
  const currentMonthProfit = game.financeHistory[0]?.profit ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-100">Willkommen zurück, {game.character.name.split(' ')[0]}</h1>
        <p className="text-sm text-ink-400">{game.character.firmName} · {level.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={Wallet} label="Kontostand" value={formatMoney(game.money)} tone={game.money < 0 ? 'bad' : 'default'} />
        <StatCard icon={Star} label="Reputation" value={`${Math.round(game.reputation)}/100`} tone="gold" />
        <StatCard icon={Briefcase} label="Aktive Fälle" value={`${activeCases.length}/${level.maxActiveCases}`} />
        <StatCard icon={CalendarClock} label="Anstehende Termine" value={`${upcoming.length}`} />
        <StatCard icon={Gavel} label="Gerichtsverhandlungen" value={`${hearings.length}`} />
        <StatCard icon={Users} label="Mandanten" value={`${game.clients.length}`} />
        <StatCard icon={UserCog} label="Mitarbeiter" value={`${game.employees.length}/${level.maxEmployees}`} />
        <StatCard icon={Building2} label="Kanzleistufe" value={`${level.level} – ${level.name}`} />
        <StatCard icon={TrendingUp} label="Monatlicher Gewinn" value={formatMoney(currentMonthProfit)} tone={currentMonthProfit >= 0 ? 'good' : 'bad'} />
        <StatCard icon={Inbox} label="Offene Anfragen" value={`${pendingLeads.length}`} tone={pendingLeads.length > 0 ? 'gold' : 'default'} />
      </div>

      {pendingLeads.length > 0 && (
        <Card className="p-4">
          <SectionTitle action={<Button variant="ghost" onClick={() => onNavigate('cases')}>Alle ansehen</Button>}>
            Neue Mandatsanfragen
          </SectionTitle>
          <div className="space-y-2">
            {pendingLeads.slice(0, 4).map((c) => {
              const client = game.clients.find((cl) => cl.id === c.clientId);
              return (
                <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-navy-600 bg-navy-900/50 px-3.5 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink-100">{c.title}</p>
                    <p className="text-xs text-ink-400">{client?.name} · {c.type} · {c.disputeValue > 0 ? formatMoney(c.disputeValue) : 'ohne Streitwert'}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="gold" onClick={() => takeCase(c.id)}>Annehmen</Button>
                    <Button variant="ghost" onClick={() => onNavigate('cases', c.id)}>Details</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <SectionTitle action={<Button variant="ghost" onClick={() => onNavigate('calendar')}>Kalender</Button>}>
            Anstehende Termine
          </SectionTitle>
          {upcoming.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-500">Keine anstehenden Termine.</p>
          ) : (
            <ul className="space-y-2">
              {upcoming.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between rounded-lg border border-navy-600 bg-navy-900/40 px-3 py-2.5 text-sm">
                  <span className="text-ink-200">{entry.title}</span>
                  <div className="flex items-center gap-2">
                    <Badge tone={entry.type === 'gericht' ? 'bad' : 'info'}>{formatDate(entry.day)}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-4">
          <SectionTitle>Was ist heute passiert?</SectionTitle>
          {game.events.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-500">Noch keine Ereignisse.</p>
          ) : (
            <ul className="max-h-80 space-y-2.5 overflow-y-auto pr-1">
              {game.events.slice(0, 20).map((evt) => (
                <li key={evt.id} className="flex gap-2.5 text-sm">
                  <span className="shrink-0">{evt.icon}</span>
                  <div>
                    <p className={KIND_TONE[evt.kind]}>{evt.text}</p>
                    <p className="text-xs text-ink-500">{evt.dateLabel}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
