import { Building2, Users, Briefcase, Star, TrendingUp, Check, Lock } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Card, SectionTitle, Badge, Button } from '../components/common/ui';
import { FIRM_LEVELS, firmLevelDef } from '../data/firmLevels';
import { formatMoney } from '../engine/util';
import { useState } from 'react';

export function Firm() {
  const game = useGameStore((s) => s.game)!;
  const upgradeFirm = useGameStore((s) => s.upgradeFirm);
  const [message, setMessage] = useState<string | null>(null);
  const level = firmLevelDef(game.firmLevel);
  const next = FIRM_LEVELS.find((l) => l.level === game.firmLevel + 1);

  return (
    <div className="space-y-6">
      <SectionTitle>Kanzlei</SectionTitle>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400">
            <Building2 size={22} />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-ink-100">Stufe {level.level} – {level.name}</p>
            <p className="text-sm text-ink-400">{level.officeName}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat icon={Users} label="Max. Mitarbeiter" value={`${game.employees.length}/${level.maxEmployees}`} />
          <MiniStat icon={Briefcase} label="Max. aktive Fälle" value={`${level.maxActiveCases}`} />
          <MiniStat icon={Star} label="Reputationsbonus" value={`+${level.reputationBonus}`} />
          <MiniStat icon={TrendingUp} label="Monatsmiete" value={formatMoney(level.monthlyRent)} />
        </div>
      </Card>

      {message && (
        <div className="rounded-lg border border-gold-600/40 bg-gold-500/10 px-3.5 py-2.5 text-sm text-gold-300">{message}</div>
      )}

      <div>
        <p className="mb-3 text-sm font-medium text-ink-300">Kanzleistufen</p>
        <div className="space-y-2.5">
          {FIRM_LEVELS.map((lvl) => {
            const reached = lvl.level <= game.firmLevel;
            const isNext = next && lvl.level === next.level;
            return (
              <Card key={lvl.level} className={`flex flex-wrap items-center justify-between gap-3 p-4 ${reached ? 'border-gold-600/40' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${reached ? 'bg-gold-500/15 text-gold-400' : 'bg-navy-700 text-ink-500'}`}>
                    {reached ? <Check size={16} /> : <Lock size={15} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-100">Stufe {lvl.level} – {lvl.name}</p>
                    <p className="text-xs text-ink-500">{lvl.officeName} · bis zu {lvl.maxEmployees} Mitarbeiter · {lvl.maxActiveCases} aktive Fälle</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {reached ? (
                    <Badge tone="good">Erreicht</Badge>
                  ) : isNext ? (
                    <Button
                      variant="gold"
                      onClick={() => setMessage(upgradeFirm().message)}
                      disabled={game.money < lvl.upgradeCost}
                    >
                      Upgrade für {formatMoney(lvl.upgradeCost)}
                    </Button>
                  ) : (
                    <Badge>{formatMoney(lvl.upgradeCost)}</Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-navy-600 bg-navy-900/40 p-3">
      <div className="flex items-center gap-1.5 text-xs text-ink-400"><Icon size={13} /> {label}</div>
      <p className="mt-1 font-display text-base font-semibold text-ink-100">{value}</p>
    </div>
  );
}
