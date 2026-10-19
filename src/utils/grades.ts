// Қазақстанның кредиттік оқыту жүйесіндегі бағалау (Platonus-тағыдай):
// жіберілу рейтингі = (РК1 + РК2) / 2, қорытынды = рейтинг × 0.6 + емтихан × 0.4

export type Letter =
  | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'F';

// [ең төменгі балл, әріп, GPA ұпайы]
const SCALE: [number, Letter, number][] = [
  [95, 'A', 4.0],
  [90, 'A-', 3.67],
  [85, 'B+', 3.33],
  [80, 'B', 3.0],
  [75, 'B-', 2.67],
  [70, 'C+', 2.33],
  [65, 'C', 2.0],
  [60, 'C-', 1.67],
  [55, 'D+', 1.33],
  [50, 'D', 1.0],
  [0, 'F', 0],
];

// Емтиханға жіберілу үшін рейтинг кемінде 50 болуы керек
export const ADMISSION_MIN = 50;

export function admissionRating(rk1: number | null, rk2: number | null): number | null {
  if (rk1 === null) return null;
  // РК2 әлі қойылмаса, рейтинг РК1 бойынша көрсетіледі
  return Math.round(rk2 === null ? rk1 : (rk1 + rk2) / 2);
}

export function finalScore(rk1: number | null, rk2: number | null, exam: number | null): number | null {
  const rating = admissionRating(rk1, rk2);
  if (rating === null || rk2 === null || exam === null) return null;
  return Math.round(rating * 0.6 + exam * 0.4);
}

export function letterFor(score: number): { letter: Letter; points: number } {
  const [, letter, points] = SCALE.find(([min]) => score >= min)!;
  return { letter, points };
}

// Кредитке салмақталған GPA; бағасы әлі жоқ пәндер есептелмейді
export function weightedGpa(items: { score: number | null; credits: number }[]): number | null {
  const done = items.filter((i) => i.score !== null);
  const credits = done.reduce((sum, i) => sum + i.credits, 0);
  if (!credits) return null;
  const total = done.reduce((sum, i) => sum + letterFor(i.score!).points * i.credits, 0);
  return Math.round((total / credits) * 100) / 100;
}
