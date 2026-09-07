const getHour24Format = (hour: string, period: string): string => {
  if (!hour || !period) {
    return '00';
  }

  if (hour === '00') {
    return '00';
  }

  if (period === 'AM') {
    if (hour === '12') {
      return '00';
    } else {
      return hour;
    }
  } else {
    // PM
    if (hour === '12') {
      return '12';
    } else {
      return (parseInt(hour) + 12).toString();
    }
  }
};

// Método para obtener la hora completa en formato 24 horas
export const getTime24Format = (hour: string, period: string): string => {
  const hour24 = getHour24Format(hour, period);
  return hour24;
};
