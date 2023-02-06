const SortType = {
  DAY: 'sort-day',
  EVENT: 'sort-event',
  TIME: 'sort-time',
  PRICE: 'sort-price',
  OFFER: 'sort-offer'
};
const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
  PRESENT: 'present'
};
const BlockTimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

const emptyListTypeToText = {
  'loading': 'Loading...',
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now'
};

const MAX_DISPLAYED_CITIES_COUNT = 3;

const defaultPoint = {
  'type': '',
  'dateFrom': '',
  'dateTo': '',
  'destination': '',
  'basePrice': '',
  'isFavorite': false,
  'offers': []
};

export {
  emptyListTypeToText,
  MAX_DISPLAYED_CITIES_COUNT,
  defaultPoint,
  BlockTimeLimit,
  SortType,
  FilterType
};
