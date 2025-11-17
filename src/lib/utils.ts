import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWhatsApp(value: string): string {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 12) return `+${numbers.slice(0, 3)} ${numbers.slice(3)}`;

  return `+${numbers.slice(0, 3)} ${numbers.slice(3, 5)} ${numbers.slice(5, 8)} ${numbers.slice(8, 12)}`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }

  return `${minutes}min`;
}

export function isModuleUnlocked(releaseDate: string): boolean {
  return new Date(releaseDate) <= new Date();
}

export function getDaysUntilUnlock(releaseDate: string): number {
  const now = new Date();
  const release = new Date(releaseDate);
  const diffTime = release.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
