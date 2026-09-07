import { capitalizeFirstLetter } from '@/app/shared/utils/capitalizeFirstLetter';

export const getMonthTextFromDayNumber = (
  dateArrival: { year: string; month: string; day: string },
  languageSelected: string
): string => {
  const {
    year: yearArrival,
    month: monthArrival,
    day: dayArrival,
  } = dateArrival;

  const date = new Date(
    parseInt(yearArrival),
    parseInt(monthArrival) - 1,
    parseInt(dayArrival)
  );

  const monthText = new Intl.DateTimeFormat(languageSelected, {
    month: 'short',
  }).format(date);

  return capitalizeFirstLetter(monthText);
};

/**
 * Genera un formato de fecha localizado según las convenciones del idioma
 * @param dateData - Objeto con year, month, day como strings
 * @param languageCode - Código de idioma (ej: 'es-ES', 'en-US')
 * @returns Fecha formateada según el idioma (ej: '10 Ago 2025' para español, 'Aug 10 2025' para inglés)
 */
export const getLocalizedDateFormat = (
  dateData: { year: string; month: string; day: string },
  languageCode: string
): string => {
  const monthText = getMonthTextFromDayNumber(dateData, languageCode.split('-')[0]);
  
  // Idiomas que usan formato Month-Day-Year (principalmente inglés)
  const monthFirstLanguages = ['en'];
  
  // Verificar si el idioma base (sin región) usa formato Month-Day-Year
  const languageBase = languageCode.split('-')[0];
  const useMonthFirst = monthFirstLanguages.includes(languageBase);
  
  if (useMonthFirst) {
    return `${monthText} ${dateData.day}, ${dateData.year}`;
  }
  
  // Formato por defecto: Day-Month-Year (usado por la mayoría de idiomas)
  return `${dateData.day} ${monthText} ${dateData.year}`;
};

/**
 * Versión más avanzada usando Intl.DateTimeFormat con patrones personalizados
 * Automáticamente detecta el orden de fecha apropiado según el locale
 * @param dateData - Objeto con year, month, day como strings
 * @param languageCode - Código de idioma (ej: 'es-ES', 'en-US')
 * @returns Fecha formateada usando las convenciones nativas del idioma
 */
export const getAdvancedLocalizedDateFormat = (
  dateData: { year: string; month: string; day: string },
  languageCode: string
): string => {
  const date = new Date(
    parseInt(dateData.year),
    parseInt(dateData.month) - 1,
    parseInt(dateData.day)
  );

  // Usar Intl.DateTimeFormat para obtener el formato apropiado
  const formatter = new Intl.DateTimeFormat(languageCode, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Formatear y capitalizar la primera letra de cada palabra
  return formatter.format(date)
    .split(' ')
    .map(part => capitalizeFirstLetter(part.replace(',', ''))) // Remover comas si las hay
    .join(' ');
};
