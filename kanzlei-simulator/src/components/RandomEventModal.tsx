import { useGameStore } from '../store/gameStore';
import { Modal, Button } from './common/ui';
import { formatMoney } from '../engine/util';

export function RandomEventModal() {
  const pending = useGameStore((s) => s.game?.pendingRandomEvent);
  const resolve = useGameStore((s) => s.resolveRandomEvent);

  if (!pending) return null;

  return (
    <Modal title={pending.title} onClose={() => {}} hideClose>
      <p className="mb-5 text-sm leading-relaxed text-ink-300">{pending.description}</p>
      <div className="space-y-2">
        {pending.choices.map((choice, idx) => (
          <Button
            key={choice.label}
            variant="secondary"
            className="w-full justify-between"
            onClick={() => resolve(idx)}
          >
            <span>{choice.label}</span>
            <span className="flex items-center gap-2 text-xs text-ink-400">
              {choice.moneyDelta ? <span className={choice.moneyDelta > 0 ? 'text-emerald-400' : 'text-red-400'}>{choice.moneyDelta > 0 ? '+' : ''}{formatMoney(choice.moneyDelta)}</span> : null}
              {choice.reputationDelta ? <span className={choice.reputationDelta > 0 ? 'text-emerald-400' : 'text-red-400'}>{choice.reputationDelta > 0 ? '+' : ''}{choice.reputationDelta} Rep.</span> : null}
            </span>
          </Button>
        ))}
      </div>
    </Modal>
  );
}
