import type { FirmLevelDef } from '../types';

export const FIRM_LEVELS: FirmLevelDef[] = [
  {
    level: 1,
    name: 'Einzelkanzlei',
    officeName: 'Homeoffice / kleines Büro',
    maxEmployees: 1,
    maxActiveCases: 3,
    reputationBonus: 0,
    monthlyRent: 400,
    prestige: 1,
    upgradeCost: 0,
  },
  {
    level: 2,
    name: 'Kleinkanzlei',
    officeName: 'Kleines Büro',
    maxEmployees: 3,
    maxActiveCases: 6,
    reputationBonus: 3,
    monthlyRent: 1200,
    prestige: 2,
    upgradeCost: 8000,
  },
  {
    level: 3,
    name: 'Mittlere Kanzlei',
    officeName: 'Mittlere Kanzlei am Ring',
    maxEmployees: 6,
    maxActiveCases: 10,
    reputationBonus: 6,
    monthlyRent: 3200,
    prestige: 3,
    upgradeCost: 30000,
  },
  {
    level: 4,
    name: 'Große Kanzlei',
    officeName: 'Große Kanzlei, Innere Stadt',
    maxEmployees: 12,
    maxActiveCases: 18,
    reputationBonus: 10,
    monthlyRent: 8500,
    prestige: 4,
    upgradeCost: 90000,
  },
  {
    level: 5,
    name: 'Top-Kanzlei Wien',
    officeName: 'Penthouse-Kanzlei, Stephansplatz',
    maxEmployees: 25,
    maxActiveCases: 30,
    reputationBonus: 15,
    monthlyRent: 22000,
    prestige: 5,
    upgradeCost: 250000,
  },
];

export function firmLevelDef(level: number): FirmLevelDef {
  return FIRM_LEVELS[Math.min(level, FIRM_LEVELS.length) - 1];
}
