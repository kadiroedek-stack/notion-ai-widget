import { ChevronRight, ChevronsRight, Wallet, Star } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { formatDateLong, formatMoney } from '../../engine/util';

export function TopBar() {
  const game = useGameStore((s) => s.game);
  const advanceDay = useGameStore((s) => s.advanceDay);
  const advanceWeek = useGameStore((s) => s.advanceWeek);

  if (!game) return null;
  const blocked = !!game.pendingRandomEvent;

  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-navy-700 bg-navy-900/95 px-4 py-3 backdrop-blur lg:px-6">
      <div>
        <p className="font-display text-sm font-semibold text-ink-100 sm:text-base">{formatDateLong(game.day)}</p>
        <p className="text-xs text-ink-500">Tag {game.day}</p>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden items-center gap-1.5 rounded-lg border border-navy-600 bg-navy-800 px-3 py-1.5 text-sm sm:flex">
          <Wallet size={15} className="text-gold-400" />
          <span className={game.money < 0 ? 'text-red-400' : 'text-ink-100'}>{formatMoney(game.money)}</span>
        </div>
        <div className="hidden items-center gap-1.5 rounded-lg border border-navy-600 bg-navy-800 px-3 py-1.5 text-sm sm:flex">
          <Star size={15} className="text-gold-400" />
          <span className="text-ink-100">{Math.round(game.reputation)}/100</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={advanceDay}
            disabled={blocked}
            title={blocked ? 'Zuerst die anstehende Entscheidung treffen' : 'Einen Tag weiter'}
            className="inline-flex items-center gap-1 rounded-lg border border-navy-500 bg-navy-700 px-3 py-2 text-xs font-medium text-ink-100 hover:bg-navy-600 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
          >
            <ChevronRight size={15} />
            1 Tag
          </button>
          <button
            onClick={advanceWeek}
            disabled={blocked}
            title={blocked ? 'Zuerst die anstehende Entscheidung treffen' : 'Eine Woche weiter'}
            className="inline-flex items-center gap-1 rounded-lg border border-gold-600/50 bg-gold-500/15 px-3 py-2 text-xs font-medium text-gold-400 hover:bg-gold-500/25 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
          >
            <ChevronsRight size={15} />
            1 Woche
          </button>
        </div>
      </div>
    </header>
  );
}
