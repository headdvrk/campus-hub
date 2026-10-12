import { Lesson, NewsItem } from '../types/campus';

export const todayLessons: Lesson[] = [
  {
    id: 'l1',
    start: '09:00',
    end: '10:30',
    title: { kk: 'Мобильді қосымшалар', ru: 'Мобильные приложения', en: 'Mobile Apps' },
    room: '305',
  },
  {
    id: 'l2',
    start: '10:50',
    end: '12:20',
    title: { kk: 'Деректер қоры', ru: 'Базы данных', en: 'Databases' },
    room: '214',
  },
  {
    id: 'l3',
    start: '13:00',
    end: '14:30',
    title: { kk: 'Ағылшын тілі', ru: 'Английский язык', en: 'English' },
    room: '118',
  },
];

export const news: NewsItem[] = [
  {
    id: 'n1',
    icon: 'trophy',
    color: '#FF9F0A',
    tag: { kk: 'Іс-шара', ru: 'Событие', en: 'Event' },
    title: {
      kk: 'IT-хакатонға тіркеу ашылды',
      ru: 'Открыта регистрация на IT-хакатон',
      en: 'IT hackathon registration is open',
    },
  },
  {
    id: 'n2',
    icon: 'library',
    color: '#5E5CE6',
    tag: { kk: 'Кітапхана', ru: 'Библиотека', en: 'Library' },
    title: {
      kk: 'Сенбіде кітапхана 18:00-ге дейін ашық',
      ru: 'В субботу библиотека открыта до 18:00',
      en: 'The library is open until 18:00 on Saturday',
    },
  },
];
