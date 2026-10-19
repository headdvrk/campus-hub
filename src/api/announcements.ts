import AsyncStorage from '@react-native-async-storage/async-storage';

import { Announcement, WpPost } from '../types/announcement';
import { Language } from '../types/settings';
import { htmlToText } from '../utils/html';

// Мекенжай .env файлынан алынады; EXPO_PUBLIC_ префиксі оны қосымша кодына қосады
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://alt.edu.kz';
const POSTS_URL = API_URL + '/wp-json/wp/v2/posts';
const CACHE_KEY = '@campus_hub_announcements_';

// Сайттағы «Жаңалықтар» санаты әр тілде бөлек
const NEWS_CATEGORY: Record<Language, number> = { kk: 29, ru: 4, en: 47 };

// _embed суретті сол сұраныспен береді, _fields жауапты қысқартады
const LIST_FIELDS = 'id,date,link,title,excerpt,_links,_embedded';

function toAnnouncement(post: WpPost): Announcement {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  return {
    id: post.id,
    date: post.date,
    link: post.link,
    title: htmlToText(post.title.rendered),
    excerpt: htmlToText(post.excerpt.rendered),
    body: post.content ? htmlToText(post.content.rendered) : undefined,
    image: media?.media_details?.sizes?.medium_large?.source_url ?? media?.source_url,
  };
}

// signal арқылы сұранысты AbortController көмегімен тоқтатуға болады
export async function getAnnouncements(
  language: Language,
  signal?: AbortSignal
): Promise<Announcement[]> {
  const response = await fetch(
    `${POSTS_URL}?categories=${NEWS_CATEGORY[language]}&per_page=10` +
      `&_embed=wp:featuredmedia&_fields=${LIST_FIELDS}`,
    { signal }
  );
  if (!response.ok) {
    throw new Error('HTTP ' + response.status);
  }
  const posts: WpPost[] = await response.json();
  const data = posts.map(toAnnouncement);
  // Сәтті жауап желі жоқ кезде көрсету үшін кэштеледі
  AsyncStorage.setItem(CACHE_KEY + language, JSON.stringify(data)).catch(() => {});
  return data;
}

export async function getAnnouncement(
  id: number,
  signal?: AbortSignal
): Promise<Announcement> {
  const response = await fetch(
    `${POSTS_URL}/${id}?_embed=wp:featuredmedia&_fields=${LIST_FIELDS},content`,
    { signal }
  );
  if (!response.ok) {
    throw new Error('HTTP ' + response.status);
  }
  return toAnnouncement(await response.json());
}

// Соңғы сәтті жүктелген тізім; кэш жоқ не бүлінген болса null
export async function getCachedAnnouncements(
  language: Language
): Promise<Announcement[] | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY + language);
    const data = raw ? JSON.parse(raw) : null;
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}
