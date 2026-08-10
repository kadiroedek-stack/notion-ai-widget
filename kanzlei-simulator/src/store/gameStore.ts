import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import type { GameState, EmployeeRole, RateSettings } from '../types';
import { createNewGame } from '../engine/newGame';
import { advanceOneDay, advanceOneWeek, resolveRandomEvent } from '../engine/time';
import { takeCase, rejectCase, performCaseAction, respondToSettlement, generateInvoice, type CaseActionId } from '../engine/cases';
import { hireEmployee, fireEmployee, assignEmployeeToCase, unassignEmployeeFromCase } from '../engine/employees';
import { upgradeFirm } from '../engine/firm';
import { resolveTrial, type TrialResult } from '../engine/court';

type ActionResult = { ok: boolean; message: string };

interface GameStore {
  game: GameState | null;
  startNewGame: (name: string, firmName: string) => void;
  resetGame: () => void;
  advanceDay: () => void;
  advanceWeek: () => void;
  takeCase: (caseId: string) => void;
  rejectCase: (caseId: string) => void;
  performAction: (caseId: string, action: CaseActionId) => ActionResult;
  createInvoice: (caseId: string) => ActionResult;
  respondSettlement: (caseId: string, offerId: string, decision: 'annehmen' | 'ablehnen' | 'gegenangebot', counterAmount?: number) => void;
  hireEmployee: (role: EmployeeRole) => ActionResult;
  fireEmployee: (employeeId: string) => void;
  assignEmployee: (caseId: string, employeeId: string) => void;
  unassignEmployee: (caseId: string, employeeId: string) => void;
  upgradeFirm: () => ActionResult;
  updateRates: (rates: RateSettings) => void;
  resolveTrial: (caseId: string, trialScore: number, settlementProposed: boolean) => TrialResult | null;
  resolveRandomEvent: (choiceIndex: number) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      game: null,

      startNewGame: (name, firmName) => {
        set({ game: createNewGame(name, firmName) });
      },

      resetGame: () => set({ game: null }),

      advanceDay: () => set(produce<GameStore>((s) => {
        if (!s.game) return;
        advanceOneDay(s.game);
        s.game.lastSavedAt = new Date().toISOString();
      })),

      advanceWeek: () => set(produce<GameStore>((s) => {
        if (!s.game) return;
        advanceOneWeek(s.game);
        s.game.lastSavedAt = new Date().toISOString();
      })),

      takeCase: (caseId) => set(produce<GameStore>((s) => {
        if (!s.game) return;
        takeCase(s.game, caseId);
      })),

      rejectCase: (caseId) => set(produce<GameStore>((s) => {
        if (!s.game) return;
        rejectCase(s.game, caseId);
      })),

      performAction: (caseId, action) => {
        let result: ActionResult = { ok: false, message: 'Kein aktives Spiel.' };
        set(produce<GameStore>((s) => {
          if (!s.game) return;
          result = performCaseAction(s.game, caseId, action);
        }));
        return result;
      },

      createInvoice: (caseId) => {
        let result: ActionResult = { ok: false, message: 'Kein aktives Spiel.' };
        set(produce<GameStore>((s) => {
          if (!s.game) return;
          const c = s.game.cases.find((x) => x.id === caseId);
          if (!c) return;
          result = generateInvoice(s.game, c);
        }));
        return result;
      },

      respondSettlement: (caseId, offerId, decision, counterAmount) => set(produce<GameStore>((s) => {
        if (!s.game) return;
        respondToSettlement(s.game, caseId, offerId, decision, counterAmount);
      })),

      hireEmployee: (role) => {
        let result: ActionResult = { ok: false, message: 'Kein aktives Spiel.' };
        set(produce<GameStore>((s) => {
          if (!s.game) return;
          result = hireEmployee(s.game, role);
        }));
        return result;
      },

      fireEmployee: (employeeId) => set(produce<GameStore>((s) => {
        if (!s.game) return;
        fireEmployee(s.game, employeeId);
      })),

      assignEmployee: (caseId, employeeId) => set(produce<GameStore>((s) => {
        if (!s.game) return;
        assignEmployeeToCase(s.game, caseId, employeeId);
      })),

      unassignEmployee: (caseId, employeeId) => set(produce<GameStore>((s) => {
        if (!s.game) return;
        unassignEmployeeFromCase(s.game, caseId, employeeId);
      })),

      upgradeFirm: () => {
        let result: ActionResult = { ok: false, message: 'Kein aktives Spiel.' };
        set(produce<GameStore>((s) => {
          if (!s.game) return;
          result = upgradeFirm(s.game);
        }));
        return result;
      },

      updateRates: (rates) => set(produce<GameStore>((s) => {
        if (!s.game) return;
        s.game.rates = rates;
      })),

      resolveTrial: (caseId, trialScore, settlementProposed) => {
        let result: TrialResult | null = null;
        set(produce<GameStore>((s) => {
          if (!s.game) return;
          result = resolveTrial(s.game, caseId, trialScore, settlementProposed);
        }));
        return result;
      },

      resolveRandomEvent: (choiceIndex) => set(produce<GameStore>((s) => {
        if (!s.game) return;
        resolveRandomEvent(s.game, choiceIndex);
      })),
    }),
    {
      name: 'kanzlei-simulator-save',
      version: 1,
      partialize: (state) => ({ game: state.game }),
    },
  ),
);
