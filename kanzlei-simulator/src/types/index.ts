// ---------------------------------------------------------------------------
// Kanzlei Simulator – zentrale Datenmodelle
// ---------------------------------------------------------------------------

export type CaseType =
  | 'Zivilrecht'
  | 'Strafrecht'
  | 'Arbeitsrecht'
  | 'Mietrecht'
  | 'Verkehrsrecht'
  | 'Familienrecht'
  | 'Unternehmensrecht'
  | 'Vertragsrecht';

export type Difficulty = 'leicht' | 'mittel' | 'schwer' | 'sehr schwer';

export type CaseStatus =
  | 'anfrage' // eingehende Anfrage, noch nicht angenommen
  | 'aktiv' // angenommen, in Bearbeitung
  | 'vor_gericht' // Gerichtstermin anberaumt
  | 'abgeschlossen_gewonnen'
  | 'abgeschlossen_verloren'
  | 'abgeschlossen_vergleich'
  | 'abgelehnt';

export type ClientSource =
  | 'telefon'
  | 'email'
  | 'empfehlung'
  | 'website'
  | 'bestandsmandant'
  | 'unternehmensnetzwerk';

export type EmployeeRole = 'assistent' | 'jurist' | 'junior' | 'senior' | 'partner';

export type FeeType = 'pauschale' | 'stundensatz' | 'erfolgshonorar';

export interface EmployeeStats {
  experience: number; // 0-100
  speed: number; // 0-100
  accuracy: number; // 0-100
  negotiation: number; // 0-100
  research: number; // 0-100
  stressResistance: number; // 0-100
}

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  salary: number; // monatlich
  hiredOnDay: number;
  stats: EmployeeStats;
  morale: number; // 0-100
  assignedCaseIds: string[];
}

export interface Client {
  id: string;
  name: string;
  age: number;
  profession: string;
  wealth: number; // 0-100
  reputation: number; // 0-100
  paymentWillingness: number; // 0-100
  stressLevel: number; // 0-100
  reliability: number; // 0-100
  source: ClientSource;
  createdOnDay: number;
  isExisting: boolean;
  satisfaction: number; // 0-100
}

export interface TimelineEntry {
  id: string;
  day: number;
  dateLabel: string;
  text: string;
}

export interface Deadline {
  id: string;
  label: string;
  dueDay: number;
  done: boolean;
  missed: boolean;
}

export interface CaseDocument {
  id: string;
  title: string;
  createdOnDay: number;
  quality: number; // 0-100
}

export interface SettlementOffer {
  id: string;
  from: 'gegner' | 'mandant';
  amount: number;
  createdOnDay: number;
  status: 'offen' | 'angenommen' | 'abgelehnt' | 'gegenangebot';
}

export interface CourtInfo {
  court: string;
  hearingDay: number;
  prepared: boolean;
  argumentStrength: number; // 0-100, built up via Vorbereitung
}

export interface CaseFee {
  type: FeeType;
  amount: number; // Pauschale in € oder Stundensatz in € oder % bei Erfolgshonorar
}

export interface Case {
  id: string;
  caseNumber: string;
  clientId: string;
  type: CaseType;
  title: string;
  description: string;
  difficulty: Difficulty;
  disputeValue: number;
  successChance: number; // 0-100, aktuelle Einschätzung
  risk: number; // 0-100
  fee: CaseFee;
  status: CaseStatus;
  evidenceStrength: number; // 0-100
  preparation: number; // 0-100
  assignedEmployeeIds: string[];
  documents: CaseDocument[];
  deadlines: Deadline[];
  timeline: TimelineEntry[];
  court: CourtInfo | null;
  settlementOffers: SettlementOffer[];
  createdOnDay: number;
  dueDay: number;
  invoicedAmount: number;
  paidAmount: number;
  retainerPaid: boolean;
  hoursLogged: number;
  outcome: 'gewonnen' | 'verloren' | 'vergleich' | null;
  actionsUsedToday: number;
  lastActionDay: number;
}

export type CalendarEntryType =
  | 'termin'
  | 'telefonat'
  | 'frist'
  | 'gericht'
  | 'intern';

export interface CalendarEntry {
  id: string;
  day: number;
  type: CalendarEntryType;
  title: string;
  caseId: string | null;
  done: boolean;
}

export type GameEventKind = 'info' | 'positive' | 'negative' | 'decision' | 'money' | 'court';

export interface GameEvent {
  id: string;
  day: number;
  dateLabel: string;
  icon: string;
  text: string;
  kind: GameEventKind;
  caseId: string | null;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedOnDay: number | null;
}

export interface FirmLevelDef {
  level: number;
  name: string;
  officeName: string;
  maxEmployees: number;
  maxActiveCases: number;
  reputationBonus: number;
  monthlyRent: number;
  prestige: number;
  upgradeCost: number;
}

export interface RandomEventChoice {
  label: string;
  moneyDelta?: number;
  reputationDelta?: number;
  resultText: string;
}

export interface PendingRandomEvent {
  id: string;
  title: string;
  description: string;
  choices: RandomEventChoice[];
}

export interface RateSettings {
  beratung: number;
  junior: number;
  senior: number;
  partner: number;
}

export interface MonthlySummary {
  monthLabel: string;
  income: number;
  expenses: number;
  profit: number;
  rent: number;
  salaries: number;
  fixedCosts: number;
  fees: number;
}

export interface FinanceTransaction {
  id: string;
  day: number;
  dateLabel: string;
  label: string;
  amount: number; // positiv = Einnahme, negativ = Ausgabe
  category: string;
}

export interface Character {
  name: string;
  profession: string;
  firmName: string;
  location: string;
  createdOnDay: number;
}

export interface GameStats {
  casesWon: number;
  casesLost: number;
  casesSettled: number;
  casesTotal: number;
  totalRevenue: number;
  trialsPlayed: number;
}

export interface GameState {
  character: Character;
  day: number; // Tage seit Spielstart (0 = Startdatum)
  money: number;
  reputation: number;
  firmLevel: number;
  employees: Employee[];
  clients: Client[];
  cases: Case[];
  calendar: CalendarEntry[];
  events: GameEvent[];
  achievements: Achievement[];
  rates: RateSettings;
  financeHistory: MonthlySummary[];
  transactions: FinanceTransaction[];
  stats: GameStats;
  pendingRandomEvent: PendingRandomEvent | null;
  lastSavedAt: string | null;
}

export const START_DATE = new Date(Date.UTC(2026, 8, 1)); // 1. September 2026
