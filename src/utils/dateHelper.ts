/**
 * Date and Time utilities for Norinoya
 */

/**
 * Parses a relative time string (e.g., 'Just now', '15 menit yang lalu', '2 hours ago')
 * and returns the formatted equivalent absolute Indonesian date and time string.
 * This ensures "just now" / "2 hours ago" isn't deleted, but augmented.
 */
export function getAbsoluteDateTime(relative: string): string {
  const now = new Date();
  
  // Lowercase to handle both formats easily
  const rel = relative.toLowerCase().trim();
  
  let targetDate = new Date(now.getTime());
  
  // Try to parse number of units
  const numMatch = rel.match(/\d+/);
  const numberVal = numMatch ? parseInt(numMatch[0], 10) : 1;

  if (rel === 'just now' || rel === 'baru saja') {
    // Current time
  } else if (rel.includes('menit') || rel.includes('minute') || rel.includes('min')) {
    targetDate.setMinutes(now.getMinutes() - numberVal);
  } else if (rel.includes('jam') || rel.includes('hour') || rel.includes('hr')) {
    targetDate.setHours(now.getHours() - numberVal);
  } else if (rel.includes('hari') || rel.includes('day')) {
    targetDate.setDate(now.getDate() - numberVal);
  } else if (rel.includes('minggu') || rel.includes('week')) {
    targetDate.setDate(now.getDate() - numberVal * 7);
  } else if (rel.includes('bulan') || rel.includes('month')) {
    targetDate.setMonth(now.getMonth() - numberVal);
  } else {
    // defaults: if it matches a day ago / etc
    if (rel.includes('day ago')) {
      targetDate.setDate(now.getDate() - 1);
    } else if (rel.includes('days ago')) {
      targetDate.setDate(now.getDate() - 2);
    }
  }
  
  return formatIndonesianDateTime(targetDate);
}

/**
 * Formats a given Date object into Indonesian format, e.g. "Kamis, 18 Juni 2026, 15:36"
 */
export function formatIndonesianDateTime(date: Date): string {
  const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const dayName = daysOfWeek[date.getDay()];
  const dateNum = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${dayName}, ${dateNum} ${monthName} ${year} • ${hours}:${minutes}`;
}

/**
 * Formats a given Date object into a ticking clock string with seconds, e.g. "Kamis, 18 Juni 2026 - 15:36:37 WIB"
 */
export function formatLiveClock(date: Date): string {
  const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const dayName = daysOfWeek[date.getDay()];
  const dateNum = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${dayName}, ${dateNum} ${monthName} ${year} • ${hours}:${minutes}:${seconds} WIB`;
}

/**
 * Tier specifications for Preloved books
 */
export interface TierStyle {
  label: string;
  badgeBg: string;
  badgeTextColor: string;
  badgeBorderColor: string;
  colorName: string;
  desc: string;
}

export function getTierDetails(tier?: string): TierStyle {
  const t = (tier || 'A').toUpperCase().trim();
  switch (t) {
    case 'S':
      return {
        label: 'Tier S (Excellent)',
        badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20',
        badgeTextColor: 'text-amber-600 dark:text-amber-400',
        badgeBorderColor: 'border-amber-500/25 dark:border-amber-500/35',
        colorName: 'amber',
        desc: 'Mulus Banget / Seperti Baru (Pristine/Like-New)',
      };
    case 'A':
      return {
        label: 'Tier A (Very Good)',
        badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        badgeTextColor: 'text-emerald-600 dark:text-emerald-400',
        badgeBorderColor: 'border-emerald-500/25 dark:border-emerald-500/35',
        colorName: 'emerald',
        desc: 'Sangat Bagus, Minim Jejak Baca (Excellent/Collector-grade)',
      };
    case 'B':
      return {
        label: 'Tier B (Good)',
        badgeBg: 'bg-blue-500/10 dark:bg-blue-500/20',
        badgeTextColor: 'text-blue-600 dark:text-blue-400',
        badgeBorderColor: 'border-blue-500/25 dark:border-blue-500/35',
        colorName: 'blue',
        desc: 'Bagus & Sangat Layak Baca / Koleksi (Good condition)',
      };
    case 'C':
      return {
        label: 'Tier C (Fair)',
        badgeBg: 'bg-yellow-500/10 dark:bg-yellow-500/20',
        badgeTextColor: 'text-yellow-600 dark:text-yellow-500',
        badgeBorderColor: 'border-yellow-500/25 dark:border-yellow-500/35',
        colorName: 'yellow',
        desc: 'Cukup Bagus, Ada Garis Lipetan / Kertas Sedikit Kuning (Fair)',
      };
    case 'D':
      return {
        label: 'Tier D (Poor)',
        badgeBg: 'bg-red-500/10 dark:bg-red-500/20',
        badgeTextColor: 'text-red-650 dark:text-red-400',
        badgeBorderColor: 'border-red-500/25 dark:border-red-500/35',
        colorName: 'red',
        desc: 'Kondisi Sedang / Ada Kekurangan Signifikan (Poor/With defect)',
      };
    default:
      return {
        label: `Tier ${t}`,
        badgeBg: 'bg-neutral-500/10 dark:bg-neutral-500/20',
        badgeTextColor: 'text-neutral-600 dark:text-neutral-400',
        badgeBorderColor: 'border-neutral-500/25 dark:border-neutral-500/35',
        colorName: 'neutral',
        desc: 'Kondisi Terkurasi',
      };
  }
}

