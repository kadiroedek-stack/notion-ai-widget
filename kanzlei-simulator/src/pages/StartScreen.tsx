import { useState } from 'react';
import { Scale, Building2, MapPin, Wallet, Star, Users } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Button, Card } from '../components/common/ui';

export function StartScreen() {
  const startNewGame = useGameStore((s) => s.startNewGame);
  const [name, setName] = useState('');
  const [firmName, setFirmName] = useState('');

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 p-4 py-10">
      <Card className="w-full max-w-lg p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-400">
            <Scale size={28} />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink-100">Kanzlei Simulator Wien</h1>
          <p className="mt-1 text-sm text-ink-400">Baue deine eigene Anwaltskanzlei auf.</p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !firmName.trim()) return;
            startNewGame(name.trim(), firmName.trim());
          }}
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-400">Dein Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z. B. Kadir Öztürk"
              maxLength={40}
              className="w-full rounded-lg border border-navy-600 bg-navy-900 px-3.5 py-2.5 text-sm text-ink-100 outline-none placeholder:text-ink-500 focus:border-gold-500"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-400">Beruf</label>
            <input value="Rechtsanwalt / Rechtsanwältin" disabled className="w-full rounded-lg border border-navy-700 bg-navy-800 px-3.5 py-2.5 text-sm text-ink-400" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-400">Kanzleiname</label>
            <input
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              placeholder="z. B. Kanzlei Kadir"
              maxLength={40}
              className="w-full rounded-lg border border-navy-600 bg-navy-900 px-3.5 py-2.5 text-sm text-ink-100 outline-none placeholder:text-ink-500 focus:border-gold-500"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-400">Standort</label>
            <div className="flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-800 px-3.5 py-2.5 text-sm text-ink-300">
              <MapPin size={14} className="text-gold-400" /> Wien
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-xl border border-navy-700 bg-navy-900/60 p-3 text-center text-xs text-ink-400">
            <div className="flex flex-col items-center gap-1">
              <Wallet size={16} className="text-gold-400" />
              €10.000
              <span className="text-ink-500">Startkapital</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Star size={16} className="text-gold-400" />
              10/100
              <span className="text-ink-500">Reputation</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Users size={16} className="text-gold-400" />
              1
              <span className="text-ink-500">Mitarbeiter</span>
            </div>
          </div>

          <Button type="submit" variant="gold" className="w-full py-2.5">
            <Building2 size={16} /> Kanzlei eröffnen
          </Button>
        </form>
      </Card>
    </div>
  );
}
