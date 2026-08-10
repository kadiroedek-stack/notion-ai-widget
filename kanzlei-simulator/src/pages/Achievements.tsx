import { Lock } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Card, SectionTitle, Badge } from '../components/common/ui';
import { formatDate } from '../engine/util';

export function Achievements() {
  const game = useGameStore((s) => s.game)!;
  const unlockedCount = game.achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      <SectionTitle>Erfolge ({unlockedCount}/{game.achievements.length})</SectionTitle>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {game.achievements.map((a) => (
          <Card key={a.id} className={`p-4 ${a.unlocked ? 'border-gold-600/50' : 'opacity-60'}`}>
            <div className="flex items-start justify-between">
              <span className="text-2xl">{a.unlocked ? a.icon : <Lock size={22} className="text-ink-500" />}</span>
              {a.unlocked && <Badge tone="gold">Freigeschaltet</Badge>}
            </div>
            <p className="mt-2 text-sm font-medium text-ink-100">{a.title}</p>
            <p className="mt-1 text-xs text-ink-400">{a.description}</p>
            {a.unlocked && a.unlockedOnDay !== null && (
              <p className="mt-2 text-xs text-ink-500">Erreicht am {formatDate(a.unlockedOnDay)}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
