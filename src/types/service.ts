import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

// Ionicons жиынындағы рұқсат етілген белгіше атаулары
export type IconName = ComponentProps<typeof Ionicons>['name'];

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  details: string;
};
