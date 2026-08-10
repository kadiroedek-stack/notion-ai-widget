import type { GameState, EmployeeRole } from '../types';
import { templateForRole } from '../data/employeeTemplates';
import { randomFullName } from '../data/names';
import { firmLevelDef } from '../data/firmLevels';
import { generateId, randomInt, rng, clamp } from './util';
import { pushEvent } from './events';

export function hireEmployee(state: GameState, role: EmployeeRole): { ok: boolean; message: string } {
  const template = templateForRole(role);
  const level = firmLevelDef(state.firmLevel);
  if (state.firmLevel < template.minLevel) {
    return { ok: false, message: `Diese Position erfordert mindestens Kanzleistufe ${template.minLevel}.` };
  }
  if (state.employees.length >= level.maxEmployees) {
    return { ok: false, message: `Maximale Mitarbeiterzahl (${level.maxEmployees}) für die aktuelle Kanzleistufe erreicht.` };
  }
  const { name } = randomFullName(rng);
  const [min, max] = template.statRange;
  state.employees.push({
    id: generateId('emp'),
    name: `${name}`,
    role,
    salary: template.salary,
    hiredOnDay: state.day,
    stats: {
      experience: randomInt(min, max),
      speed: randomInt(min, max),
      accuracy: randomInt(min, max),
      negotiation: randomInt(min, max),
      research: randomInt(min, max),
      stressResistance: randomInt(min, max),
    },
    morale: randomInt(60, 90),
    assignedCaseIds: [],
  });
  pushEvent(state, `${name} wurde als ${template.label} eingestellt.`, '👨‍💼', 'positive');
  return { ok: true, message: 'Mitarbeiter eingestellt.' };
}

export function fireEmployee(state: GameState, employeeId: string) {
  const emp = state.employees.find((e) => e.id === employeeId);
  if (!emp) return;
  if (emp.salary === 0) return; // Kanzleiinhaber:in kann nicht entlassen werden
  for (const c of state.cases) {
    c.assignedEmployeeIds = c.assignedEmployeeIds.filter((id) => id !== employeeId);
  }
  state.employees = state.employees.filter((e) => e.id !== employeeId);
  pushEvent(state, `${emp.name} wurde aus der Kanzlei verabschiedet.`, '👋', 'info');
}

export function assignEmployeeToCase(state: GameState, caseId: string, employeeId: string) {
  const c = state.cases.find((x) => x.id === caseId);
  const emp = state.employees.find((e) => e.id === employeeId);
  if (!c || !emp) return;
  if (!c.assignedEmployeeIds.includes(employeeId)) {
    c.assignedEmployeeIds.push(employeeId);
  }
  if (!emp.assignedCaseIds.includes(caseId)) {
    emp.assignedCaseIds.push(caseId);
  }
  pushEvent(state, `${emp.name} wurde Fall "${c.title}" zugewiesen.`, '🧑‍⚖️', 'info', c.id);
}

export function unassignEmployeeFromCase(state: GameState, caseId: string, employeeId: string) {
  const c = state.cases.find((x) => x.id === caseId);
  const emp = state.employees.find((e) => e.id === employeeId);
  if (c) c.assignedEmployeeIds = c.assignedEmployeeIds.filter((id) => id !== employeeId);
  if (emp) emp.assignedCaseIds = emp.assignedCaseIds.filter((id) => id !== caseId);
}

export function applyDailyMoraleDrift(state: GameState) {
  for (const e of state.employees) {
    const load = e.assignedCaseIds.length;
    const drift = load > 3 ? -randomInt(0, 2) : randomInt(-1, 1);
    e.morale = clamp(e.morale + drift);
  }
}
