import { useState } from 'react';
import { Gavel, PenLine } from 'lucide-react';
import { Modal, Button, Badge } from '../common/ui';
import { TRIAL_ROUNDS } from '../../data/trial';
import { useGameStore } from '../../store/gameStore';
import { formatMoney } from '../../engine/util';
import { evaluateArgumentText, MIN_ARGUMENT_WORDS, type ArgumentQuality } from '../../engine/argument';
import type { TrialResult } from '../../engine/court';

interface LogEntry {
  judgeLine: string;
  choiceLabel: string;
  responseText: string;
  good: boolean;
}

const QUALITY_LABEL: Record<ArgumentQuality, string> = {
  schwach: 'Noch dünn – ergänze Belege, Paragraphen oder Zeugen.',
  solide: 'Solide Argumentation.',
  stark: 'Starke, gut begründete Argumentation!',
};

const QUALITY_TONE: Record<ArgumentQuality, 'bad' | 'info' | 'good'> = {
  schwach: 'bad',
  solide: 'info',
  stark: 'good',
};

export function CourtTrialModal({ caseId, onClose }: { caseId: string; onClose: () => void }) {
  const c = useGameStore((s) => s.game?.cases.find((x) => x.id === caseId));
  const resolveTrial = useGameStore((s) => s.resolveTrial);

  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [settlementProposed, setSettlementProposed] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<TrialResult | null>(null);
  const [writingCustom, setWritingCustom] = useState(false);
  const [customText, setCustomText] = useState('');

  if (!c || !c.court) return null;

  const round = TRIAL_ROUNDS[roundIndex];
  const isLastRound = roundIndex === TRIAL_ROUNDS.length - 1;

  function applyResult(scoreDelta: number, riskyDelta: number, choiceLabel: string, responseGood: string, responseBad: string, isSettlementOffer: boolean) {
    const successProb = scoreDelta / (scoreDelta + riskyDelta);
    const good = Math.random() < successProb;
    const delta = good ? scoreDelta : -Math.round(riskyDelta / 2);
    const newScore = score + delta;
    setScore(newScore);
    if (isSettlementOffer) setSettlementProposed(true);

    setLog((prev) => [...prev, {
      judgeLine: round.judgeLine,
      choiceLabel,
      responseText: good ? responseGood : responseBad,
      good,
    }]);

    setWritingCustom(false);
    setCustomText('');

    if (isLastRound) {
      const finalResult = resolveTrial(caseId, newScore, settlementProposed || isSettlementOffer);
      setResult(finalResult);
    } else {
      setRoundIndex((r) => r + 1);
    }
  }

  function choose(optionId: string) {
    const option = round.options.find((o) => o.id === optionId)!;
    applyResult(option.scoreDelta, option.riskyDelta, option.label, option.responseGood, option.responseBad, option.id === 'settlement_offer');
  }

  function submitCustomArgument() {
    const evaluation = evaluateArgumentText(customText);
    if (evaluation.wordCount < MIN_ARGUMENT_WORDS) return;
    applyResult(
      evaluation.scoreDelta,
      evaluation.riskyDelta,
      `Eigene Argumentation: „${customText.trim()}"`,
      'Deine eigene Argumentation überzeugt das Gericht.',
      'Deine eigene Argumentation kann das Gericht nicht vollständig überzeugen.',
      false,
    );
  }

  const liveEvaluation = customText.trim() ? evaluateArgumentText(customText) : null;

  return (
    <Modal title={`Gerichtsverhandlung – ${c.court.court}`} onClose={result ? onClose : () => {}} wide hideClose={!result}>
      {!result ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-navy-600 bg-navy-900/50 p-4">
            <p className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-500">
              <Gavel size={13} /> Richter:in
            </p>
            <p className="text-sm text-ink-100">„{round.judgeLine}"</p>
          </div>

          {!writingCustom ? (
            <>
              <div className="space-y-2">
                {round.options.map((opt) => (
                  <Button key={opt.id} variant="secondary" className="w-full justify-start" onClick={() => choose(opt.id)}>
                    <Gavel size={15} /> {opt.label}
                  </Button>
                ))}
              </div>
              <Button variant="gold" className="w-full" onClick={() => setWritingCustom(true)}>
                <PenLine size={15} /> Selbst argumentieren
              </Button>
            </>
          ) : (
            <div className="space-y-2.5 rounded-lg border border-gold-600/40 bg-navy-900/50 p-3.5">
              <p className="text-xs font-medium text-gold-400">Formuliere deine eigene Argumentation:</p>
              <textarea
                autoFocus
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="z. B. „Der Sachverhalt ist durch das vorliegende Gutachten eindeutig belegt. Zudem bestätigt die Zeugenaussage, dass …“"
                rows={4}
                className="w-full resize-none rounded-lg border border-navy-600 bg-navy-900 px-3 py-2.5 text-sm text-ink-100 outline-none placeholder:text-ink-500 focus:border-gold-500"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-ink-500">Konkrete Argumente mit Beweisen, Paragraphen oder Zeugen überzeugen eher.</p>
                {liveEvaluation && (
                  <Badge tone={QUALITY_TONE[liveEvaluation.quality]}>{liveEvaluation.quality}</Badge>
                )}
              </div>
              {liveEvaluation && (
                <p className="text-xs text-ink-500">{QUALITY_LABEL[liveEvaluation.quality]}</p>
              )}
              <div className="flex gap-2">
                <Button
                  variant="gold"
                  className="flex-1"
                  disabled={!liveEvaluation || liveEvaluation.wordCount < MIN_ARGUMENT_WORDS}
                  onClick={submitCustomArgument}
                >
                  Vor Gericht vortragen
                </Button>
                <Button variant="ghost" onClick={() => { setWritingCustom(false); setCustomText(''); }}>Abbrechen</Button>
              </div>
            </div>
          )}

          {log.length > 0 && (
            <div className="space-y-2 border-t border-navy-700 pt-3">
              {log.map((entry, i) => (
                <div key={i} className="text-xs">
                  <p className="text-ink-500">Gewählt: {entry.choiceLabel}</p>
                  <p className={entry.good ? 'text-emerald-400' : 'text-red-400'}>{entry.responseText}</p>
                </div>
              ))}
            </div>
          )}

          <p className="text-center text-xs text-ink-500">Runde {roundIndex + 1} von {TRIAL_ROUNDS.length}</p>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl ${
              result.outcome === 'gewonnen' ? 'bg-emerald-500/15 text-emerald-400'
                : result.outcome === 'verloren' ? 'bg-red-500/15 text-red-400'
                  : 'bg-gold-500/15 text-gold-400'
            }`}
          >
            {result.outcome === 'gewonnen' ? '🏆' : result.outcome === 'verloren' ? '❌' : '🤝'}
          </div>
          <h3 className="font-display text-xl font-bold text-ink-100">
            {result.outcome === 'gewonnen' ? 'GEWONNEN' : result.outcome === 'verloren' ? 'VERLOREN' : 'VERGLEICH'}
          </h3>
          <p className="text-sm text-ink-400">
            Erfolgswahrscheinlichkeit war {result.successProbability}%.
            {result.outcome === 'vergleich' && ` Vergleichssumme: ${formatMoney(result.settlementAmount)}.`}
          </p>
          <Badge tone={result.outcome === 'gewonnen' ? 'good' : result.outcome === 'verloren' ? 'bad' : 'gold'}>
            Fall abgeschlossen
          </Badge>
          <Button variant="gold" className="w-full" onClick={onClose}>Schließen</Button>
        </div>
      )}
    </Modal>
  );
}
