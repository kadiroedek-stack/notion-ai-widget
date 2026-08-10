import { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { StartScreen } from './pages/StartScreen';
import { Dashboard } from './pages/Dashboard';
import { Cases } from './pages/Cases';
import { Clients } from './pages/Clients';
import { CalendarPage } from './pages/Calendar';
import { Court } from './pages/Court';
import { Firm } from './pages/Firm';
import { Employees } from './pages/Employees';
import { Finance } from './pages/Finance';
import { Reputation } from './pages/Reputation';
import { Achievements } from './pages/Achievements';
import { Settings } from './pages/Settings';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { MobileBottomNav, MobileMoreSheet } from './components/layout/MobileNav';
import { RandomEventModal } from './components/RandomEventModal';
import type { PageId } from './nav';

function App() {
  const game = useGameStore((s) => s.game);
  const [page, setPage] = useState<PageId>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  if (!game) {
    return <StartScreen />;
  }

  function navigate(target: PageId, caseId?: string) {
    setPage(target);
    setSelectedCaseId(caseId ?? null);
  }

  return (
    <div className="flex min-h-screen bg-navy-950">
      <Sidebar active={page} onNavigate={(p) => navigate(p)} />

      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar />
        <main className="flex-1 px-4 py-5 pb-24 lg:px-8 lg:py-6 lg:pb-6">
          {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
          {page === 'cases' && <Cases selectedCaseId={selectedCaseId} onSelectCase={(id) => setSelectedCaseId(id)} />}
          {page === 'clients' && <Clients onNavigate={navigate} />}
          {page === 'calendar' && <CalendarPage onNavigate={navigate} />}
          {page === 'court' && <Court onNavigate={navigate} />}
          {page === 'firm' && <Firm />}
          {page === 'employees' && <Employees />}
          {page === 'finance' && <Finance />}
          {page === 'reputation' && <Reputation />}
          {page === 'achievements' && <Achievements />}
          {page === 'settings' && <Settings />}
        </main>
      </div>

      <MobileBottomNav active={page} onNavigate={(p) => navigate(p)} onMore={() => setShowMore(true)} />
      {showMore && <MobileMoreSheet active={page} onNavigate={(p) => navigate(p)} onClose={() => setShowMore(false)} />}

      <RandomEventModal />
    </div>
  );
}

export default App;
