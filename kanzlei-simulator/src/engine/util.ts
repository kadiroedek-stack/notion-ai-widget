import { START_DATE } from '../types';

let idCounter = 0;

export function generateId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${idCounter.toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export function rng(): number {
  return Math.random();
}

export function randomInt(min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number): number {
  return rng() * (max - min) + min;
}

export function chance(probability: number): boolean {
  return rng() < probability;
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

export function dateForDay(day: number): Date {
  const d = new Date(START_DATE);
  d.setUTCDate(d.getUTCDate() + day);
  return d;
}

const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

export function formatDate(day: number): string {
  const d = dateForDay(day);
  return `${String(d.getUTCDate()).padStart(2, '0')}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.${d.getUTCFullYear()}`;
}

export function formatDateLong(day: number): string {
  const d = dateForDay(day);
  return `${WEEKDAYS[d.getUTCDay()]}, ${d.getUTCDate()}. ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function monthLabel(day: number): string {
  const d = dateForDay(day);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function isFirstOfMonth(day: number): boolean {
  return dateForDay(day).getUTCDate() === 1;
}

export function dayIndexForDate(date: Date): number {
  return Math.round((date.getTime() - START_DATE.getTime()) / 86400000);
}

export function startOfPreviousMonthDay(day: number): number {
  const d = dateForDay(day);
  const prev = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 1, 1));
  return Math.max(0, dayIndexForDate(prev));
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
}
