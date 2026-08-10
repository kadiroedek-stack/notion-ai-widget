import type { PendingRandomEvent } from '../types';

export interface RandomEventTemplate {
  id: string;
  title: string;
  description: string;
  minReputation?: number;
  choices: {
    label: string;
    moneyDelta?: number;
    reputationDelta?: number;
    resultText: string;
  }[];
}

export const RANDOM_EVENT_TEMPLATES: RandomEventTemplate[] = [
  {
    id: 'famous_entrepreneur',
    title: 'Bekannter Unternehmer sucht Anwalt',
    description: 'Ein bekannter Wiener Unternehmer sucht dringend rechtlichen Beistand und ist bereit, gut dafür zu zahlen – wenn du dich sofort meldest, kannst du ihn beeindrucken.',
    minReputation: 20,
    choices: [
      { label: 'Sofort persönlich zurückrufen', moneyDelta: 1500, reputationDelta: 4, resultText: 'Der Unternehmer ist beeindruckt von deiner Schnelligkeit und beauftragt die Kanzlei mit einem lukrativen Mandat.' },
      { label: 'Standardmäßig per E-Mail antworten', moneyDelta: 300, reputationDelta: 1, resultText: 'Der Unternehmer antwortet knapp, beauftragt die Kanzlei aber trotzdem für ein kleineres Anliegen.' },
      { label: 'Ignorieren – zu beschäftigt', moneyDelta: 0, reputationDelta: -2, resultText: 'Der Unternehmer wendet sich an eine andere Kanzlei. Das spricht sich herum.' },
    ],
  },
  {
    id: 'invoice_complaint',
    title: 'Mandant beschwert sich über Rechnung',
    description: 'Ein Mandant findet deine Rechnung überzogen und droht, negative Bewertungen zu hinterlassen, falls nicht nachverhandelt wird.',
    choices: [
      { label: 'Rechnung um 20% reduzieren', moneyDelta: -400, reputationDelta: 2, resultText: 'Der Mandant ist zufrieden und empfiehlt dich sogar weiter.' },
      { label: 'Auf der Rechnung bestehen', moneyDelta: 0, reputationDelta: -3, resultText: 'Der Mandant ist verärgert und hinterlässt eine schlechte Bewertung.' },
      { label: 'Ratenzahlung anbieten', moneyDelta: -100, reputationDelta: 1, resultText: 'Der Mandant nimmt das Angebot an und bleibt Kunde.' },
    ],
  },
  {
    id: 'deadline_mistake',
    title: 'Frist falsch eingetragen',
    description: 'Ein Mitarbeiter hat eine wichtige Frist versehentlich falsch im System eingetragen. Es bleibt wenig Zeit, den Fehler auszubügeln.',
    choices: [
      { label: 'Überstunden anordnen und sofort korrigieren', moneyDelta: -600, reputationDelta: 0, resultText: 'Mit viel Aufwand wird die Frist doch noch eingehalten.' },
      { label: 'Fristerstreckung beim Gericht beantragen', moneyDelta: -150, reputationDelta: -1, resultText: 'Das Gericht gewährt eine kurze Fristerstreckung, notiert den Vorfall aber.' },
      { label: 'Risiko eingehen und nichts tun', moneyDelta: 0, reputationDelta: -6, resultText: 'Die Frist wird versäumt – ein herber Rückschlag für die Kanzlei.' },
    ],
  },
  {
    id: 'newspaper_report',
    title: 'Zeitung berichtet über gewonnenen Prozess',
    description: 'Eine bekannte Wiener Tageszeitung möchte über einen deiner erfolgreichen Fälle berichten.',
    choices: [
      { label: 'Interview geben', moneyDelta: 0, reputationDelta: 6, resultText: 'Der Artikel bringt spürbar mehr Anfragen.' },
      { label: 'Höflich ablehnen', moneyDelta: 0, reputationDelta: 0, resultText: 'Du bleibst zurückhaltend – keine Auswirkung.' },
    ],
  },
  {
    id: 'referral',
    title: 'Ehemaliger Mandant empfiehlt dich weiter',
    description: 'Ein zufriedener ehemaliger Mandant hat dich in seinem Netzwerk empfohlen.',
    choices: [
      { label: 'Bedanken und Kontakt pflegen', moneyDelta: 0, reputationDelta: 3, resultText: 'Die Beziehung stärkt deinen Ruf nachhaltig.' },
    ],
  },
  {
    id: 'competitor',
    title: 'Neuer Wettbewerber in Wien',
    description: 'Eine große internationale Kanzlei eröffnet eine Niederlassung in Wien und wirbt aggressiv um Mandanten.',
    choices: [
      { label: 'In Marketing investieren', moneyDelta: -800, reputationDelta: 3, resultText: 'Deine Kanzlei bleibt sichtbar und trotzt der Konkurrenz.' },
      { label: 'Abwarten', moneyDelta: 0, reputationDelta: -2, resultText: 'Einige potenzielle Mandanten wandern zur Konkurrenz ab.' },
    ],
  },
  {
    id: 'employee_quits',
    title: 'Mitarbeiter kündigt',
    description: 'Ein Mitarbeiter mit niedriger Moral hat überraschend gekündigt.',
    choices: [
      { label: 'Verständnisvoll reagieren', moneyDelta: 0, reputationDelta: 0, resultText: 'Der Mitarbeiter verlässt die Kanzlei in gutem Einvernehmen.' },
    ],
  },
  {
    id: 'court_postponed',
    title: 'Gericht verschiebt Termin',
    description: 'Ein anstehender Gerichtstermin wurde kurzfristig um eine Woche verschoben.',
    choices: [
      { label: 'Zur Kenntnis nehmen', moneyDelta: 0, reputationDelta: 0, resultText: 'Die zusätzliche Zeit kann für weitere Vorbereitung genutzt werden.' },
    ],
  },
];

export function toPendingEvent(t: RandomEventTemplate): PendingRandomEvent {
  return { id: t.id, title: t.title, description: t.description, choices: t.choices };
}
