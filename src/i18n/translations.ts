import { Language } from '../types/settings';

const kk = {
  loading: 'Баптаулар жүктелуде...',
  tabHome: 'Басты',
  tabServices: 'Сервистер',
  tabProfile: 'Профиль',
  tabSettings: 'Баптаулар',

  loginSubtitle: 'Жүйеге кіру',
  loginPlaceholder: 'Логин',
  passwordPlaceholder: 'Құпиясөз (кемінде 6 таңба)',
  loginButton: 'Кіру',
  errorTitle: 'Қате',
  loginError: 'Логинді және кемінде 6 таңбалы құпиясөзді енгізіңіз',

  greeting: 'Сәлем, {name}!',
  homeSubtitle: 'Campus Hub — университеттің цифрлық кампусы',
  quickActions: 'Жылдам әрекеттер',
  quickActionsSubtitle: 'Жиі қолданылатын сервистер',
  allServices: 'Барлық сервистер',

  servicesTitle: 'Сервистер',
  servicesCount: 'Кампустағы {count} қызмет',
  servicesEmptyTitle: 'Сервистер жоқ',
  servicesEmptyMessage: 'Қазір қолжетімді сервистер табылмады',

  detailsDefaultTitle: 'Сервис',
  back: 'Артқа',
  serviceNotFound: 'Сервис табылмады',
  serviceNotFoundMessage: '«{id}» ID-і бар сервис жоқ',

  notFoundHeader: 'Қате',
  notFoundTitle: 'Бет табылмады',
  notFoundMessage: 'Сұралған экран жоқ немесе оған қате деректер берілді.',
  goHome: 'Басты бетке қайту',

  program: 'Білім беру бағдарламасы',
  group: 'Тобы',
  course: 'Курс',
  courseValue: '{n}-курс',
  currentSettings: 'Ағымдағы баптаулар',
  logout: 'Шығу',

  theme: 'Тақырып',
  themeLight: 'Ашық',
  themeDark: 'Қараңғы',
  darkMode: 'Қараңғы режим',
  fontSize: 'Қаріп өлшемі',
  fontSmall: 'Кіші',
  fontNormal: 'Қалыпты',
  fontLarge: 'Үлкен',
  language: 'Тіл',
  preview: 'Алдын ала қарау',
  previewText: 'Бұл мәтін таңдалған қаріп өлшемімен көрсетіледі.',
  savedHint: 'Баптаулар құрылғыда автоматты түрде сақталады',
  reset: 'Баптауларды қалпына келтіру',
  resetDone: 'Баптаулар бастапқы күйге қайтарылды',
};

export type TranslationKey = keyof typeof kk;
type Dictionary = Record<TranslationKey, string>;

const ru: Dictionary = {
  loading: 'Загрузка настроек...',
  tabHome: 'Главная',
  tabServices: 'Сервисы',
  tabProfile: 'Профиль',
  tabSettings: 'Настройки',

  loginSubtitle: 'Вход в систему',
  loginPlaceholder: 'Логин',
  passwordPlaceholder: 'Пароль (не менее 6 символов)',
  loginButton: 'Войти',
  errorTitle: 'Ошибка',
  loginError: 'Введите логин и пароль не короче 6 символов',

  greeting: 'Привет, {name}!',
  homeSubtitle: 'Campus Hub — цифровой кампус университета',
  quickActions: 'Быстрые действия',
  quickActionsSubtitle: 'Часто используемые сервисы',
  allServices: 'Все сервисы',

  servicesTitle: 'Сервисы',
  servicesCount: 'Сервисов в кампусе: {count}',
  servicesEmptyTitle: 'Сервисов нет',
  servicesEmptyMessage: 'Доступные сервисы не найдены',

  detailsDefaultTitle: 'Сервис',
  back: 'Назад',
  serviceNotFound: 'Сервис не найден',
  serviceNotFoundMessage: 'Сервиса с ID «{id}» не существует',

  notFoundHeader: 'Ошибка',
  notFoundTitle: 'Страница не найдена',
  notFoundMessage: 'Запрошенного экрана нет или ему переданы неверные данные.',
  goHome: 'На главную',

  program: 'Образовательная программа',
  group: 'Группа',
  course: 'Курс',
  courseValue: '{n} курс',
  currentSettings: 'Текущие настройки',
  logout: 'Выйти',

  theme: 'Тема',
  themeLight: 'Светлая',
  themeDark: 'Тёмная',
  darkMode: 'Тёмный режим',
  fontSize: 'Размер шрифта',
  fontSmall: 'Мелкий',
  fontNormal: 'Обычный',
  fontLarge: 'Крупный',
  language: 'Язык',
  preview: 'Предпросмотр',
  previewText: 'Этот текст показан выбранным размером шрифта.',
  savedHint: 'Настройки автоматически сохраняются на устройстве',
  reset: 'Сбросить настройки',
  resetDone: 'Настройки возвращены к исходным',
};

const en: Dictionary = {
  loading: 'Loading settings...',
  tabHome: 'Home',
  tabServices: 'Services',
  tabProfile: 'Profile',
  tabSettings: 'Settings',

  loginSubtitle: 'Sign in',
  loginPlaceholder: 'Login',
  passwordPlaceholder: 'Password (at least 6 characters)',
  loginButton: 'Sign in',
  errorTitle: 'Error',
  loginError: 'Enter a login and a password of at least 6 characters',

  greeting: 'Hi, {name}!',
  homeSubtitle: 'Campus Hub — the university digital campus',
  quickActions: 'Quick actions',
  quickActionsSubtitle: 'Frequently used services',
  allServices: 'All services',

  servicesTitle: 'Services',
  servicesCount: '{count} services on campus',
  servicesEmptyTitle: 'No services',
  servicesEmptyMessage: 'No services are available right now',

  detailsDefaultTitle: 'Service',
  back: 'Back',
  serviceNotFound: 'Service not found',
  serviceNotFoundMessage: 'There is no service with ID “{id}”',

  notFoundHeader: 'Error',
  notFoundTitle: 'Page not found',
  notFoundMessage: 'The requested screen does not exist or got invalid data.',
  goHome: 'Go to Home',

  program: 'Study program',
  group: 'Group',
  course: 'Year',
  courseValue: 'Year {n}',
  currentSettings: 'Current settings',
  logout: 'Log out',

  theme: 'Theme',
  themeLight: 'Light',
  themeDark: 'Dark',
  darkMode: 'Dark mode',
  fontSize: 'Font size',
  fontSmall: 'Small',
  fontNormal: 'Normal',
  fontLarge: 'Large',
  language: 'Language',
  preview: 'Preview',
  previewText: 'This text is shown in the selected font size.',
  savedHint: 'Settings are saved on the device automatically',
  reset: 'Reset settings',
  resetDone: 'Settings restored to defaults',
};

export const translations: Record<Language, Dictionary> = { kk, ru, en };

export const languageNames: Record<Language, string> = {
  kk: 'Қазақша',
  ru: 'Русский',
  en: 'English',
};
