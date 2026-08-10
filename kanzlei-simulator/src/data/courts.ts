import type { CaseType } from '../types';

export const COURTS_WIEN = [
  'Bezirksgericht Innere Stadt Wien',
  'Bezirksgericht Donaustadt',
  'Bezirksgericht Favoriten',
  'Landesgericht für Zivilrechtssachen Wien',
  'Landesgericht für Strafsachen Wien',
  'Handelsgericht Wien',
  'Arbeits- und Sozialgericht Wien',
];

export function courtForCase(type: CaseType, disputeValue: number): string {
  switch (type) {
    case 'Strafrecht':
      return 'Landesgericht für Strafsachen Wien';
    case 'Arbeitsrecht':
      return 'Arbeits- und Sozialgericht Wien';
    case 'Unternehmensrecht':
      return 'Handelsgericht Wien';
    default:
      return disputeValue > 15000
        ? 'Landesgericht für Zivilrechtssachen Wien'
        : 'Bezirksgericht Innere Stadt Wien';
  }
}
