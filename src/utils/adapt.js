import { isValueTypeOfObject, transformCamelToUnderscore, transformUnderscoreToCamel } from './common';
import { DATE_KEYS } from '../consts/api';
import he from 'he';

const adaptToClient = (data, dateKeys = DATE_KEYS, newDateKey) => {
  if (dateKeys.includes(newDateKey)) {
    return new Date(data);
  }

  if (isValueTypeOfObject(data)) {
    return Object.entries(data).reduce((dataCopy, [key, value]) => {
      const newKey = transformUnderscoreToCamel(key);

      dataCopy[newKey] = adaptToClient(value, dateKeys, newKey);

      return dataCopy;
    }, {});
  }

  return data;
};

const adaptToServer = (data) => {
  if (data instanceof Date) {
    return data.toISOString();
  }

  if (isValueTypeOfObject(data)) {
    return Object.entries(data).reduce((dataCopy, [key, value]) => {
      const newKey = transformCamelToUnderscore(key);

      dataCopy[newKey] = adaptToServer(value);

      return dataCopy;
    }, {});
  }

  return data;
};

const adaptStringsForRendering = (data) => {
  if (typeof data === 'string') {
    return he.encode(data);
  }

  if (Array.isArray(data)) {
    return data.map(adaptStringsForRendering);
  }

  if (isValueTypeOfObject(data)) {
    return Object.entries(data).reduce((dataCopy, [key, value]) => {
      dataCopy[key] = adaptStringsForRendering(value);

      return dataCopy;
    }, {});
  }

  return data;
};

export {
  adaptStringsForRendering,
  adaptToServer,
  adaptToClient
};
