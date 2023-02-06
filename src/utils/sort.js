import dayjs from 'dayjs';

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortPointsByDate = (pointA, pointB) => {
  const dateA = pointA.dateFrom;
  const dateB = pointB.dateFrom;

  const weight = getWeightForNullDate(dateA, dateB);

  return weight ?? dayjs(dateA).diff(dayjs(dateB));
};

const sortPointsByPrice = (pointA, pontB) => pontB.totalPrice - pointA.totalPrice;

const sortPointsByTime = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return durationB - durationA;
};

export { sortPointsByDate, sortPointsByPrice, sortPointsByTime };
