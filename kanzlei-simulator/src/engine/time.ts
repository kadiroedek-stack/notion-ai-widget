import type { GameState } from '../types';
import { generateId, formatDate, monthLabel, isFirstOfMonth, startOfPreviousMonthDay, clamp, chance, randomInt } from './util';
import { pushEvent } from './events';
import { generateClient, generateCaseForClient } from './clients';
import { firmLevelDef } from '../data/firmLevels';
import { applyDailyMoraleDrift } from './employees';
import { checkAchievements } from './achievements';
import { RANDOM_EVENT_TEMPLATES, toPendingEvent } from '../data/randomEvents';
import { resolveTrial } from './court';

const FIXED_SOFTWARE_COST = 180;
const FIXED_INSURANCE_COST = 120;

function processNewLead(state: GameState) {
  const prob = clamp(0.14 + state.reputation / 220, 0.05, 0.6);
  if (!chance(prob)) return;
  const level = firmLevelDef(state.firmLevel);
  const pendingLeads = state.cases.filter((c) => c.status === 'anfrage').length;
  if (pendingLeads >= level.maxActiveCases) return;

  const client = generateClient(state.day, state.reputation);
  const kase = generateCaseForClient(client, state.day, state.reputation);
  state.clients.push(client);
  state.cases.push(kase);

  const sourceText: Record<string, string> = {
    telefon: 'hat angerufen',
    email: 'hat eine E-Mail geschickt',
    empfehlung: 'wurde empfohlen',
    website: 'hat sich über die Website gemeldet',
    bestandsmandant: 'ist ein bestehender Mandant mit einem neuen Anliegen',
    unternehmensnetzwerk: 'kommt über das Unternehmensnetzwerk',
  };
  pushEvent(
    state,
    `Neuer Mandant: ${client.name} ${sourceText[client.source]} – "${kase.title}".`,
    '📞',
    'info',
    kase.id,
  );
}

function processInvoicePayments(state: GameState) {
  for (const c of state.cases) {
    if (c.invoicedAmount <= 0) continue;
    const client = state.clients.find((cl) => cl.id === c.clientId);
    if (!client) continue;
    const payProb = clamp((client.reliability / 100) * (client.paymentWillingness / 100) + 0.15, 0.05, 0.85);
    if (chance(payProb)) {
      const amount = c.invoicedAmount;
      state.money += amount;
      c.paidAmount += amount;
      c.invoicedAmount = 0;
      state.stats.totalRevenue += amount;
      state.transactions.unshift({
        id: generateId('tx'), day: state.day, dateLabel: formatDate(state.day),
        label: `Zahlungseingang: ${c.title}`, amount, category: 'Honorar',
      });
      pushEvent(state, `Rechnung über ${amount.toLocaleString('de-AT')} € für Fall "${c.title}" wurde bezahlt.`, '💰', 'money', c.id);
    }
  }
}

function processDeadlines(state: GameState) {
  for (const c of state.cases) {
    if (c.status !== 'aktiv') continue;
    for (const dl of c.deadlines) {
      if (dl.done || dl.missed) continue;
      if (state.day > dl.dueDay) {
        dl.missed = true;
        state.reputation = clamp(state.reputation - randomInt(3, 7), 0, 100);
        pushEvent(state, `Frist "${dl.label}" in Fall "${c.title}" wurde versäumt!`, '⚠️', 'negative', c.id);
      }
    }
  }
}

function processCourtDates(state: GameState) {
  for (const c of state.cases) {
    if (c.status !== 'vor_gericht' || !c.court) continue;
    if (c.court.hearingDay === state.day) {
      pushEvent(state, `Heute ist der Gerichtstermin für Fall "${c.title}" beim ${c.court.court}.`, '⚖️', 'court', c.id);
    } else if (c.court.hearingDay < state.day) {
      // Termin verpasst / nicht rechtzeitig wahrgenommen -> automatische Verhandlung ohne Vorbereitung
      resolveTrial(state, c.id, -8, false);
      pushEvent(state, `Der Gerichtstermin in Fall "${c.title}" wurde ohne deine aktive Teilnahme abgehalten.`, '⚠️', 'negative', c.id);
    }
  }
  for (const entry of state.calendar) {
    if (entry.day <= state.day) entry.done = true;
  }
}

