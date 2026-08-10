import { useState } from 'react';
import { UserCog, Plus, Users } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Card, SectionTitle, Badge, Button, ProgressBar, Modal, EmptyState } from '../components/common/ui';
import { EMPLOYEE_TEMPLATES } from '../data/employeeTemplates';
import { firmLevelDef } from '../data/firmLevels';
import { formatMoney } from '../engine/util';
import type { Employee, EmployeeStats } from '../types';

const STAT_LABELS: Record<keyof EmployeeStats, string> = {
  experience: 'Erfahrung',
  speed: 'Geschwindigkeit',
  accuracy: 'Genauigkeit',
  negotiation: 'Verhandeln',
  research: 'Recherche',
  stressResistance: 'Stressresistenz',
};

export function Employees() {
  const game = useGameStore((s) => s.game)!;
  const hireEmployee = useGameStore((s) => s.hireEmployee);
  const fireEmployee = useGameStore((s) => s.fireEmployee);
  const [showHire, setShowHire] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const level = firmLevelDef(game.firmLevel);

  return (
    <div className="space-y-6">
      <SectionTitle action={<Button variant="gold" onClick={() => setShowHire(true)}><Plus size={15} /> Einstellen</Button>}>
        Mitarbeiter ({game.employees.length}/{level.maxEmployees})
      </SectionTitle>

      {message && <div className="rounded-lg border border-gold-600/40 bg-gold-500/10 px-3.5 py-2.5 text-sm text-gold-300">{message}</div>}

      {game.employees.length === 0 ? (
        <EmptyState icon={<Users size={28} />} title="Keine Mitarbeiter" description="Stelle Mitarbeiter ein, um mehr Fälle gleichzeitig bearbeiten zu können." />
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {game.employees.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} cases={game.cases} onFire={() => fireEmployee(emp.id)} />
          ))}
        </div>
      )}

      {showHire && (
        <Modal title="Mitarbeiter einstellen" onClose={() => setShowHire(false)} wide>
          <div className="space-y-3">
            {EMPLOYEE_TEMPLATES.map((t) => {
              const locked = game.firmLevel < t.minLevel;
              const full = game.employees.length >= level.maxEmployees;
              return (
                <div key={t.role} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-navy-600 bg-navy-900/50 p-3.5">
                  <div>
                    <p className="text-sm font-medium text-ink-100">{t.label}</p>
                    <p className="text-xs text-ink-400">{t.description}</p>
                    <p className="mt-1 text-xs text-ink-500">Gehalt: {formatMoney(t.salary)}/Monat {locked ? `· ab Kanzleistufe ${t.minLevel}` : ''}</p>
                  </div>
                  <Button
                    variant="secondary"
                    disabled={locked || full}
                    onClick={() => {
                      const result = hireEmployee(t.role);
                      setMessage(result.message);
                      if (result.ok) setShowHire(false);
                    }}
                  >
                    Einstellen
                  </Button>
                </div>
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
}

function EmployeeCard({ employee, cases, onFire }: { employee: Employee; cases: import('../types').Case[]; onFire: () => void }) {
  const assignedCases = cases.filter((c) => employee.assignedCaseIds.includes(c.id));
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-700 text-ink-300"><UserCog size={18} /></div>
          <div>
            <p className="font-medium text-ink-100">{employee.name}</p>
            <p className="text-xs text-ink-400">{roleLabel(employee.role)} · {employee.salary > 0 ? `${formatMoney(employee.salary)}/Monat` : 'Kanzleiinhaber:in'}</p>
          </div>
        </div>
        {employee.salary > 0 && <Button variant="danger" onClick={onFire}>Entlassen</Button>}
      </div>

      <div className="mt-3">
        <div className="mb-1 flex justify-between text-xs text-ink-400"><span>Moral</span><span>{employee.morale}%</span></div>
        <ProgressBar value={employee.morale} tone={employee.morale >= 50 ? 'good' : 'bad'} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {(Object.keys(STAT_LABELS) as (keyof EmployeeStats)[]).map((key) => (
          <div key={key} className="text-xs">
            <div className="mb-0.5 flex justify-between text-ink-500"><span>{STAT_LABELS[key]}</span><span>{employee.stats[key]}</span></div>
            <ProgressBar value={employee.stats[key]} tone="info" />
          </div>
        ))}
      </div>

      {assignedCases.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {assignedCases.map((c) => <Badge key={c.id}>{c.title}</Badge>)}
        </div>
      )}
    </Card>
  );
}

function roleLabel(role: Employee['role']): string {
  switch (role) {
    case 'assistent': return 'Rechtsanwaltsassistent';
    case 'jurist': return 'Juristischer Mitarbeiter';
    case 'junior': return 'Junior Associate';
    case 'senior': return 'Senior Associate';
    case 'partner': return 'Partner';
  }
}
