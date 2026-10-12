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
