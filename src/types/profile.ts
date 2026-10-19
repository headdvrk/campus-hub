// ALT Университетінің мектептері (факультеттері), alt.edu.kz сайтындағыдай
export type Faculty = 'business' | 'engineering' | 'technology';

export const FACULTIES: Faculty[] = ['technology', 'engineering', 'business'];

// Факультет атауының аударма кілті
export const facultyKey = {
  technology: 'facultyTechnology',
  engineering: 'facultyEngineering',
  business: 'facultyBusiness',
} as const satisfies Record<Faculty, string>;

// Тіркелу кезінде толтырылып, Supabase user_metadata ішінде сақталатын профиль
export type StudentProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  faculty: Faculty;
  group: string;
};

export type SignUpForm = StudentProfile & { password: string };
