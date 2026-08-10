import type { GameState, Case } from '../types';
import { pushEvent } from './events';
import { pushTimeline } from './events';
import { generateId, formatDate, clamp, randomInt, chance } from './util';
import { courtForCase } from '../data/courts';
import { firmLevelDef } from '../data/firmLevels';

export const MAX_ACTIONS_PER_DAY = 3;

export type CaseActionId =
  | 'document'
  | 'research'
  | 'contact_client'
  | 'file_lawsuit'
  | 'schriftsatz'
  | 'prepare_hearing'
  | 'contact_opponent'
  | 'invoice'
  | 'offer_settlement';

function findCase(state: GameState, caseId: string): Case {
  const c = state.cases.find((x) => x.id === caseId);
  if (!c) throw new Error('Fall nicht gefunden');
  return c;
}

function resetDailyActionsIfNeeded(c: Case, day: number) {
  if (c.lastActionDay !== day) {
    c.actionsUsedToday = 0;
    c.lastActionDay = day;
  }
}

export function activeCaseCount(state: GameState): number {
  return state.cases.filter((c) => c.status === 'aktiv' || c.status === 'vor_gericht').length;
}

export function takeCase(state: GameState, caseId: string) {
  const c = findCase(state, caseId);
  if (c.status !== 'anfrage') return;
  const level = firmLevelDef(state.firmLevel);
  if (activeCaseCount(state) >= level.maxActiveCases) {
    pushEvent(state, `Maximale Anzahl aktiver Fälle (${level.maxActiveCases}) erreicht. Kanzlei upgraden, um mehr Fälle zu übernehmen.`, '⚠️', 'negative');
    return;
  }
  c.status = 'aktiv';
  pushTimeline(c.timeline, state.day, 'Mandat wird übernommen.');
  pushEvent(state, `Neues Mandat übernommen: "${c.title}" (${c.caseNumber}).`, '📁', 'info', c.id);
  c.deadlines.push({
    id: generateId('dl'), label: 'Klage einbringen / Verfahren einleiten', dueDay: state.day + 21, done: false, missed: false,
  });

  if (c.fee.type === 'pauschale') {
    const retainer = Math.round(c.fee.amount * 0.3);
    state.money += retainer;
    c.paidAmount += retainer;
    state.stats.totalRevenue += retainer;
    state.transactions.unshift({
      id: generateId('tx'), day: state.day, dateLabel: formatDate(state.day),
      label: `Vorschuss: ${c.title}`, amount: retainer, category: 'Honorar',
    });
    pushEvent(state, `Vorschuss von ${retainer.toLocaleString('de-AT')} € für Fall "${c.title}" erhalten.`, '💰', 'money', c.id);
  }
  state.stats.casesTotal += 1;
}

export function rejectCase(state: GameState, caseId: string) {
  const c = findCase(state, caseId);
  if (c.status !== 'anfrage') return;
  c.status = 'abgelehnt';
  pushEvent(state, `Anfrage "${c.title}" abgelehnt.`, '🚫', 'info', c.id);
}

const ACTION_COST: Record<CaseActionId, number> = {
  document: 50,
  research: 30,
  contact_client: 0,
  file_lawsuit: 0, // computed dynamically
  schriftsatz: 80,
  prepare_hearing: 100,
  contact_opponent: 0,
  invoice: 0,
  offer_settlement: 0,
};

function assignedResearchBonus(state: GameState, c: Case): number {
  const employees = state.employees.filter((e) => c.assignedEmployeeIds.includes(e.id));
  if (employees.length === 0) return 0;
  const avg = employees.reduce((s, e) => s + e.stats.research, 0) / employees.length;
  return Math.round(avg / 10);
}

