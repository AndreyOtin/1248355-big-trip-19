import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DurationFormat } from '../consts/dayjs-formats';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const formatDate = (date, format) => date && dayjs(date).format(format);

const makeFirstLetterUpperCase = (string) => `${string[0].toUpperCase()}${string.slice(1)}`;

const formatDuration = (time) => {
  const durationValue = dayjs(time.to).diff(dayjs(time.from));
  const hours = durationValue / 1000 / 60 / 60;

  if (!durationValue) {
    return;
  }

  if (hours < 1) {
    return dayjs.duration(durationValue).format(DurationFormat.MINUTES);
  }

  if (hours < 24) {
    return dayjs.duration(durationValue).format(DurationFormat.HOURS);
  }

  return dayjs.duration(durationValue).format(DurationFormat.FULL);
};

export {
  formatDate,
  formatDuration,
  makeFirstLetterUpperCase,
};
