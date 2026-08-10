import {
  LayoutDashboard, Briefcase, Users, CalendarDays, Gavel, Building2,
  UserCog, Wallet, Star, Trophy, Settings,
} from 'lucide-react';

export type PageId =
  | 'dashboard' | 'cases' | 'clients' | 'calendar' | 'court'
  | 'firm' | 'employees' | 'finance' | 'reputation' | 'achievements' | 'settings';

export interface NavItem {
  id: PageId;
  label: string;
  icon: typeof LayoutDashboard;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'cases', label: 'Fälle', icon: Briefcase },
  { id: 'clients', label: 'Mandanten', icon: Users },
  { id: 'calendar', label: 'Kalender', icon: CalendarDays },
  { id: 'court', label: 'Gericht', icon: Gavel },
  { id: 'firm', label: 'Kanzlei', icon: Building2 },
  { id: 'employees', label: 'Mitarbeiter', icon: UserCog },
  { id: 'finance', label: 'Finanzen', icon: Wallet },
  { id: 'reputation', label: 'Reputation', icon: Star },
  { id: 'achievements', label: 'Erfolge', icon: Trophy },
  { id: 'settings', label: 'Einstellungen', icon: Settings },
];

export const MOBILE_NAV_ITEMS: PageId[] = ['dashboard', 'cases', 'clients', 'calendar', 'court'];
