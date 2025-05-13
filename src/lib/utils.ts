import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { format } from 'date-fns';
import { ru } from 'date-fns/locale'; // Для локализации на русский язык

export function formatDate(dateString: string, dateFormat: string = 'd MMMM yyyy') {
  try {
    return format(new Date(dateString), dateFormat, { locale: ru });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Возвращаем исходную строку в случае ошибки
  }
}
