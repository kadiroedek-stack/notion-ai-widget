import type { CaseType, Difficulty, FeeType } from '../types';

export interface CaseTemplate {
  type: CaseType;
  title: string;
  description: string;
  difficulty: Difficulty;
  disputeValueRange: [number, number];
  feeType: FeeType;
}

export const CASE_TEMPLATES: CaseTemplate[] = [
  {
    type: 'Verkehrsrecht',
    title: 'Unfall mit Personenschaden',
    description: 'Der Mandant wurde bei einem Verkehrsunfall verletzt und fordert Schadenersatz und Schmerzensgeld von der gegnerischen Versicherung.',
    difficulty: 'mittel',
    disputeValueRange: [4000, 35000],
    feeType: 'erfolgshonorar',
  },
  {
    type: 'Mietrecht',
    title: 'Streit über Mietkaution',
    description: 'Der Vermieter verweigert die Rückzahlung der Mietkaution nach Auszug unter Berufung auf angebliche Schäden.',
    difficulty: 'leicht',
    disputeValueRange: [800, 6000],
    feeType: 'pauschale',
  },
  {
    type: 'Arbeitsrecht',
    title: 'Kündigung eines Mitarbeiters',
    description: 'Der Mandant wurde fristlos entlassen und bestreitet die Rechtmäßigkeit der Kündigung.',
    difficulty: 'mittel',
    disputeValueRange: [3000, 20000],
    feeType: 'stundensatz',
  },
  {
    type: 'Unternehmensrecht',
    title: 'Vertragsstreit zwischen Unternehmen',
    description: 'Zwei Geschäftspartner streiten über die Erfüllung eines Liefervertrags und drohen mit gegenseitigen Klagen.',
    difficulty: 'schwer',
    disputeValueRange: [15000, 180000],
    feeType: 'stundensatz',
  },
  {
    type: 'Strafrecht',
    title: 'Körperverletzung',
    description: 'Dem Mandanten wird vorgeworfen, bei einer Auseinandersetzung eine andere Person verletzt zu haben.',
    difficulty: 'schwer',
    disputeValueRange: [0, 0],
    feeType: 'pauschale',
  },
  {
    type: 'Strafrecht',
    title: 'Diebstahlsvorwurf',
    description: 'Der Mandant wird beschuldigt, Waren aus einem Geschäft entwendet zu haben, und bestreitet die Vorwürfe.',
    difficulty: 'mittel',
    disputeValueRange: [0, 0],
    feeType: 'pauschale',
  },
  {
    type: 'Zivilrecht',
    title: 'Schadenersatzforderung',
    description: 'Der Mandant fordert Schadenersatz für einen durch einen Dritten verursachten Sachschaden.',
    difficulty: 'leicht',
    disputeValueRange: [1500, 12000],
    feeType: 'erfolgshonorar',
  },
  {
    type: 'Familienrecht',
    title: 'Streit um Obsorge',
    description: 'Nach der Trennung streiten die Eltern über die Obsorge und das Kontaktrecht für die gemeinsamen Kinder.',
    difficulty: 'schwer',
    disputeValueRange: [0, 0],
    feeType: 'stundensatz',
  },
  {
    type: 'Familienrecht',
    title: 'Unterhaltsstreit',
    description: 'Die Höhe des Kindesunterhalts wird zwischen den ehemaligen Partnern strittig verhandelt.',
    difficulty: 'mittel',
    disputeValueRange: [2000, 15000],
    feeType: 'pauschale',
  },
  {
    type: 'Vertragsrecht',
    title: 'Mangelhafte Werkleistung',
    description: 'Der Mandant sieht eine beauftragte Werkleistung als mangelhaft an und verweigert die Restzahlung.',
    difficulty: 'mittel',
    disputeValueRange: [2500, 40000],
    feeType: 'stundensatz',
  },
  {
    type: 'Vertragsrecht',
    title: 'Rücktritt vom Kaufvertrag',
    description: 'Der Mandant möchte von einem Kaufvertrag über ein Fahrzeug zurücktreten, da versteckte Mängel aufgetreten sind.',
    difficulty: 'leicht',
    disputeValueRange: [3000, 25000],
    feeType: 'pauschale',
  },
  {
    type: 'Zivilrecht',
    title: 'Nachbarschaftsstreit über Grundstücksgrenze',
    description: 'Zwei Nachbarn streiten über den genauen Verlauf einer Grundstücksgrenze und angrenzende Baumaßnahmen.',
    difficulty: 'mittel',
    disputeValueRange: [1000, 9000],
    feeType: 'pauschale',
  },
  {
    type: 'Unternehmensrecht',
    title: 'Gesellschafterstreit',
    description: 'Zwei Gesellschafter einer GmbH sind zerstritten und streiten über Gewinnausschüttung und Geschäftsführung.',
    difficulty: 'sehr schwer',
    disputeValueRange: [50000, 400000],
    feeType: 'stundensatz',
  },
  {
    type: 'Mietrecht',
    title: 'Räumungsklage',
    description: 'Der Vermieter beauftragt die Kanzlei mit der Räumungsklage gegen einen Mieter mit erheblichen Mietrückständen.',
    difficulty: 'mittel',
    disputeValueRange: [3000, 18000],
    feeType: 'stundensatz',
  },
  {
    type: 'Verkehrsrecht',
    title: 'Führerscheinentzug anfechten',
    description: 'Dem Mandanten wurde der Führerschein entzogen, er möchte gegen den Bescheid vorgehen.',
    difficulty: 'leicht',
    disputeValueRange: [500, 3000],
    feeType: 'pauschale',
  },
];

export function randomCaseTemplate(rng: () => number): CaseTemplate {
  return CASE_TEMPLATES[Math.floor(rng() * CASE_TEMPLATES.length)];
}
