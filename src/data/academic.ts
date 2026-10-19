import { LessonType, ScheduleLesson, Subject, TranscriptTerm, WeeklyMark } from '../types/academic';

// Демо деректер: 6B06118 «Программалық инженерия», 3-курс, 5-семестр (2026–2027 оқу жылы).
// Құрылымы Platonus журналындағыдай; нақты деректер көзі қосылғанда осы файл ауыстырылады
export const CURRENT_TERM = { term: 5, year: '2026–2027', week: 7, totalWeeks: 15 };

const m = (week: number, type: LessonType, mark: number): WeeklyMark => ({ week, type, mark });
const absent = (week: number, type: LessonType): WeeklyMark => ({ week, type, mark: null, absent: true });

export const subjects: Subject[] = [
  {
    id: 'mobile',
    title: {
      kk: 'Мобильді қосымшаларды әзірлеу',
      ru: 'Разработка мобильных приложений',
      en: 'Mobile App Development',
    },
    teacher: 'Блен Ж.Ж.',
    credits: 5,
    icon: 'phone-portrait',
    color: '#005DAC',
    rk1: 88,
    rk2: null,
    exam: null,
    marks: [
      m(1, 'lab', 90), m(2, 'lab', 85), m(3, 'lab', 95), m(4, 'lab', 80),
      m(5, 'lab', 92), m(6, 'lab', 88), m(7, 'lab', 100),
    ],
  },
  {
    id: 'web',
    title: {
      kk: 'Веб-қосымшаларды әзірлеу',
      ru: 'Разработка веб-приложений',
      en: 'Web Application Development',
    },
    teacher: 'Ахметова А.С.',
    credits: 5,
    icon: 'globe',
    color: '#0C71C3',
    rk1: 92,
    rk2: null,
    exam: null,
    marks: [
      m(1, 'practice', 95), m(2, 'practice', 90), m(3, 'practice', 100),
      m(4, 'practice', 85), m(5, 'practice', 90), m(6, 'practice', 95),
    ],
  },
  {
    id: 'db',
    title: {
      kk: 'Деректер қорын басқару жүйелері',
      ru: 'Системы управления базами данных',
      en: 'Database Management Systems',
    },
    teacher: 'Серікбаев Д.Е.',
    credits: 5,
    icon: 'server',
    color: '#5E5CE6',
    rk1: 76,
    rk2: null,
    exam: null,
    marks: [
      m(1, 'lab', 80), m(2, 'lab', 70), absent(3, 'lab'), m(4, 'lab', 75),
      m(5, 'lab', 85), m(6, 'lab', 72), m(7, 'lab', 78),
    ],
  },
  {
    id: 'testing',
    title: {
      kk: 'Бағдарламалық қамтамасыз етуді тестілеу',
      ru: 'Тестирование программного обеспечения',
      en: 'Software Testing',
    },
    teacher: 'Омарова Г.Т.',
    credits: 5,
    icon: 'bug',
    color: '#1F9D55',
    rk1: 81,
    rk2: null,
    exam: null,
    marks: [
      m(1, 'practice', 85), m(2, 'practice', 78), m(3, 'practice', 80),
      m(4, 'practice', 90), m(5, 'practice', 75), m(6, 'practice', 82),
    ],
  },
  {
    id: 'networks',
    title: {
      kk: 'Компьютерлік желілер',
      ru: 'Компьютерные сети',
      en: 'Computer Networks',
    },
    teacher: 'Жұмабеков Е.Н.',
    credits: 5,
    icon: 'git-network',
    color: '#C46A00',
    rk1: 64,
    rk2: null,
    exam: null,
    marks: [
      m(1, 'lab', 70), absent(2, 'lab'), m(3, 'lab', 60), absent(4, 'lab'),
      m(5, 'lab', 65), m(6, 'lab', 62), m(7, 'lab', 68),
    ],
  },
  {
    id: 'english',
    title: {
      kk: 'Кәсіби шетел тілі',
      ru: 'Профессиональный иностранный язык',
      en: 'Professional English',
    },
    teacher: 'Sarah Miller',
    credits: 3,
    icon: 'language',
    color: '#D6336C',
    rk1: null,
    rk2: null,
    exam: null,
    marks: [m(2, 'practice', 90), m(4, 'practice', 95), m(6, 'practice', 88)],
  },
];

export function findSubject(id: string): Subject | undefined {
  return subjects.find((subject) => subject.id === id);
}

