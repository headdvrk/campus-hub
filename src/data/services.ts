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
    icon: 'book',
    gradient: ['#FF9F0A', '#FF6B00'],
    hours: '09:00 – 20:00',
    location: { kk: 'А корпусы, 2-қабат', ru: 'Корпус А, 2 этаж', en: 'Building A, 2nd floor' },
    details: {
      kk: 'Электрондық каталог, оқу залдарын брондау және кітаптарды онлайн ұзарту. Оқу залында 120 орын және тыныш аймақ бар.',
      ru: 'Электронный каталог, бронирование читальных залов и онлайн-продление книг. В читальном зале 120 мест и тихая зона.',
      en: 'Online catalogue, reading room booking and online book renewal. The reading room has 120 seats and a quiet zone.',
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
    icon: 'calendar',
    gradient: ['#FF375F', '#FF2D55'],
    hours: '24/7',
    location: { kk: 'Онлайн', ru: 'Онлайн', en: 'Online' },
    details: {
      kk: 'Апталық сабақ кестесі, аудиториялар және емтихан сессиясының күнтізбесі. Өзгерістер бірден жаңартылады.',
      ru: 'Недельное расписание занятий, аудитории и календарь экзаменационной сессии. Изменения обновляются сразу.',
      en: 'Weekly class timetable, rooms and the exam session calendar. Changes are updated instantly.',
    },
  },
  {
    id: 'canteen',
    title: { kk: 'Асхана', ru: 'Столовая', en: 'Canteen' },
    description: {
      kk: 'Күнделікті мәзір мен бағалар',
      ru: 'Ежедневное меню и цены',
      en: 'Daily menu and prices',
    },
    icon: 'restaurant',
    gradient: ['#30D158', '#00A86B'],
    hours: '08:30 – 17:00',
    location: { kk: 'Б корпусы, 1-қабат', ru: 'Корпус Б, 1 этаж', en: 'Building B, 1st floor' },
    details: {
      kk: 'Бүгінгі мәзір, бағалар және студенттік жеңілдіктер. Түскі ас 12:00–14:00 аралығында.',
      ru: 'Меню на сегодня, цены и студенческие скидки. Обед с 12:00 до 14:00.',
      en: "Today's menu, prices and student discounts. Lunch is served 12:00–14:00.",
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
    icon: 'bed',
    gradient: ['#5E5CE6', '#3634A3'],
    hours: '09:00 – 18:00',
    location: { kk: 'Студенттер қалашығы', ru: 'Студенческий городок', en: 'Student village' },
    details: {
      kk: 'Жатақханаға орналасуға өтініш беру, бос орындар және тұру ережелері.',
      ru: 'Подача заявки на заселение, свободные места и правила проживания.',
      en: 'Apply for a room, check free places and read the residence rules.',
    },
  },
  {
    id: 'sport',
    title: { kk: 'Спорт кешені', ru: 'Спорткомплекс', en: 'Sports centre' },
    description: {
      kk: 'Секциялар және спортзал',
      ru: 'Секции и спортзал',
      en: 'Clubs and gym',
    },
    icon: 'basketball',
    gradient: ['#64D2FF', '#0A84FF'],
    hours: '07:00 – 22:00',
    location: { kk: 'В корпусы', ru: 'Корпус В', en: 'Building C' },
    details: {
      kk: 'Спортзал, бассейн, волейбол және баскетбол секциялары. Студенттерге тегін.',
      ru: 'Спортзал, бассейн, секции волейбола и баскетбола. Для студентов бесплатно.',
      en: 'Gym, swimming pool, volleyball and basketball clubs. Free for students.',
    },
  },
  {
    id: 'medical',
    title: { kk: 'Медпункт', ru: 'Медпункт', en: 'Health centre' },
    description: {
      kk: 'Дәрігер қабылдауы',
      ru: 'Приём врача',
      en: 'Doctor appointments',
    },
    icon: 'medkit',
    gradient: ['#FF453A', '#D70015'],
    hours: '08:00 – 17:00',
    location: { kk: 'А корпусы, 1-қабат', ru: 'Корпус А, 1 этаж', en: 'Building A, 1st floor' },
    details: {
      kk: 'Алғашқы медициналық көмек, профилактикалық тексеру және анықтама алу.',
      ru: 'Первая медицинская помощь, профилактический осмотр и получение справок.',
      en: 'First aid, health check-ups and medical certificates.',
    },
  },
];

export function findService(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}
