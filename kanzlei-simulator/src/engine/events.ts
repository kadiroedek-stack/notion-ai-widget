import type { GameEventKind, GameState } from '../types';
import { generateId, formatDate } from './util';

const MAX_EVENTS = 150;

export function pushEvent(
  state: GameState,
  text: string,
  icon: string,
  kind: GameEventKind = 'info',
  caseId: string | null = null,
) {
  state.events.unshift({
    id: generateId('evt'),
    day: state.day,
    dateLabel: formatDate(state.day),
    icon,
    text,
    kind,
    caseId,
  });
  if (state.events.length > MAX_EVENTS) {
    state.events.length = MAX_EVENTS;
  }
}

export function pushTimeline(caseTimeline: { id: string; day: number; dateLabel: string; text: string }[], day: number, text: string) {
  caseTimeline.push({ id: generateId('tl'), day, dateLabel: formatDate(day), text });
}
