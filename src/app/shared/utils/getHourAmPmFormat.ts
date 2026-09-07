export const getTimeAmPm = (hour: string) => {
  if (hour === '00') {
    return {
      hour: '12',
      period: 'a.m',
    };
  }
  if (hour === '12') {
    return {
      hour: hour,
      period: 'p.m',
    };
  }
  const hourRecived = parseInt(hour);
  if (hourRecived >= 1 && hourRecived <= 11) {
    return {
      hour: hour,
      period: 'a.m',
    };
  }
  return {
    hour: (hourRecived - 12).toString(),
    period: 'p.m',
  };
};
