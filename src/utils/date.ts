import { Language } from '../types/settings';

// Кейбір платформаларда (Hermes, браузерлер) kk-KZ локалі жоқ,
// сондықтан ай мен апта күндерінің атаулары қолмен берілген
const weekdays: Record<Language, string[]> = {
  kk: ['жексенбі', 'дүйсенбі', 'сейсенбі', 'сәрсенбі', 'бейсенбі', 'жұма', 'сенбі'],
  ru: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

const months: Record<Language, string[]> = {
  kk: ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'],
  ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

// Бүгінгі күн таңдалған тілде: "дүйсенбі, 12 қазан"
export function formatToday(language: Language, date = new Date()): string {
  const weekday = weekdays[language][date.getDay()];
  const month = months[language][date.getMonth()];
  const day = date.getDate();

  return language === 'en'
    ? `${weekday}, ${month} ${day}`
    : `${weekday}, ${day} ${month}`;
}

// Кесте үшін қысқа атаулар, индексі Date.getDay() сияқты (0 = жексенбі)
export const weekdayShort: Record<Language, string[]> = {
  kk: ['Жс', 'Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сб'],
  ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

export function weekdayName(day: number, language: Language): string {
  const name = weekdays[language][day];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// "09:05" түріндегі уақыт, кестедегі жолдармен салыстыру үшін
export function clock(date = new Date()): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// ISO күні таңдалған тілде: "15 қазан 2026"
export function formatDate(iso: string, language: Language): string {
  const date = new Date(iso);
  const month = months[language][date.getMonth()];

  return language === 'en'
    ? `${month} ${date.getDate()}, ${date.getFullYear()}`
    : `${date.getDate()} ${month} ${date.getFullYear()}`;
}