export function performCaseAction(state: GameState, caseId: string, action: CaseActionId): { ok: boolean; message: string } {
  const c = findCase(state, caseId);
  if (c.status !== 'aktiv' && c.status !== 'vor_gericht') {
    return { ok: false, message: 'Diese Aktion ist für den aktuellen Fallstatus nicht möglich.' };
  }
  resetDailyActionsIfNeeded(c, state.day);
  if (c.actionsUsedToday >= MAX_ACTIONS_PER_DAY) {
    return { ok: false, message: `Für heute wurden bereits ${MAX_ACTIONS_PER_DAY} Aktionen für diesen Fall durchgeführt.` };
  }

  const cost = ACTION_COST[action];
  if (cost > 0 && state.money < cost) {
    return { ok: false, message: 'Nicht genügend Geld für diese Aktion.' };
  }

  const bonus = assignedResearchBonus(state, c);

  switch (action) {
    case 'document': {
      const quality = clamp(randomInt(50, 80) + bonus);
      c.documents.push({ id: generateId('doc'), title: `Dokument zu ${c.title}`, createdOnDay: state.day, quality });
      c.evidenceStrength = clamp(c.evidenceStrength + randomInt(5, 10));
      c.hoursLogged += 2;
      state.money -= cost;
      pushTimeline(c.timeline, state.day, 'Dokument erstellt und abgelegt.');
      pushEvent(state, `Dokument für Fall "${c.title}" erstellt.`, '📄', 'info', c.id);
      break;
    }
    case 'research': {
      c.evidenceStrength = clamp(c.evidenceStrength + randomInt(8, 15) + bonus);
      c.successChance = clamp(c.successChance + randomInt(1, 4));
      c.hoursLogged += 3;
      state.money -= cost;
      pushTimeline(c.timeline, state.day, 'Rechtliche Recherche durchgeführt.');
      pushEvent(state, `Recherche für Fall "${c.title}" abgeschlossen – Beweislage verbessert.`, '🔎', 'info', c.id);
      break;
    }
    case 'contact_client': {
      const client = state.clients.find((cl) => cl.id === c.clientId);
      if (client) client.satisfaction = clamp(client.satisfaction + randomInt(3, 8));
      pushTimeline(c.timeline, state.day, 'Mandant über den Fortschritt informiert.');
      pushEvent(state, `Mandant zu Fall "${c.title}" kontaktiert.`, '📞', 'info', c.id);
      break;
    }
    case 'schriftsatz': {
      c.preparation = clamp(c.preparation + randomInt(10, 15));
      c.evidenceStrength = clamp(c.evidenceStrength + randomInt(2, 5));
      c.hoursLogged += 4;
      state.money -= cost;
      pushTimeline(c.timeline, state.day, 'Schriftsatz erstellt und eingereicht.');
      pushEvent(state, `Schriftsatz für Fall "${c.title}" erstellt.`, '📝', 'info', c.id);
      break;
    }
    case 'contact_opponent': {
      pushTimeline(c.timeline, state.day, 'Gegenseite kontaktiert.');
      if (chance(0.35) && c.disputeValue > 0) {
        const amount = Math.round(c.disputeValue * randomFloatLocal(0.3, 0.6) / 10) * 10;
        c.settlementOffers.push({ id: generateId('so'), from: 'gegner', amount, createdOnDay: state.day, status: 'offen' });
        pushEvent(state, `Die Gegenseite bietet in Fall "${c.title}" einen Vergleich über ${amount.toLocaleString('de-AT')} € an.`, '🤝', 'decision', c.id);
      } else {
        pushEvent(state, `Gegenseite in Fall "${c.title}" kontaktiert – bisher keine Reaktion.`, '💬', 'info', c.id);
      }
      break;
    }
    case 'offer_settlement': {
      if (c.disputeValue <= 0) {
        return { ok: false, message: 'Für diesen Falltyp ist kein Vergleich möglich.' };
      }
      const amount = Math.round(c.disputeValue * randomFloatLocal(0.45, 0.7) / 10) * 10;
      c.settlementOffers.push({ id: generateId('so'), from: 'mandant', amount, createdOnDay: state.day, status: 'offen' });
      pushTimeline(c.timeline, state.day, `Vergleichsangebot über ${amount.toLocaleString('de-AT')} € unterbreitet.`);
      pushEvent(state, `Vergleichsangebot für Fall "${c.title}" an die Gegenseite übermittelt.`, '🤝', 'info', c.id);
      break;
    }
    case 'prepare_hearing': {
      if (!c.court) {
        return { ok: false, message: 'Für diesen Fall wurde noch kein Gerichtstermin anberaumt.' };
      }
      c.court.argumentStrength = clamp(c.court.argumentStrength + randomInt(10, 20) + bonus);
      c.court.prepared = true;
      c.preparation = clamp(c.preparation + randomInt(8, 12));
      c.hoursLogged += 4;
      state.money -= cost;
      pushTimeline(c.timeline, state.day, 'Gerichtstermin vorbereitet – Argumentation gestärkt.');
      pushEvent(state, `Vorbereitung für Gerichtstermin in Fall "${c.title}" abgeschlossen.`, '📅', 'info', c.id);
      break;
    }
    case 'file_lawsuit': {
      if (c.court) {
        return { ok: false, message: 'Für diesen Fall wurde bereits Klage eingebracht.' };
      }
      const courtFee = Math.max(150, Math.round(c.disputeValue * 0.02 / 10) * 10);
      if (state.money < courtFee) {
        return { ok: false, message: 'Nicht genügend Geld für die Gerichtsgebühr.' };
      }
      state.money -= courtFee;
      state.transactions.unshift({
        id: generateId('tx'), day: state.day, dateLabel: formatDate(state.day),
        label: `Gerichtsgebühr: ${c.title}`, amount: -courtFee, category: 'Gerichtskosten',
      });
      const court = courtForCase(c.type, c.disputeValue);
      const hearingDay = state.day + randomInt(14, 35);
      c.court = { court, hearingDay, prepared: false, argumentStrength: clamp(c.evidenceStrength - 10) };
      c.status = 'vor_gericht';
      state.calendar.push({ id: generateId('cal'), day: hearingDay, type: 'gericht', title: `Gerichtstermin: ${c.title}`, caseId: c.id, done: false });
      for (const dl of c.deadlines) {
        if (!dl.done) dl.done = true;
      }
      pushTimeline(c.timeline, state.day, `Klage beim ${court} eingebracht.`);
      pushEvent(state, `Klage für Fall "${c.title}" beim ${court} eingebracht. Termin: ${formatDate(hearingDay)}.`, '⚖️', 'court', c.id);
      break;
    }
    case 'invoice': {
      const result = generateInvoice(state, c);
      if (!result.ok) return result;
      break;
    }
  }

  if (action !== 'invoice') {
    c.actionsUsedToday += 1;
  }
  return { ok: true, message: 'Aktion durchgeführt.' };
}

