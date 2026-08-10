import type { GameState } from '../types';
import { pushEvent } from './events';

function unlock(state: GameState, id: string) {
  const ach = state.achievements.find((a) => a.id === id);
  if (ach && !ach.unlocked) {
    ach.unlocked = true;
    ach.unlockedOnDay = state.day;
    pushEvent(state, `Achievement freigeschaltet: ${ach.title}`, '🏆', 'positive');
  }
}

export function checkAchievements(state: GameState) {
  if (state.stats.casesWon >= 1) unlock(state, 'first_case_won');
  if (state.stats.totalRevenue >= 10000) unlock(state, 'revenue_10k');
  if (state.stats.casesWon >= 10) unlock(state, 'won_10');
  if (state.cases.some((c) => c.type === 'Strafrecht')) unlock(state, 'first_criminal');
  if (state.cases.some((c) => c.disputeValue >= 50000)) unlock(state, 'first_corporate');
  if (state.reputation >= 50) unlock(state, 'rep_50');
  if (state.reputation >= 100) unlock(state, 'rep_100');
  if (state.stats.totalRevenue >= 1000000) unlock(state, 'first_million');
  if (state.firmLevel >= 5) unlock(state, 'top_firm');
  if (state.employees.some((e) => e.salary > 0)) unlock(state, 'first_hire');
  if (state.stats.casesSettled >= 1) unlock(state, 'first_settlement');
  if (state.clients.length >= 10) unlock(state, 'ten_clients');
}
