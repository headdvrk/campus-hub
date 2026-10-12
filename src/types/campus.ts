import { IconName, LocalizedText } from './service';

export type Lesson = {
  id: string;
  start: string;
  end: string;
  title: LocalizedText;
  room: string;
};

export type NewsItem = {
  id: string;
  icon: IconName;
  color: string;
  tag: LocalizedText;
  title: LocalizedText;
};
