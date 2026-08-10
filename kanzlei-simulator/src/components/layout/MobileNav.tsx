import { Menu } from 'lucide-react';
import { NAV_ITEMS, MOBILE_NAV_ITEMS, type PageId } from '../../nav';

export function MobileBottomNav({ active, onNavigate, onMore }: { active: PageId; onNavigate: (page: PageId) => void; onMore: () => void }) {
  const items = NAV_ITEMS.filter((i) => MOBILE_NAV_ITEMS.includes(i.id));
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-navy-700 bg-navy-900/95 backdrop-blur lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] ${isActive ? 'text-gold-400' : 'text-ink-400'}`}
          >
            <Icon size={19} />
            {item.label}
          </button>
        );
      })}
      <button onClick={onMore} className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] text-ink-400">
        <Menu size={19} />
        Mehr
      </button>
    </nav>
  );
}

export function MobileMoreSheet({ active, onNavigate, onClose }: { active: PageId; onNavigate: (page: PageId) => void; onClose: () => void }) {
  const items = NAV_ITEMS.filter((i) => !MOBILE_NAV_ITEMS.includes(i.id));
  return (
    <div className="fixed inset-0 z-40 flex items-end bg-black/60 lg:hidden" onClick={onClose}>
      <div
        className="w-full rounded-t-2xl border-t border-navy-600 bg-navy-800 p-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-navy-600" />
        <div className="grid grid-cols-3 gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === active;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onClose(); }}
                className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs ${
                  isActive ? 'border-gold-600/50 bg-gold-500/10 text-gold-400' : 'border-navy-600 text-ink-300'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
