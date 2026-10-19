import { NavigatorScreenParams } from '@react-navigation/native';

// Таб-барда 5 бөлім (UX ережесі: төменгі навигацияда ≤ 5)
export type MainTabParamList = {
  Home: undefined;
  Journal: undefined;
  Schedule: undefined;
  News: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  // Кірмеген пайдаланушы экрандары
  Login: undefined;
  Register: undefined;
  // Тіркелгеннен кейін поштаға келген кодты енгізу
  VerifyEmail: { email: string };
  // Кіргеннен кейінгі экрандар
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  Services: undefined;
  Settings: undefined;
  Subject: { subjectId: string };
  Transcript: undefined;
  Details: {
    serviceId: string;
    title: string;
  };
  // Толық объектінің орнына тек идентификатор беріледі
  NewsDetails: { announcementId: number };
  NotFound: undefined;
};
