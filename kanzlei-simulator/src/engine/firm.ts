import type { GameState } from '../types';
import { FIRM_LEVELS } from '../data/firmLevels';
import { pushEvent } from './events';
import { clamp } from './util';

export function upgradeFirm(state: GameState): { ok: boolean; message: string } {
  const next = FIRM_LEVELS.find((l) => l.level === state.firmLevel + 1);
  if (!next) {
    return { ok: false, message: 'Die Kanzlei hat bereits die höchste Stufe erreicht.' };
  }
  if (state.money < next.upgradeCost) {
    return { ok: false, message: `Nicht genügend Geld. Benötigt: ${next.upgradeCost.toLocaleString('de-AT')} €.` };
  }
  state.money -= next.upgradeCost;
  state.firmLevel = next.level;
  state.reputation = clamp(state.reputation + next.reputationBonus / 2);
  pushEvent(state, `Kanzlei wurde auf Stufe ${next.level} (${next.name} – ${next.officeName}) ausgebaut!`, '🏢', 'positive');
  return { ok: true, message: 'Kanzlei erfolgreich ausgebaut.' };
}
