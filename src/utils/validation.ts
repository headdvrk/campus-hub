// Тіркелу формасының тексерулері. Олар тек ыңғайлылық үшін: нақты шектеулерді
// (пошта бірегейлігі, құпиясөз ұзындығы) Supabase серверде қайта тексереді

// Қазақстан нөмірі (барлығы +7 7XX): 8 707 123 45 67, +7(707)1234567 т.б. →
// "+7 707 123 45 67"; Ресей (+7 9XX) және жарамсыз нөмірлер үшін null
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/\D/g, '');
  if (digits.length === 11 && digits[0] === '8') digits = '7' + digits.slice(1);
  if (digits.length === 10) digits = '7' + digits;
  if (!/^77\d{9}$/.test(digits)) return null;
  return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

// Әріптер (кез келген әліпби), бос орын, дефис және апостроф
export function isValidName(name: string): boolean {
  return /^[\p{L}][\p{L} '\-]{1,39}$/u.test(name.trim());
}

// ALT топтарының коды: 660Р, ПИ-24-1К, IT-23 т.б.
export function isValidGroup(group: string): boolean {
  return /^[\p{L}\d][\p{L}\d\-]{1,11}$/u.test(group.trim());
}

// Кемінде 8 таңба, әріп пен сан
export function isStrongPassword(password: string): boolean {
  return password.length >= 8 && /\p{L}/u.test(password) && /\d/.test(password);
}