function randomFloatLocal(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function generateInvoice(state: GameState, c: Case): { ok: boolean; message: string } {
  let amount = 0;
  if (c.fee.type === 'pauschale') {
    amount = c.fee.amount - c.paidAmount;
  } else if (c.fee.type === 'stundensatz') {
    if (c.hoursLogged <= 0) {
      return { ok: false, message: 'Noch keine abrechenbaren Stunden für diesen Fall.' };
    }
    amount = c.hoursLogged * c.fee.amount;
    c.hoursLogged = 0;
  } else {
    return { ok: false, message: 'Erfolgshonorare werden automatisch nach Fallabschluss abgerechnet.' };
  }
  if (amount <= 0) {
    return { ok: false, message: 'Es gibt aktuell nichts abzurechnen.' };
  }
  c.invoicedAmount += amount;
  pushTimeline(c.timeline, state.day, `Rechnung über ${amount.toLocaleString('de-AT')} € gestellt.`);
  pushEvent(state, `Rechnung über ${amount.toLocaleString('de-AT')} € für Fall "${c.title}" gestellt.`, '🧾', 'info', c.id);
  return { ok: true, message: 'Rechnung gestellt.' };
}

export function respondToSettlement(
  state: GameState,
  caseId: string,
  offerId: string,
  decision: 'annehmen' | 'ablehnen' | 'gegenangebot',
  counterAmount?: number,
) {
  const c = findCase(state, caseId);
  const offer = c.settlementOffers.find((o) => o.id === offerId);
  if (!offer || offer.status !== 'offen') return;

  if (decision === 'annehmen') {
    offer.status = 'angenommen';
    resolveCase(state, c, 'vergleich', offer.amount);
  } else if (decision === 'ablehnen') {
    offer.status = 'abgelehnt';
    pushTimeline(c.timeline, state.day, 'Vergleichsangebot abgelehnt.');
    pushEvent(state, `Vergleichsangebot in Fall "${c.title}" abgelehnt.`, '🚫', 'info', c.id);
  } else if (decision === 'gegenangebot' && counterAmount) {
    offer.status = 'gegenangebot';
    c.settlementOffers.push({
      id: generateId('so'), from: 'mandant', amount: counterAmount, createdOnDay: state.day, status: 'offen',
    });
    pushTimeline(c.timeline, state.day, `Gegenangebot über ${counterAmount.toLocaleString('de-AT')} € unterbreitet.`);
    pushEvent(state, `Gegenangebot über ${counterAmount.toLocaleString('de-AT')} € in Fall "${c.title}" übermittelt.`, '🤝', 'info', c.id);
  }
}

export function resolveCase(state: GameState, c: Case, outcome: 'gewonnen' | 'verloren' | 'vergleich', settlementAmount = 0) {
  c.outcome = outcome;
  c.status = outcome === 'gewonnen' ? 'abgeschlossen_gewonnen' : outcome === 'verloren' ? 'abgeschlossen_verloren' : 'abgeschlossen_vergleich';

  let revenue = 0;
  if (outcome === 'vergleich') {
    revenue = Math.round(settlementAmount * 0.15);
  } else if (outcome === 'gewonnen') {
    if (c.fee.type === 'erfolgshonorar') {
      revenue = Math.round((c.disputeValue * c.fee.amount) / 100);
    } else {
      revenue = Math.max(0, c.fee.amount - c.paidAmount);
    }
  } else {
    revenue = c.fee.type === 'erfolgshonorar' ? 0 : 0;
  }

  if (revenue > 0) {
    state.money += revenue;
    c.paidAmount += revenue;
    state.stats.totalRevenue += revenue;
    state.transactions.unshift({
      id: generateId('tx'), day: state.day, dateLabel: formatDate(state.day),
      label: `Honorar: ${c.title}`, amount: revenue, category: 'Honorar',
    });
  }

  const client = state.clients.find((cl) => cl.id === c.clientId);

  if (outcome === 'gewonnen') {
    state.stats.casesWon += 1;
    state.reputation = clamp(state.reputation + randomInt(3, 8), 0, 100);
    if (client) client.satisfaction = clamp(client.satisfaction + randomInt(10, 20));
    pushEvent(state, `Fall "${c.title}" gewonnen! ${revenue > 0 ? `Honorar: ${revenue.toLocaleString('de-AT')} €.` : ''}`, '🏆', 'positive', c.id);
  } else if (outcome === 'verloren') {
    state.stats.casesLost += 1;
    state.reputation = clamp(state.reputation - randomInt(3, 9), 0, 100);
    if (client) client.satisfaction = clamp(client.satisfaction - randomInt(10, 20));
    pushEvent(state, `Fall "${c.title}" verloren.`, '❌', 'negative', c.id);
  } else {
    state.stats.casesSettled += 1;
    state.reputation = clamp(state.reputation + randomInt(1, 4), 0, 100);
    if (client) client.satisfaction = clamp(client.satisfaction + randomInt(5, 12));
    pushEvent(state, `Vergleich in Fall "${c.title}" über ${settlementAmount.toLocaleString('de-AT')} € erzielt.`, '🤝', 'positive', c.id);
  }

  pushTimeline(c.timeline, state.day, `Fall abgeschlossen: ${outcome === 'gewonnen' ? 'gewonnen' : outcome === 'verloren' ? 'verloren' : 'Vergleich erzielt'}.`);
}
