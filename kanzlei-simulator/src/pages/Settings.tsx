import { useState } from 'react';
import { RotateCcw, FilePlus, FolderOpen, Save, Info } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Card, SectionTitle, Button, Modal } from '../components/common/ui';

export function Settings() {
  const game = useGameStore((s) => s.game)!;
  const resetGame = useGameStore((s) => s.resetGame);
  const [confirmAction, setConfirmAction] = useState<'reset' | 'new' | null>(null);
  const [loadMessage, setLoadMessage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <SectionTitle>Einstellungen</SectionTitle>

      <Card className="p-4">
        <p className="mb-1 text-sm font-medium text-ink-200">Spielstand</p>
        <p className="mb-4 text-xs text-ink-500">
          Der Spielstand wird automatisch im Browser (LocalStorage) gespeichert – nach jeder Aktion.
          {game.lastSavedAt && ` Zuletzt gespeichert: ${new Date(game.lastSavedAt).toLocaleTimeString('de-AT')} Uhr.`}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              useGameStore.persist.rehydrate();
              setLoadMessage('Spielstand aus dem Speicher geladen.');
            }}
          >
            <FolderOpen size={15} /> Spiel laden
          </Button>
          <Button variant="secondary" onClick={() => setConfirmAction('new')}>
            <FilePlus size={15} /> Neues Spiel
          </Button>
          <Button variant="danger" onClick={() => setConfirmAction('reset')}>
            <RotateCcw size={15} /> Spiel zurücksetzen
          </Button>
        </div>
        {loadMessage && <p className="mt-3 text-xs text-emerald-400">{loadMessage}</p>}
      </Card>

      <Card className="p-4">
        <p className="mb-2 flex items-center gap-2 text-sm font-medium text-ink-200"><Info size={15} /> Charakter</p>
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div><p className="text-xs text-ink-500">Name</p><p className="text-ink-200">{game.character.name}</p></div>
          <div><p className="text-xs text-ink-500">Kanzlei</p><p className="text-ink-200">{game.character.firmName}</p></div>
          <div><p className="text-xs text-ink-500">Standort</p><p className="text-ink-200">{game.character.location}</p></div>
          <div><p className="text-xs text-ink-500">Beruf</p><p className="text-ink-200">{game.character.profession}</p></div>
        </div>
      </Card>

      <Card className="p-4 text-xs text-ink-500">
        <p>Kanzlei Simulator Wien · Version 1.0 · Alle Daten verbleiben lokal in deinem Browser, es gibt kein Backend und keine Anmeldung.</p>
      </Card>

      {confirmAction && (
        <Modal
          title={confirmAction === 'reset' ? 'Spiel wirklich zurücksetzen?' : 'Neues Spiel starten?'}
          onClose={() => setConfirmAction(null)}
        >
          <p className="mb-5 text-sm text-ink-300">
            {confirmAction === 'reset'
              ? 'Dadurch werden alle Fortschritte unwiderruflich gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.'
              : 'Der aktuelle Spielstand wird gelöscht und du beginnst mit einem neuen Charakter. Diese Aktion kann nicht rückgängig gemacht werden.'}
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmAction(null)}>Abbrechen</Button>
            <Button
              variant="danger"
              onClick={() => { resetGame(); setConfirmAction(null); }}
            >
              <Save size={14} /> Ja, fortfahren
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
