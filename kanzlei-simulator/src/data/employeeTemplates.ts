import type { EmployeeRole } from '../types';

export interface EmployeeTemplate {
  role: EmployeeRole;
  label: string;
  salary: number;
  minLevel: number;
  statRange: [number, number];
  description: string;
}

export const EMPLOYEE_TEMPLATES: EmployeeTemplate[] = [
  {
    role: 'assistent',
    label: 'Rechtsanwaltsassistent',
    salary: 2000,
    minLevel: 1,
    statRange: [20, 45],
    description: 'Übernimmt organisatorische Aufgaben und einfache Recherchen.',
  },
  {
    role: 'jurist',
    label: 'Juristischer Mitarbeiter',
    salary: 2800,
    minLevel: 1,
    statRange: [30, 55],
    description: 'Unterstützt bei Schriftsätzen und rechtlicher Recherche.',
  },
  {
    role: 'junior',
    label: 'Junior Associate',
    salary: 3500,
    minLevel: 2,
    statRange: [40, 65],
    description: 'Bearbeitet eigenständig kleinere Fälle unter Aufsicht.',
  },
  {
    role: 'senior',
    label: 'Senior Associate',
    salary: 5000,
    minLevel: 3,
    statRange: [55, 80],
    description: 'Erfahrene Anwältin/erfahrener Anwalt für anspruchsvolle Fälle.',
  },
  {
    role: 'partner',
    label: 'Partner',
    salary: 7000,
    minLevel: 4,
    statRange: [70, 95],
    description: 'Bringt eigene Mandanten und Prestige in die Kanzlei ein.',
  },
];

export function templateForRole(role: EmployeeRole): EmployeeTemplate {
  return EMPLOYEE_TEMPLATES.find((t) => t.role === role)!;
}
