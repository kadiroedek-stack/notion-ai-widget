# Kanzlei Simulator Wien

Eine browserbasierte Lawyer/Courtroom-Management-Simulation. Baue als junge:r
Rechtsanwält:in in Wien deine eigene Kanzlei auf, gewinne Mandanten, führe
Gerichtsverfahren und wachse von der Einzelkanzlei zur Top-Kanzlei Wiens.

Vollständig client-seitig (React + TypeScript + Vite + Tailwind CSS), keine
Anmeldung, kein Backend. Der Spielstand wird automatisch im LocalStorage des
Browsers gespeichert.

## Starten

```bash
npm install
npm run dev
```

## Features (MVP)

- Charaktererstellung & Kanzleigründung
- Spielzeit (1 Tag / 1 Woche vorspulen) mit automatischer Ereignisverarbeitung
- Geldsystem: Honorare, Vorschüsse, Gehälter, Miete, Fixkosten, Gerichtskosten
- Zufällig generierte Mandanten & Fallanfragen aus mehreren Quellen
- Fälle mit Aktennummer, Falltyp, Schwierigkeit, Streitwert, Erfolgschance
- Falldetailseite mit Tabs (Übersicht, Mandant, Dokumente, Fristen, Gericht,
  Strategie, Finanzen, Timeline) und echten Aktionen (Recherche, Schriftsatz,
  Klage einbringen, Vergleich anbieten, Rechnung stellen, …)
- Interaktive Gerichtsverhandlungen mit mehreren Runden und echten
  Entscheidungen (Argumente, Beweise, Zeugen, Vergleichsvorschlag)
- Reputationssystem, das Mandantenqualität beeinflusst
- Zufallsereignisse mit echten Entscheidungsoptionen
- Kalender für Termine, Fristen und Gerichtstermine
- Kanzlei-Upgrades (5 Stufen), Mitarbeiter-Einstellung mit Stats-System
- Achievements und Fortschritts-Tracking
- Speichern/Laden/Zurücksetzen über LocalStorage
