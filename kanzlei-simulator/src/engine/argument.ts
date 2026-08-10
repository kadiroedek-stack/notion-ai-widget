import { clamp } from './util';

// Begriffe, die auf eine sachlich fundierte, juristisch orientierte Argumentation hindeuten.
const STRONG_KEYWORDS = [
  'beweis', 'zeuge', 'zeugin', 'vertrag', 'gesetz', 'paragraph', '§',
  'unschuld', 'fahrlässig', 'schaden', 'nachweis', 'indiz', 'alibi',
  'verjährung', 'kausal', 'haftung', 'gutachten', 'dokument', 'präzedenz',
  'sachverhalt', 'tatbestand', 'rechtslage', 'urteil', 'verordnung', 'norm',
  'klausel', 'vorsätzlich', 'plausibel', 'glaubwürdig', 'zeugenaussage',
  'gerecht', 'fair', 'angemessen', 'nachvollziehbar', 'eindeutig', 'belegt',
];

export type ArgumentQuality = 'schwach' | 'solide' | 'stark';

export interface ArgumentEvaluation {
  scoreDelta: number;
  riskyDelta: number;
  quality: ArgumentQuality;
  wordCount: number;
  keywordHits: number;
}

export function evaluateArgumentText(text: string): ArgumentEvaluation {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lower = trimmed.toLowerCase();
  const keywordHits = STRONG_KEYWORDS.filter((k) => lower.includes(k)).length;

  const lengthBonus = clamp(Math.round(wordCount / 3), 0, 6);
  const keywordBonus = clamp(keywordHits * 2, 0, 8);

  const scoreDelta = clamp(6 + lengthBonus + keywordBonus, 4, 20);
  const riskyDelta = clamp(10 - Math.round(keywordBonus * 0.6) - Math.round(lengthBonus * 0.3), 3, 10);

  const quality: ArgumentQuality = scoreDelta >= 14 ? 'stark' : scoreDelta >= 9 ? 'solide' : 'schwach';

  return { scoreDelta, riskyDelta, quality, wordCount, keywordHits };
}

export const MIN_ARGUMENT_WORDS = 3;
