export interface TrialOption {
  id: string;
  label: string;
  icon: string;
  scoreDelta: number;
  riskyDelta: number; // Variationsbreite für Zufall
  responseGood: string;
  responseBad: string;
}

export interface TrialRound {
  judgeLine: string;
  options: TrialOption[];
}

export const TRIAL_ROUNDS: TrialRound[] = [
  {
    judgeLine: 'Bitte tragen Sie Ihre Argumentation vor.',
    options: [
      { id: 'argument_a', label: 'Argument A – rechtliche Grundlage betonen', icon: 'gavel', scoreDelta: 8, riskyDelta: 6, responseGood: 'Das Gericht nickt zustimmend – die rechtliche Argumentation überzeugt.', responseBad: 'Der Richter wirkt wenig beeindruckt von der Argumentation.' },
      { id: 'argument_b', label: 'Argument B – auf Präzedenzfälle verweisen', icon: 'scale', scoreDelta: 7, riskyDelta: 8, responseGood: 'Die zitierten Präzedenzfälle passen gut zum Fall.', responseBad: 'Die Vergleichsfälle werden als nicht einschlägig zurückgewiesen.' },
      { id: 'evidence', label: 'Beweis vorlegen', icon: 'file-text', scoreDelta: 10, riskyDelta: 4, responseGood: 'Die vorgelegten Beweise machen sichtlich Eindruck.', responseBad: 'Der Beweis wird als wenig aussagekräftig eingestuft.' },
    ],
  },
  {
    judgeLine: 'Die Gegenseite hat argumentiert. Wie reagieren Sie?',
    options: [
      { id: 'witness', label: 'Zeugen befragen', icon: 'users', scoreDelta: 9, riskyDelta: 7, responseGood: 'Die Zeugenaussage stützt die eigene Position deutlich.', responseBad: 'Die Zeugenaussage bringt keine neuen Erkenntnisse.' },
      { id: 'counter', label: 'Gegenargument vorbringen', icon: 'message-square', scoreDelta: 7, riskyDelta: 5, responseGood: 'Das Gegenargument entkräftet die gegnerische Position spürbar.', responseBad: 'Das Gegenargument verpufft weitgehend.' },
      { id: 'settlement_offer', label: 'Vergleich vorschlagen', icon: 'handshake', scoreDelta: 2, riskyDelta: 2, responseGood: 'Beide Seiten zeigen Interesse an einer gütlichen Einigung.', responseBad: 'Die Gegenseite lehnt einen Vergleich kategorisch ab.' },
    ],
  },
  {
    judgeLine: 'Kommen wir zum Schlussplädoyer.',
    options: [
      { id: 'closing_strong', label: 'Nachdrückliches Schlussplädoyer', icon: 'gavel', scoreDelta: 10, riskyDelta: 6, responseGood: 'Ein starkes Schlussplädoyer rundet die Verhandlung überzeugend ab.', responseBad: 'Das Plädoyer wirkt überzogen und verfehlt seine Wirkung.' },
      { id: 'closing_measured', label: 'Sachliches, zurückhaltendes Plädoyer', icon: 'scale', scoreDelta: 6, riskyDelta: 3, responseGood: 'Die sachliche Art kommt beim Gericht gut an.', responseBad: 'Das Plädoyer bleibt blass und ohne klare Linie.' },
    ],
  },
];
