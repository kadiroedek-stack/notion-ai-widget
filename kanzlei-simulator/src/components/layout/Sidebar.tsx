import { Scale } from 'lucide-react';
import { NAV_ITEMS, type PageId } from '../../nav';
import { useGameStore } from '../../store/gameStore';

export function Sidebar({ active, onNavigate }: { active: PageId; onNavigate: (page: PageId) => void }) {
  const character = useGameStore((s) => s.game?.character);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-navy-700 bg-navy-900 lg:flex">
      <div className="flex items-center gap-2.5 border-b border-navy-700 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/15 text-gold-400">
          <Scale size={20} />
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-ink-100">{character?.firmName ?? 'Kanzlei Simulator'}</p>
          <p className="truncate text-xs text-ink-400">{character?.location ?? 'Wien'}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-gold-500/10 font-medium text-gold-400'
                  : 'text-ink-300 hover:bg-navy-700 hover:text-ink-100'
              }`}
            >
              <Icon size={17} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-navy-700 px-5 py-4 text-xs text-ink-500">
        {character?.name}
      </div>
    </aside>
  );
}
