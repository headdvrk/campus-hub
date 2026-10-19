// alt.edu.kz WordPress REST API (/wp-json/wp/v2/posts) жауабының бізге керек бөлігі
export type WpPost = {
  id: number;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content?: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: {
      source_url?: string;
      media_details?: { sizes?: Record<string, { source_url: string }> };
    }[];
  };
};

// Қосымшада қолданылатын, HTML-ден тазартылған хабарландыру
export type Announcement = {
  id: number;
  date: string;
  link: string;
  title: string;
  excerpt: string;
  // Толық мәтін тек NewsDetails сұранысында келеді
  body?: string;
  image?: string;
};
