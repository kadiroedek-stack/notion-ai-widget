import type { GameState } from '../types';
import { clamp, chance, randomInt } from './util';
import { resolveCase } from './cases';
import { checkAchievements } from './achievements';

export interface TrialResult {
  outcome: 'gewonnen' | 'verloren' | 'vergleich';
  successProbability: number;
  settlementAmount: number;
}

export function resolveTrial(state: GameState, caseId: string, trialScore: number, settlementProposed: boolean): TrialResult {
  const c = state.cases.find((x) => x.id === caseId);
  if (!c || !c.court) throw new Error('Kein Gerichtstermin für diesen Fall.');

  const successProbability = clamp(
    Math.round(
      c.successChance * 0.25 +
      c.evidenceStrength * 0.2 +
      c.preparation * 0.15 +
      c.court.argumentStrength * 0.2 +
      trialScore * 2,
    ),
    5,
    95,
  );

  state.stats.trialsPlayed += 1;

  let outcome: 'gewonnen' | 'verloren' | 'vergleich';
  let settlementAmount = 0;

  if (settlementProposed && chance(0.4) && successProbability < 80) {
    outcome = 'vergleich';
    settlementAmount = Math.round((c.disputeValue * randomInt(35, 65)) / 100 / 10) * 10;
  } else if (chance(successProbability / 100)) {
    outcome = 'gewonnen';
  } else {
    outcome = 'verloren';
  }

  resolveCase(state, c, outcome, settlementAmount);
  checkAchievements(state);

  return { outcome, successProbability, settlementAmount };
}
