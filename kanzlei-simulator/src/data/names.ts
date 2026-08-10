export const FIRST_NAMES_M = [
  'Ahmet', 'Markus', 'Florian', 'Stefan', 'Michael', 'Thomas', 'Andreas', 'Christian',
  'Bernhard', 'Alexander', 'Daniel', 'Georg', 'Klaus', 'Wolfgang', 'Peter', 'Martin',
  'Emre', 'Lukas', 'Philipp', 'Sebastian', 'Hakan', 'Milan', 'Josef', 'Karl',
];

export const FIRST_NAMES_F = [
  'Anna', 'Julia', 'Sabine', 'Petra', 'Claudia', 'Sophie', 'Elif', 'Christine',
  'Barbara', 'Nicole', 'Susanne', 'Marie', 'Katharina', 'Verena', 'Lena', 'Eva',
  'Fatma', 'Ivana', 'Doris', 'Andrea', 'Michaela', 'Sandra', 'Birgit', 'Melanie',
];

export const LAST_NAMES = [
  'Gruber', 'Huber', 'Bauer', 'Wagner', 'Müller', 'Pichler', 'Steiner', 'Moser',
  'Berger', 'Fuchs', 'Mayer', 'Hofer', 'Leitner', 'Winkler', 'Schwarz', 'Reiter',
  'Yilmaz', 'Demir', 'Novak', 'Horvath', 'Weber', 'Maier', 'Wolf', 'Eder',
  'Aydin', 'Kovac', 'Schneider', 'Lehner', 'Brunner', 'Wimmer', 'Auer', 'Baumgartner',
];

export const PROFESSIONS = [
  'Unternehmer', 'Angestellte', 'Angestellter', 'Geschäftsführer', 'Geschäftsführerin',
  'Ärztin', 'Arzt', 'Handwerker', 'Immobilienmaklerin', 'Immobilienmakler',
  'Gastronom', 'Gastronomin', 'Selbstständige', 'Selbstständiger', 'Pensionist',
  'Pensionistin', 'IT-Berater', 'IT-Beraterin', 'Studentin', 'Student', 'Bauleiter',
  'Steuerberaterin', 'Vertriebsleiter', 'Start-up-Gründerin', 'Fabrikbesitzer',
];

export function randomFullName(rng: () => number): { name: string; female: boolean } {
  const female = rng() < 0.5;
  const first = pickFrom(female ? FIRST_NAMES_F : FIRST_NAMES_M, rng);
  const last = pickFrom(LAST_NAMES, rng);
  return { name: `${first} ${last}`, female };
}

export function pickFrom<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}
