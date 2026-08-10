import type { Client, ClientSource, Case, Difficulty } from '../types';
import { randomFullName, PROFESSIONS, pickFrom } from '../data/names';
import { randomCaseTemplate } from '../data/caseTemplates';
import { generateId, randomInt, rng, clamp } from './util';

export function sourceLabel(source: ClientSource): string {
  switch (source) {
    case 'telefon': return 'Telefon';
    case 'email': return 'E-Mail';
    case 'empfehlung': return 'Empfehlung';
    case 'website': return 'Website';
    case 'bestandsmandant': return 'Bestehender Mandant';
    case 'unternehmensnetzwerk': return 'Unternehmensnetzwerk';
  }
}

function pickSource(reputation: number): ClientSource {
  const weights: [ClientSource, number][] = [
    ['telefon', 30],
    ['email', 25],
    ['website', 20],
    ['empfehlung', 10 + reputation * 0.4],
    ['bestandsmandant', 5 + reputation * 0.2],
    ['unternehmensnetzwerk', reputation > 40 ? 10 + reputation * 0.2 : 2],
  ];
  const total = weights.reduce((s, [, w]) => s + w, 0);
  let roll = rng() * total;
  for (const [source, w] of weights) {
    if (roll < w) return source;
    roll -= w;
  }
  return 'telefon';
}

export function generateClient(day: number, reputation: number): Client {
  const { name } = randomFullName(rng);
  const source = pickSource(reputation);
  return {
    id: generateId('cli'),
    name,
    age: randomInt(22, 68),
    profession: pickFrom(PROFESSIONS, rng),
    wealth: clamp(randomInt(10, 40) + reputation * randomInt(0, 1) + randomInt(0, reputation)),
    reputation: clamp(randomInt(20, 90)),
    paymentWillingness: clamp(randomInt(30, 95)),
    stressLevel: clamp(randomInt(20, 90)),
    reliability: clamp(randomInt(35, 95)),
    source,
    createdOnDay: day,
    isExisting: source === 'bestandsmandant',
    satisfaction: 60,
  };
}

function difficultyModifiers(difficulty: Difficulty): { chance: number; risk: number } {
  switch (difficulty) {
    case 'leicht': return { chance: randomInt(60, 85), risk: randomInt(10, 30) };
    case 'mittel': return { chance: randomInt(45, 70), risk: randomInt(25, 50) };
    case 'schwer': return { chance: randomInt(30, 55), risk: randomInt(40, 65) };
    case 'sehr schwer': return { chance: randomInt(15, 40), risk: randomInt(55, 85) };
  }
}

let caseCounter = 1;

export function generateCaseForClient(client: Client, day: number, reputation: number): Case {
  const template = randomCaseTemplate(rng);
  const scale = clamp(0.6 + reputation / 100, 0.5, 1.8);
  const [minV, maxV] = template.disputeValueRange;
  const disputeValue = maxV > 0 ? Math.round(randomInt(minV, maxV) * scale / 10) * 10 : 0;
  const { chance: successChance, risk } = difficultyModifiers(template.difficulty);

  let feeAmount: number;
  if (template.feeType === 'pauschale') {
    feeAmount = Math.max(400, Math.round((disputeValue * 0.12 + randomInt(300, 1200)) / 10) * 10);
  } else if (template.feeType === 'stundensatz') {
    feeAmount = pickFrom([100, 150, 200, 250], rng);
  } else {
    feeAmount = randomInt(15, 30); // % Erfolgshonorar
  }

  caseCounter += 1;
  const caseNumber = `W-${dateForYear(day)}-${String(caseCounter).padStart(4, '0')}`;

  return {
    id: generateId('case'),
    caseNumber,
    clientId: client.id,
    type: template.type,
    title: template.title,
    description: template.description,
    difficulty: template.difficulty,
    disputeValue,
    successChance,
    risk,
    fee: { type: template.feeType, amount: feeAmount },
    status: 'anfrage',
    evidenceStrength: randomInt(20, 50),
    preparation: 0,
    assignedEmployeeIds: [],
    documents: [],
    deadlines: [],
    timeline: [
      { id: generateId('tl'), day, dateLabel: '', text: 'Mandant kontaktiert die Kanzlei mit einer neuen Anfrage.' },
    ],
    court: null,
    settlementOffers: [],
    createdOnDay: day,
    dueDay: day + randomInt(30, 90),
    invoicedAmount: 0,
    paidAmount: 0,
    retainerPaid: false,
    hoursLogged: 0,
    outcome: null,
    actionsUsedToday: 0,
    lastActionDay: -1,
  };
}

function dateForYear(day: number): number {
  return 2026 + Math.floor(day / 365);
}