export const schedule: ScheduleLesson[] = [
  { id: 's1', day: 1, start: '09:00', end: '10:30', subjectId: 'mobile', type: 'lecture', room: 'В305' },
  { id: 's2', day: 1, start: '10:40', end: '12:10', subjectId: 'db', type: 'lab', room: 'А214' },
  { id: 's3', day: 1, start: '12:40', end: '14:10', subjectId: 'english', type: 'practice', room: 'Б118' },
  { id: 's4', day: 2, start: '09:00', end: '10:30', subjectId: 'web', type: 'lecture', room: 'В301' },
  { id: 's5', day: 2, start: '10:40', end: '12:10', subjectId: 'networks', type: 'lab', room: 'В412' },
  { id: 's6', day: 3, start: '09:00', end: '10:30', subjectId: 'testing', type: 'lecture', room: 'А220' },
  { id: 's7', day: 3, start: '10:40', end: '12:10', subjectId: 'mobile', type: 'lab', room: 'В305' },
  { id: 's8', day: 3, start: '12:40', end: '14:10', subjectId: 'db', type: 'lecture', room: 'А214' },
  { id: 's9', day: 4, start: '09:00', end: '10:30', subjectId: 'networks', type: 'lecture', room: 'В412' },
  { id: 's10', day: 4, start: '10:40', end: '12:10', subjectId: 'web', type: 'practice', room: 'В301' },
  { id: 's11', day: 4, start: '12:40', end: '14:10', subjectId: 'english', type: 'practice', room: 'Б118' },
  { id: 's12', day: 5, start: '09:00', end: '10:30', subjectId: 'testing', type: 'practice', room: 'А220' },
  { id: 's13', day: 5, start: '10:40', end: '12:10', subjectId: 'mobile', type: 'lab', room: 'В305' },
];

export function lessonsOn(day: number): ScheduleLesson[] {
  return schedule.filter((lesson) => lesson.day === day);
}

export const transcript: TranscriptTerm[] = [
  {
    term: 1,
    year: '2024–2025',
    subjects: [
      { title: { kk: 'Математикалық талдау', ru: 'Математический анализ', en: 'Calculus' }, credits: 5, score: 78 },
      { title: { kk: 'Программалау негіздері', ru: 'Основы программирования', en: 'Programming Fundamentals' }, credits: 5, score: 91 },
      { title: { kk: 'Қазақстанның қазіргі тарихы', ru: 'Современная история Казахстана', en: 'Modern History of Kazakhstan' }, credits: 5, score: 85 },
      { title: { kk: 'Ағылшын тілі', ru: 'Английский язык', en: 'English' }, credits: 5, score: 88 },
    ],
  },
  {
    term: 2,
    year: '2024–2025',
    subjects: [
      { title: { kk: 'Сызықтық алгебра', ru: 'Линейная алгебра', en: 'Linear Algebra' }, credits: 5, score: 70 },
      { title: { kk: 'Объектіге бағытталған программалау', ru: 'Объектно-ориентированное программирование', en: 'Object-Oriented Programming' }, credits: 5, score: 86 },
      { title: { kk: 'Философия', ru: 'Философия', en: 'Philosophy' }, credits: 5, score: 80 },
      { title: { kk: 'Дискретті математика', ru: 'Дискретная математика', en: 'Discrete Mathematics' }, credits: 5, score: 66 },
    ],
  },
  {
    term: 3,
    year: '2025–2026',
    subjects: [
      { title: { kk: 'Алгоритмдер және деректер құрылымы', ru: 'Алгоритмы и структуры данных', en: 'Algorithms and Data Structures' }, credits: 5, score: 74 },
      { title: { kk: 'Операциялық жүйелер', ru: 'Операционные системы', en: 'Operating Systems' }, credits: 5, score: 68 },
      { title: { kk: 'Ықтималдықтар теориясы', ru: 'Теория вероятностей', en: 'Probability Theory' }, credits: 5, score: 61 },
      { title: { kk: 'Веб-дизайн', ru: 'Веб-дизайн', en: 'Web Design' }, credits: 5, score: 93 },
    ],
  },
  {
    term: 4,
    year: '2025–2026',
    subjects: [
      { title: { kk: 'Бағдарламалық инженерия', ru: 'Программная инженерия', en: 'Software Engineering' }, credits: 5, score: 82 },
      { title: { kk: 'Компьютерлік архитектура', ru: 'Архитектура компьютера', en: 'Computer Architecture' }, credits: 5, score: 72 },
      { title: { kk: 'Java программалау', ru: 'Программирование на Java', en: 'Java Programming' }, credits: 5, score: 89 },
      { title: { kk: 'Өндірістік практика', ru: 'Производственная практика', en: 'Industrial Internship' }, credits: 5, score: 95 },
    ],
  },
];
