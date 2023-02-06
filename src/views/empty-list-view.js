import AbstractView from '../framework/view/abstract-view';
import { emptyListTypeToText } from '../consts/app';

const createEmptyListTemplate = (text) => `<p class="trip-events__msg">${text}</p>`;

export default class EmptyListView extends AbstractView {
  #text;

  constructor(type) {
    super();

    this.#text = emptyListTypeToText[type];
  }

  get template() {
    return createEmptyListTemplate(this.#text);
  }
}
