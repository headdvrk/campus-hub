import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { Language } from './settings';

// Ionicons жиынындағы рұқсат етілген белгіше атаулары
export type IconName = ComponentProps<typeof Ionicons>['name'];

// Әр тілге арналған мәтін
export type LocalizedText = Record<Language, string>;

export type Service = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  icon: IconName;
  details: LocalizedText;
  gradient: readonly [string, string];
  hours: string;
  location: LocalizedText;
};
