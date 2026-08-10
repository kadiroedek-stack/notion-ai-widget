import type { Achievement } from '../types';

export const ACHIEVEMENT_DEFS: Omit<Achievement, 'unlocked' | 'unlockedOnDay'>[] = [
  { id: 'first_case_won', icon: '🏆', title: 'Erster gewonnener Fall', description: 'Gewinne deinen ersten Gerichtsfall.' },
  { id: 'revenue_10k', icon: '🏆', title: '€10.000 Umsatz', description: 'Erwirtschafte insgesamt €10.000 Umsatz.' },
  { id: 'won_10', icon: '🏆', title: '10 Fälle gewonnen', description: 'Gewinne insgesamt 10 Fälle.' },
  { id: 'first_criminal', icon: '🏆', title: 'Erster Strafprozess', description: 'Übernimm deinen ersten Strafrechtsfall.' },
  { id: 'first_corporate', icon: '🏆', title: 'Erster großer Unternehmensmandant', description: 'Übernimm einen Fall mit einem Streitwert über €50.000.' },
  { id: 'rep_50', icon: '🏆', title: '50 Reputation', description: 'Erreiche 50 Reputationspunkte.' },
  { id: 'rep_100', icon: '🏆', title: '100 Reputation', description: 'Erreiche 100 Reputationspunkte.' },
  { id: 'first_million', icon: '🏆', title: 'Erste Million', description: 'Erwirtschafte insgesamt €1.000.000 Umsatz.' },
  { id: 'top_firm', icon: '🏆', title: 'Größte Kanzlei Wiens', description: 'Erreiche Kanzleistufe 5.' },
  { id: 'first_hire', icon: '🏆', title: 'Erster Mitarbeiter', description: 'Stelle deinen ersten Mitarbeiter ein.' },
  { id: 'first_settlement', icon: '🏆', title: 'Der Kompromiss', description: 'Schließe deinen ersten Vergleich ab.' },
  { id: 'ten_clients', icon: '🏆', title: 'Stammkundschaft', description: 'Betreue 10 verschiedene Mandanten.' },
];

export function freshAchievements(): Achievement[] {
  return ACHIEVEMENT_DEFS.map((a) => ({ ...a, unlocked: false, unlockedOnDay: null }));
}