function processMonthlySettlement(state: GameState) {
  if (!isFirstOfMonth(state.day) || state.day === 0) return;
  const level = firmLevelDef(state.firmLevel);
  const salaries = state.employees.reduce((s, e) => s + e.salary, 0);
  const rent = level.monthlyRent;
  const fixedCosts = FIXED_SOFTWARE_COST + FIXED_INSURANCE_COST + level.level * 60;

  const prevMonth = monthLabel(state.day - 1);
  const monthStartDay = startOfPreviousMonthDay(state.day);

  const expenses = salaries + rent + fixedCosts;
  state.money -= expenses;

  state.transactions.unshift(
    { id: generateId('tx'), day: state.day, dateLabel: formatDate(state.day), label: 'Gehälter', amount: -salaries, category: 'Personal' },
    { id: generateId('tx'), day: state.day, dateLabel: formatDate(state.day), label: 'Büromiete', amount: -rent, category: 'Miete' },
    { id: generateId('tx'), day: state.day, dateLabel: formatDate(state.day), label: 'Fixkosten (Software, Versicherung, Marketing)', amount: -fixedCosts, category: 'Fixkosten' },
  );

  const monthTx = state.transactions.filter((t) => t.day >= monthStartDay && t.day < state.day);
  const income = monthTx.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const monthExpenses = monthTx.filter((t) => t.amount < 0).reduce((s, t) => s + -t.amount, 0);

  state.financeHistory.unshift({
    monthLabel: prevMonth,
    income,
    expenses: monthExpenses,
    profit: income - monthExpenses,
    rent,
    salaries,
    fixedCosts,
    fees: income,
  });
  if (state.financeHistory.length > 24) state.financeHistory.length = 24;

  pushEvent(
    state,
    `Monatsabrechnung ${prevMonth}: Einnahmen ${income.toLocaleString('de-AT')} €, Ausgaben ${monthExpenses.toLocaleString('de-AT')} €, Gewinn ${(income - monthExpenses).toLocaleString('de-AT')} €.`,
    '📈',
    income - monthExpenses >= 0 ? 'positive' : 'negative',
  );

  if (state.money < 0) {
    state.reputation = clamp(state.reputation - 5, 0, 100);
    pushEvent(state, 'Die Kanzlei ist im Minus – dringend um Einnahmen kümmern!', '🚨', 'negative');
  }
}

function narrativeEventApplicable(state: GameState, id: string): boolean {
  if (id === 'employee_quits') return state.employees.some((e) => e.salary > 0);
  if (id === 'court_postponed') return state.cases.some((c) => c.status === 'vor_gericht' && c.court);
  return true;
}

function processRandomNarrativeEvent(state: GameState) {
  if (state.pendingRandomEvent) return;
  if (!chance(0.09)) return;
  const candidates = RANDOM_EVENT_TEMPLATES.filter(
    (t) => (!t.minReputation || state.reputation >= t.minReputation) && narrativeEventApplicable(state, t.id),
  );
  if (candidates.length === 0) return;
  const template = candidates[Math.floor(Math.random() * candidates.length)];
  state.pendingRandomEvent = toPendingEvent(template);
}

export function advanceOneDay(state: GameState) {
  state.day += 1;
  processCourtDates(state);
  processDeadlines(state);
  processNewLead(state);
  processInvoicePayments(state);
  applyDailyMoraleDrift(state);
  processMonthlySettlement(state);
  processRandomNarrativeEvent(state);
  checkAchievements(state);
}

export function advanceOneWeek(state: GameState) {
  for (let i = 0; i < 7; i += 1) {
    if (state.pendingRandomEvent) break; // Entscheidung zuerst treffen
    advanceOneDay(state);
  }
}

export function resolveRandomEvent(state: GameState, choiceIndex: number) {
  if (!state.pendingRandomEvent) return;
  const eventId = state.pendingRandomEvent.id;
  const choice = state.pendingRandomEvent.choices[choiceIndex];
  if (!choice) return;
  if (choice.moneyDelta) state.money += choice.moneyDelta;
  if (choice.reputationDelta) state.reputation = clamp(state.reputation + choice.reputationDelta, 0, 100);

  if (eventId === 'employee_quits') {
    const candidates = state.employees.filter((e) => e.salary > 0);
    const leaving = candidates[Math.floor(Math.random() * candidates.length)];
    if (leaving) {
      for (const c of state.cases) {
        c.assignedEmployeeIds = c.assignedEmployeeIds.filter((id) => id !== leaving.id);
      }
      state.employees = state.employees.filter((e) => e.id !== leaving.id);
    }
  } else if (eventId === 'court_postponed') {
    const hearingCase = state.cases.find((c) => c.status === 'vor_gericht' && c.court);
    if (hearingCase && hearingCase.court) {
      hearingCase.court.hearingDay += 7;
      const entry = state.calendar.find((e) => e.caseId === hearingCase.id && e.type === 'gericht' && !e.done);
      if (entry) entry.day = hearingCase.court.hearingDay;
    }
  }

  pushEvent(state, choice.resultText, choice.moneyDelta && choice.moneyDelta < 0 ? '📉' : '📌', choice.reputationDelta && choice.reputationDelta < 0 ? 'negative' : 'positive');
  state.pendingRandomEvent = null;
}
