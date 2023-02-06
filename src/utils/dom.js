import { Code } from '../consts/dom';
import { SortType } from '../consts/app';

const isEscapeKey = (evt) => evt.code === Code.ESC;

const toggleDisabledState = (element, selector) => element.querySelectorAll(selector).forEach((el) => {
  if (el.id !== SortType.EVENT && el.id !== SortType.OFFER) {
    el.disabled = !el.disabled;
  }
});

export { isEscapeKey, toggleDisabledState };
