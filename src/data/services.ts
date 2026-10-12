import { Service } from '../types/service';

export const services: Service[] = [
  {
    id: 'library',
    title: { kk: 'Кітапхана', ru: 'Библиотека', en: 'Library' },
    description: {
      kk: 'Кітаптар мен оқу орындары',
      ru: 'Книги и места для учёбы',
      en: 'Books and study spaces',
    },
    icon: 'book-outline',
    details: {
      kk: 'Электрондық каталог, оқу залдарын брондау және кітаптарды онлайн ұзарту. Жұмыс уақыты: 09:00–20:00.',
      ru: 'Электронный каталог, бронирование читальных залов и онлайн-продление книг. Часы работы: 09:00–20:00.',
      en: 'Online catalogue, reading room booking and online book renewal. Open 09:00–20:00.',
    },
  },
  {
    id: 'schedule',
    title: { kk: 'Кесте', ru: 'Расписание', en: 'Schedule' },
    description: {
      kk: 'Сабақтар мен емтихандар',
      ru: 'Занятия и экзамены',
      en: 'Classes and exams',
    },
    icon: 'calendar-outline',
    details: {
      kk: 'Апталық сабақ кестесі, аудиториялар және емтихан сессиясының күнтізбесі.',
      ru: 'Недельное расписание занятий, аудитории и календарь экзаменационной сессии.',
      en: 'Weekly class timetable, rooms and the exam session calendar.',
    },
  },
  {
    id: 'canteen',
    title: { kk: 'Асхана', ru: 'Столовая', en: 'Canteen' },
    description: {
      kk: 'Күнделікті мәзір мен жұмыс уақыты',
      ru: 'Ежедневное меню и часы работы',
      en: 'Daily menu and opening hours',
    },
    icon: 'restaurant-outline',
    details: {
      kk: 'Бүгінгі мәзір, бағалар және жұмыс уақыты: 08:30–17:00.',
      ru: 'Меню на сегодня, цены и часы работы: 08:30–17:00.',
      en: "Today's menu, prices and opening hours: 08:30–17:00.",
    },
  },
  {
    id: 'dormitory',
    title: { kk: 'Жатақхана', ru: 'Общежитие', en: 'Dormitory' },
    description: {
      kk: 'Орналасу және өтініш беру',
      ru: 'Заселение и подача заявки',
      en: 'Accommodation and applications',
    },
    icon: 'home-outline',
    details: {
      kk: 'Жатақханаға орналасуға өтініш беру, бос орындар және тұру ережелері.',
      ru: 'Подача заявки на заселение, свободные места и правила проживания.',
      en: 'Apply for a room, check free places and read the residence rules.',
    },
  },
];

export function findService(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}
