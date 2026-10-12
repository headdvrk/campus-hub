import { LocalizedText } from './service';

export type Student = {
  name: string;
  firstName: string;
  initials: string;
  group: string;
  program: LocalizedText;
  course: number;
};
