import { Service } from '../types/service';

// Деректер ALT Университетінің ресми сайтынан алынған (alt.edu.kz, 2026 ж. қазан)
const MAIN_BUILDING = {
  kk: 'Алматы, Шевченко к-сі, 97',
  ru: 'Алматы, ул. Шевченко, 97',
  en: '97 Shevchenko St, Almaty',
};

export const services: Service[] = [
  {
    id: 'library',
    title: { kk: 'Кітапхана', ru: 'Библиотека', en: 'Library' },
    description: {
      kk: 'Кітапханалық-ақпараттық орталық',
      ru: 'Библиотечно-информационный центр',
      en: 'Library and information centre',
    },
    icon: 'library',
    gradient: ['#FF9F0A', '#FF6B00'],
    location: MAIN_BUILDING,
    link: 'https://alt.edu.kz/ru/bibliotechno-informaczionnyj-czentr/',
    details: {
      kk: 'Қор 860 мың данадан астам кітап пен 9 мыңнан астам электрондық ресурстан тұрады. 2024 жылғы жөндеуден кейін 161 орынды бес коворкинг аймағы ашылды, оның 58 орны моноблоктармен (Asus және iMac) жабдықталған. 1925 жылдан бергі темір жол тарихы туралы бірегей әдебиет жинағы бар. Каталог КАБИС жүйесінде онлайн қолжетімді.',
      ru: 'Фонд — более 860 тысяч экземпляров книг и свыше 9 тысяч электронных ресурсов. После ремонта 2024 года открыто пять коворкинг-зон на 161 место, 58 из них оснащены моноблоками (Asus и iMac). Есть уникальная коллекция литературы о развитии железной дороги с 1925 года. Каталог доступен онлайн в системе КАБИС.',
      en: 'The collection holds over 860,000 books and more than 9,000 e-resources. After the 2024 renovation, five coworking zones with 161 seats were opened, 58 of them equipped with Asus and iMac all-in-ones. A unique collection on railway history since 1925 is kept here. The catalogue is available online in the KABIS system.',
    },
  },
  {
    id: 'helpdesk',
    title: { kk: 'Help Desk', ru: 'Help Desk', en: 'Help Desk' },
    description: {
      kk: 'Білім алушыларға қызмет көрсету орталығы',
      ru: 'Центр обслуживания обучающихся',
      en: 'Student service centre',
    },
    icon: 'help-buoy',
    gradient: ['#64D2FF', '#0A84FF'],
    location: MAIN_BUILDING,
    link: 'https://alt.edu.kz/ru/czentr-obsluzhivaniya-obuchayushhihsya/',
    details: {
      kk: 'Медициналық анықтамаларды қабылдау, транскрипт рәсімдеу, оқу орнынан анықтама алу және оқу процесіне қатысты басқа да сұрақтар бойынша көмек. Қызметкерлер университет рәсімдерінде бағдар беріп, қажетті бөлімге бағыттайды.',
      ru: 'Приём медицинских справок, оформление транскриптов, справки с места учёбы и другие вопросы, связанные с учебным процессом. Сотрудники помогают ориентироваться в процедурах университета и направляют к нужным подразделениям.',
      en: 'Medical certificates, transcripts, enrolment certificates and other questions about the study process. Staff help students navigate university procedures and refer them to the right department.',
    },
  },
  {
    id: 'schedule',
    title: { kk: 'Оқу процесі', ru: 'Учебный процесс', en: 'Study process' },
    description: {
      kk: 'Академиялық күнтізбе мен кестелер',
      ru: 'Академический календарь и графики',
      en: 'Academic calendar and timetables',
    },
    icon: 'calendar',
    gradient: ['#FF375F', '#FF2D55'],
    location: { kk: 'Онлайн, alt.edu.kz', ru: 'Онлайн, alt.edu.kz', en: 'Online, alt.edu.kz' },
    link: 'https://alt.edu.kz/ru/organizacziya-uchebnogo-proczessa/',
    details: {
      kk: '2026–27 оқу жылына арналған оқу процесінің кестелері және бакалавриат, магистратура мен докторантураның барлық курстарына арналған академиялық күнтізбелер. Құжаттар сайтта PDF түрінде жарияланған.',
      ru: 'Графики учебного процесса на 2026–27 учебный год и академические календари для всех курсов бакалавриата, магистратуры и докторантуры. Документы опубликованы на сайте в формате PDF.',
      en: 'Study process schedules for the 2026–27 academic year and academic calendars for every year of bachelor, master and doctoral programmes. The documents are published on the website as PDFs.',
    },
  },
  {
    id: 'medical',
    title: { kk: 'Денсаулық пункті', ru: 'Здравпункт', en: 'Health centre' },
    description: {
      kk: 'Дәрігер қабылдауы және анықтамалар',
      ru: 'Приём врача и справки',
      en: 'Doctor visits and certificates',
    },
    icon: 'medkit',
    gradient: ['#FF453A', '#D70015'],
    hours: '09:00 – 17:00 (13:00 – 14:00)',
    phone: '+7 707 611 4929',
    location: {
      kk: 'Масанчи к-сі, 88/99, №4 жатақхананың 1-қабаты',
      ru: 'ул. Масанчи, 88/99, 1 этаж общежития №4',
      en: '88/99 Masanchi St, ground floor of dormitory No. 4',
    },
    link: 'https://alt.edu.kz/ru/studencheskaya-zhizn/zdravpunkt/',
    details: {
      kk: 'Кампустағы медициналық кабинет алғашқы көмек көрсетеді және ауырған студенттерге анықтама ашады. Студенттер «Nurlab medical clinic» медициналық орталығына тіркелген (Рысқұлов к-сі, 170а), онда қызмет тегін.',
      ru: 'Медкабинет в кампусе оказывает первую помощь и открывает справки заболевшим студентам. Студенты прикреплены к медицинскому центру «Nurlab medical clinic» (ул. Рыскулова, 170а), где обслуживание бесплатное.',
      en: 'The campus medical room provides first aid and issues sick notes. Students are registered with Nurlab medical clinic (170a Ryskulov St), where care is free of charge.',
    },
  },
  {
    id: 'dormitory',
    title: { kk: 'Студенттер үйі', ru: 'Дом студентов', en: 'Dormitories' },
    description: {
      kk: 'Төрт жатақхана, 2000-нан астам орын',
      ru: 'Четыре общежития, более 2000 мест',
      en: 'Four dormitories, 2,000+ residents',
    },
    icon: 'bed',
    gradient: ['#5E5CE6', '#3634A3'],
    phone: '+7 771 526 0539',
    location: { kk: 'Университет аумағы', ru: 'Территория университета', en: 'University campus' },
    link: 'https://alt.edu.kz/ru/studencheskaya-zhizn/dom-studentov/',
    details: {
      kk: 'Төрт студенттер үйінде 2000-нан астам студент тұрады; бөлмелер екі және үш орындық. Тегін Wi-Fi (100 Мбит/с), оқу залдары, тренажер залдары, асхана мен кір жуатын орын бар. Тәулік бойы күзет және бейнебақылау. Қоныстану жыл сайын 25 тамыздан басталады.',
      ru: 'В четырёх домах студентов живут более 2000 студентов в двух- и трёхместных комнатах. Бесплатный Wi-Fi (100 Мбит/с), читальные и тренажёрные залы, столовая, прачечная. Круглосуточная охрана и видеонаблюдение. Заселение ежегодно начинается с 25 августа.',
      en: 'More than 2,000 students live in four dormitories in double and triple rooms. Free Wi-Fi (100 Mbit/s), reading rooms, gyms, a canteen and a laundry. 24/7 security and CCTV. Move-in starts on 25 August every year.',
    },
  },
  {
    id: 'cafeteria',
    title: { kk: 'Кафетерий', ru: 'Кафетерий', en: 'Cafeteria' },
    description: {
      kk: 'Cafeteria асханасы және Campus Coffee',
      ru: 'Столовая Cafeteria и Campus Coffee',
      en: 'Cafeteria and Campus Coffee',
    },
    icon: 'cafe',
    gradient: ['#30D158', '#00A86B'],
    hours: '09:00 – 18:00',
    location: { kk: 'Бас ғимарат, 2-қабат', ru: 'Главный корпус, 2 этаж', en: 'Main building, 2nd floor' },
    link: 'https://alt.edu.kz/ru/studencheskaya-zhizn/studencheskaya-kafeteriya/',
    details: {
      kk: 'Университетте «Cafeteria» атты заманауи асхана бар. Campus Coffee кафетерийі студенттер мен қызметкерлерге хош иісті кофе мен жеңіл тағамдар ұсынады.',
      ru: 'В университете работает современная столовая «Cafeteria». Кафетерий Campus Coffee предлагает студентам и сотрудникам ароматный кофе и лёгкие закуски.',
      en: 'The university has a modern canteen called Cafeteria. Campus Coffee serves students and staff fresh coffee and light snacks.',
    },
  },
  {
    id: 'career',
    title: { kk: 'Мансап кеңсесі', ru: 'Офис карьеры', en: 'Career office' },
    description: {
      kk: 'Тәжірибе және жұмысқа орналасу',
      ru: 'Практика и трудоустройство',
      en: 'Internships and jobs',
    },
    icon: 'briefcase',
    gradient: ['#BF5AF2', '#8944AB'],
    phone: '+7 747 131 7196',
    location: {
      kk: 'Шевченко к-сі, 97, В719 каб.',
      ru: 'ул. Шевченко, 97, каб. В719',
      en: '97 Shevchenko St, room V719',
    },
    link: 'https://alt.edu.kz/ru/ofis-razvitiya-karery/',
    details: {
      kk: 'Студенттер мен түлектерге жұмысқа орналасуға көмектеседі, кәсіптік практиканы ұйымдастырады, бос жұмыс орындары жәрмеңкелерін, шебер-сыныптар мен қонақ дәрістерін өткізеді. Дуалды оқыту бағдарламасына жауапты.',
      ru: 'Помогает студентам и выпускникам с трудоустройством, организует профессиональную практику, ярмарки вакансий, мастер-классы и гостевые лекции. Отвечает за дуальное обучение.',
      en: 'Helps students and graduates find jobs, arranges professional internships, job fairs, master classes and guest lectures. Runs the dual education programme.',
    },
  },
  {
    id: 'mental',
    title: { kk: 'Психолог', ru: 'Психолог', en: 'Counselling' },
    description: {
      kk: 'Менталдық денсаулық кеңсесі',
      ru: 'Офис ментального здоровья',
      en: 'Mental health office',
    },
    icon: 'heart',
    gradient: ['#FF6482', '#E0457B'],
    phone: '+7 707 704 4074',
    location: MAIN_BUILDING,
    link: 'https://alt.edu.kz/ru/psihologicheskaya-pomoshh-onlajn/',
    details: {
      kk: 'Жеке және топтық психологиялық кеңес беру. Стресс, мазасыздық, өзін-өзі бағалау, қарым-қатынастағы қиындықтар мен жалғыздық бойынша қауіпсіз әрі құпия көмек.',
      ru: 'Индивидуальные и групповые психологические консультации. Безопасная и конфиденциальная помощь при стрессе, тревожности, проблемах с самооценкой, трудностях в отношениях и одиночестве.',
      en: 'Individual and group counselling. Safe and confidential support with stress, anxiety, self-esteem, relationship difficulties and loneliness.',
    },
  },
  {
    id: 'clubs',
    title: { kk: 'Студенттік клубтар', ru: 'Студенческие клубы', en: 'Student clubs' },
    description: {
      kk: 'Шығармашылық, спорт, волонтерлік',
      ru: 'Творчество, спорт, волонтёрство',
      en: 'Arts, sports, volunteering',
    },
    icon: 'people',
    gradient: ['#FFD60A', '#FF9F0A'],
    location: MAIN_BUILDING,
    link: 'https://alt.edu.kz/ru/studencheskaya-zhizn/studencheskie-kluby/',
    details: {
      kk: 'Би клубы (hip-hop, jazz-funk), «ALT» Жайдарман командасы, «Домбыра ART», музыкалық және театр клубтары, волонтерлік қозғалыс. Спорт секциялары: бокс, футбол, баскетбол, волейбол, шахмат, үстел теннисі.',
      ru: 'Танцевальный клуб (hip-hop, jazz-funk), команда Жайдарман «ALT», «Домбыра ART», музыкальный и театральный клубы, волонтёрское движение. Спортивные секции: бокс, футбол, баскетбол, волейбол, шахматы, настольный теннис.',
      en: 'Dance club (hip-hop, jazz-funk), the ALT Zhaidarman comedy team, Dombyra ART, music and theatre clubs, volunteering. Sports: boxing, football, basketball, volleyball, chess and table tennis.',
    },
  },
];

export function findService(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}
