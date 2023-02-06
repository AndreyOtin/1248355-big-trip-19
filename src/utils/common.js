const isValueTypeOfObject = (value) => typeof value === 'object' && !Array.isArray(value) && value !== null && !(value instanceof Date);

const transformKebabStringToCamel = (string) => string.replace(/-[a-z]/, (match) => match.slice(1).toUpperCase());

const transformUnderscoreToCamel = (string) => string.replace(/_+\w/g, (match) => match.slice(1).toUpperCase());

const transformCamelToUnderscore = (string) => string.replace(/\w[A-Z]/g, (match) => `${match[0]}_${match[1].toLowerCase()}`);

export {
  transformKebabStringToCamel,
  transformUnderscoreToCamel,
  transformCamelToUnderscore,
  isValueTypeOfObject,
};
