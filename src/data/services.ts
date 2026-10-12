import { Service } from '../types/service';

export const services: Service[] = [
  {
    id: 'library',
    title: 'Кітапхана',
    description: 'Кітаптар мен оқу орындары',
    icon: 'book-outline',
    details:
      'Электрондық каталог, оқу залдарын брондау және кітаптарды онлайн ұзарту. Жұмыс уақыты: 09:00–20:00.',
  },
  {
    id: 'schedule',
    title: 'Кесте',
    description: 'Сабақтар мен емтихандар',
    icon: 'calendar-outline',
    details:
      'Апталық сабақ кестесі, аудиториялар және емтихан сессиясының күнтізбесі.',
  },
  {
    id: 'canteen',
    title: 'Асхана',
    description: 'Күнделікті мәзір мен жұмыс уақыты',
    icon: 'restaurant-outline',
    details: 'Бүгінгі мәзір, бағалар және жұмыс уақыты: 08:30–17:00.',
  },
  {
    id: 'dormitory',
    title: 'Жатақхана',
    description: 'Орналасу және өтініш беру',
    icon: 'home-outline',
    details:
      'Жатақханаға орналасуға өтініш беру, бос орындар және тұру ережелері.',
  },
];

export function findService(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}
