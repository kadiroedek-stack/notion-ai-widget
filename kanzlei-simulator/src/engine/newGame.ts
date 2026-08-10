import type { Character, Employee, GameState } from '../types';
import { freshAchievements } from '../data/achievements';
import { generateId, formatDate } from './util';

export function createNewGame(name: string, firmName: string): GameState {
  const character: Character = {
    name: name.trim() || 'Anwältin',
    profession: 'Rechtsanwalt/Rechtsanwältin',
    firmName: firmName.trim() || 'Kanzlei',
    location: 'Wien',
    createdOnDay: 0,
  };

  const starterEmployee: Employee = {
    id: generateId('emp'),
    name: `${character.name} (Kanzleiinhaber:in)`,
    role: 'partner',
    salary: 0,
    hiredOnDay: 0,
    stats: {
      experience: 35,
      speed: 40,
      accuracy: 40,
      negotiation: 35,
      research: 40,
      stressResistance: 45,
    },
    morale: 80,
    assignedCaseIds: [],
  };

  const state: GameState = {
    character,
    day: 0,
    money: 10000,
    reputation: 10,
    firmLevel: 1,
    employees: [starterEmployee],
    clients: [],
    cases: [],
    calendar: [],
    events: [
      {
        id: generateId('evt'),
        day: 0,
        dateLabel: formatDate(0),
        icon: '🎉',
        text: `${character.name} eröffnet die ${character.firmName} in Wien. Ein neues Kapitel beginnt!`,
        kind: 'info',
        caseId: null,
      },
    ],
    achievements: freshAchievements(),
    rates: {
      beratung: 150,
      junior: 100,
      senior: 250,
      partner: 400,
    },
    financeHistory: [],
    transactions: [],
    stats: {
      casesWon: 0,
      casesLost: 0,
      casesSettled: 0,
      casesTotal: 0,
      totalRevenue: 0,
      trialsPlayed: 0,
    },
    pendingRandomEvent: null,
    lastSavedAt: null,
  };

  return state;
}
