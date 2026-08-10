import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Card, SectionTitle, Badge, Button } from '../components/common/ui';
import { formatMoney } from '../engine/util';

export function Finance() {
  const game = useGameStore((s) => s.game)!;
  const updateRates = useGameStore((s) => s.updateRates);
  const [rates, setRates] = useState(game.rates);

  const recentTx = game.transactions.slice(0, 25);

  return (
    <div className="space-y-6">
      <SectionTitle>Finanzen</SectionTitle>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-ink-400"><Wallet size={15} /> <span className="text-xs font-medium">Kontostand</span></div>
          <p className={`mt-2 font-display text-xl font-bold ${game.money < 0 ? 'text-red-400' : 'text-ink-100'}`}>{formatMoney(game.money)}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-ink-400"><TrendingUp size={15} /> <span className="text-xs font-medium">Gesamtumsatz</span></div>
          <p className="mt-2 font-display text-xl font-bold text-emerald-400">{formatMoney(game.stats.totalRevenue)}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-ink-400"><TrendingDown size={15} /> <span className="text-xs font-medium">Letzter Monatsgewinn</span></div>
          <p className={`mt-2 font-display text-xl font-bold ${(game.financeHistory[0]?.profit ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatMoney(game.financeHistory[0]?.profit ?? 0)}
          </p>
        </Card>
      </div>

      <Card className="p-4">
        <SectionTitle
          action={
            <Button variant="gold" onClick={() => updateRates(rates)}>
              <Percent size={14} /> Honorare speichern
            </Button>
          }
        >
          Honorarsätze
        </SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <RateInput label="Beratung / Std." value={rates.beratung} onChange={(v) => setRates({ ...rates, beratung: v })} />
          <RateInput label="Junior / Std." value={rates.junior} onChange={(v) => setRates({ ...rates, junior: v })} />
          <RateInput label="Senior / Std." value={rates.senior} onChange={(v) => setRates({ ...rates, senior: v })} />
          <RateInput label="Partner / Std." value={rates.partner} onChange={(v) => setRates({ ...rates, partner: v })} />
        </div>
        <p className="mt-2 text-xs text-ink-500">Höhere Honorare sind möglich, sobald die Reputation der Kanzlei steigt.</p>
      </Card>

      <Card className="p-4">
        <SectionTitle>Monatsübersicht</SectionTitle>
        {game.financeHistory.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-500">Nach dem ersten vollen Monat erscheint hier die Übersicht.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-navy-600 text-left text-xs text-ink-500">
                  <th className="py-2 pr-3">Monat</th>
                  <th className="py-2 pr-3">Einnahmen</th>
                  <th className="py-2 pr-3">Ausgaben</th>
                  <th className="py-2 pr-3">Gewinn</th>
                </tr>
              </thead>
              <tbody>
                {game.financeHistory.map((m) => (
                  <tr key={m.monthLabel} className="border-b border-navy-700/60">
                    <td className="py-2 pr-3 text-ink-200">{m.monthLabel}</td>
                    <td className="py-2 pr-3 text-emerald-400">{formatMoney(m.income)}</td>
                    <td className="py-2 pr-3 text-red-400">{formatMoney(m.expenses)}</td>
                    <td className={`py-2 pr-3 font-medium ${m.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatMoney(m.profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="p-4">
        <SectionTitle>Letzte Transaktionen</SectionTitle>
        {recentTx.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-500">Noch keine Transaktionen.</p>
        ) : (
          <div className="space-y-1.5">
            {recentTx.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-navy-900/40">
                <div>
                  <p className="text-ink-200">{t.label}</p>
                  <p className="text-xs text-ink-500">{t.dateLabel}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{t.category}</Badge>
                  <span className={t.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}>{t.amount >= 0 ? '+' : ''}{formatMoney(t.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function RateInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-ink-500">{label}</label>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-navy-600 bg-navy-900 px-3 py-2 text-sm text-ink-100 outline-none focus:border-gold-500"
      />
    </div>
  );
}
