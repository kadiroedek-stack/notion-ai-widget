import { Star, TrendingUp, TrendingDown, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Card, SectionTitle, ProgressBar } from '../components/common/ui';

export function Reputation() {
  const game = useGameStore((s) => s.game)!;
  const repEvents = game.events.filter((e) => e.kind === 'positive' || e.kind === 'negative').slice(0, 30);

  return (
    <div className="space-y-6">
      <SectionTitle>Reputation</SectionTitle>

      <Card className="p-6 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
          <Star size={28} />
        </div>
        <p className="font-display text-3xl font-bold text-ink-100">{Math.round(game.reputation)}/100</p>
        <div className="mx-auto mt-3 max-w-sm">
          <ProgressBar value={game.reputation} tone="gold" />
        </div>
        <p className="mt-3 text-sm text-ink-400">{reputationTier(game.reputation)}</p>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2 text-emerald-400"><TrendingUp size={16} /><p className="text-sm font-medium">Reputation steigt durch</p></div>
          <ul className="space-y-1.5 text-sm text-ink-400">
            <li className="flex items-center gap-2"><ThumbsUp size={13} className="text-emerald-400" /> Gewonnene Fälle</li>
            <li className="flex items-center gap-2"><ThumbsUp size={13} className="text-emerald-400" /> Gute Mandantenbetreuung</li>
            <li className="flex items-center gap-2"><ThumbsUp size={13} className="text-emerald-400" /> Empfehlungen zufriedener Mandanten</li>
            <li className="flex items-center gap-2"><ThumbsUp size={13} className="text-emerald-400" /> Erfolgreiche Vergleiche</li>
            <li className="flex items-center gap-2"><ThumbsUp size={13} className="text-emerald-400" /> Große, öffentlichkeitswirksame Fälle</li>
          </ul>
        </Card>
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2 text-red-400"><TrendingDown size={16} /><p className="text-sm font-medium">Reputation sinkt durch</p></div>
          <ul className="space-y-1.5 text-sm text-ink-400">
            <li className="flex items-center gap-2"><ThumbsDown size={13} className="text-red-400" /> Verlorene Fälle</li>
            <li className="flex items-center gap-2"><ThumbsDown size={13} className="text-red-400" /> Schlechte Kommunikation</li>
            <li className="flex items-center gap-2"><ThumbsDown size={13} className="text-red-400" /> Fristversäumnisse</li>
            <li className="flex items-center gap-2"><ThumbsDown size={13} className="text-red-400" /> Unzufriedene Mandanten</li>
            <li className="flex items-center gap-2"><ThumbsDown size={13} className="text-red-400" /> Finanzielle Schieflage der Kanzlei</li>
          </ul>
        </Card>
      </div>

      <Card className="p-4">
        <SectionTitle>Verlauf</SectionTitle>
        {repEvents.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-500">Noch keine reputationsrelevanten Ereignisse.</p>
        ) : (
          <ul className="space-y-2">
            {repEvents.map((evt) => (
              <li key={evt.id} className="flex items-center gap-2.5 text-sm">
                <span>{evt.icon}</span>
                <span className={evt.kind === 'positive' ? 'text-emerald-400' : 'text-red-400'}>{evt.text}</span>
                <span className="ml-auto text-xs text-ink-500">{evt.dateLabel}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function reputationTier(rep: number): string {
  if (rep >= 90) return 'Legendärer Ruf – ganz Wien kennt deine Kanzlei.';
  if (rep >= 70) return 'Exzellenter Ruf in Wiener Rechtskreisen.';
  if (rep >= 50) return 'Guter, solider Ruf.';
  if (rep >= 25) return 'Durchschnittlicher Ruf – noch Luft nach oben.';
  return 'Unbekannte Kanzlei – Zeit, sich einen Namen zu machen.';
}
