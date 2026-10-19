import { IconName, LocalizedText } from './service';

export type LessonType = 'lecture' | 'practice' | 'lab';

// Апталық журнал жазбасы (Platonus-тағы ағымдағы үлгерім): балл 0–100 немесе "н" (қатыспады)
export type WeeklyMark = {
  week: number;
  type: LessonType;
  mark: number | null;
  absent?: boolean;
};

export type Subject = {
  id: string;
  title: LocalizedText;
  teacher: string;
  credits: number;
  icon: IconName;
  color: string;
  // Аралық бақылаулар мен емтихан: әлі қойылмаса null
  rk1: number | null;
  rk2: number | null;
  exam: number | null;
  marks: WeeklyMark[];
};

// 1 = дүйсенбі … 6 = сенбі (Date.getDay() сияқты)
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6;

export type ScheduleLesson = {
  id: string;
  day: Weekday;
  start: string;
  end: string;
  subjectId: string;
  type: LessonType;
  room: string;
};

export type TranscriptTerm = {
  term: number;
  year: string;
  subjects: { title: LocalizedText; credits: number; score: number }[];
};
