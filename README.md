# Campus Hub

React Native (Expo + TypeScript) негізіндегі университеттің цифрлық кампус қосымшасы.
Жоба «Мобильді қосымшалар» пәнінің №5–7 зертханалық жұмыстары бойынша кезең-кезеңімен жасалды.

## Зертханалық жұмыстар

| Лаб | Тақырып | Тармақ / тег |
|-----|---------|--------------|
| №5 | Навигациясы бар көп экранды қосымша (Stack + Bottom Tabs) | `lab5-navigation`, тег `lab5` |
| №6 | Жоба құрылымын рефакторингтеу, компоненттер, Git | `lab6-refactor`, тег `lab6` |
| №7 | Пайдаланушы баптаулары, тақырып, Context API, AsyncStorage | `lab7-settings`, тег `lab7` |

`main` тармағында соңғы толық нұсқа (№7) тұр.

### №5: Навигация
- Login, Home, Services, Profile, Details экрандары
- Stack (Login → Main → Details) және Bottom Tabs (Home / Services / Profile)
- `RootStackParamList`, `MainTabParamList` маршрут типтері
- Логин тексерісі (бос логин, құпиясөз < 6 таңба → қате)
- Details экранына `serviceId` және `title` параметрлерін беру
- Қосымша: tab белгішелері, белсенді түс, «Шығу» батырмасы, қате маршрут (NotFound)

### №6: Рефакторинг
- `components / data / navigation / screens / styles / types` бумалары
- `Service` типі, `services` массиві
- `SectionTitle`, `ServiceCard` компоненттері, `components/index.ts`
- Services экраны `FlatList` арқылы
- Қосымша: `styles/theme.ts`, `EmptyState`, Profile экраны шағын компоненттерге (`ProfileHeader`, `InfoRow`) бөлінген

### №7: Баптаулар
- `SettingsContext` және `useSettings` hook
- Ашық / қараңғы тақырып (`theme/themes.ts`)
- Қаріп өлшемі: A− / A / A+ (14 / 17 / 21)
- Баптаулар `AsyncStorage` ішінде `@campus_hub_settings` кілтімен сақталады
- Баптаулар Home, Services, Profile, Settings, Details, Login экрандарына әсер етеді
- Қосымша: баптауларды қалпына келтіру, жүйелік тақырыпты анықтау,
  тіл таңдау (қазақша / русский / English), Splash экраны

## Жоба құрылымы

```
App.tsx
src/
├── components/   қайта пайдаланылатын UI элементтері
├── context/      SettingsContext (күй + AsyncStorage)
├── data/         сервистер мен студент деректері
├── i18n/         kk / ru / en аудармалары
├── navigation/   RootNavigator (Stack), MainTabs (Tabs)
├── screens/      қосымша экрандары
├── styles/       аралықтар, радиустар, қаріп өлшемдері
├── theme/        ашық және қараңғы тақырып түстері
└── types/        TypeScript типтері
```

## Іске қосу

```bash
npm install
npx expo start -c
```

Телефондағы **Expo Go** қосымшасымен QR-кодты сканерлеңіз.
Кіру үшін кез келген логинді және кемінде 6 таңбалы құпиясөзді енгізіңіз.

Тексеру: `npx tsc --noEmit`

## Тексеру сценарийі (№7)
1. Settings экранын ашып, тақырыпты қараңғыға ауыстыру
2. Home және Profile экрандарындағы түстердің өзгергенін көру
3. Қаріп өлшемін A+ етіп, мәтіннің үлкейгенін көру
4. Қосымшаны толық жауып, қайта ашу: баптаулар сақталып қалады
