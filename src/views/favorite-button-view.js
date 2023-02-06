import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { ActiveButtonClassName } from '../consts/dom';

const createFavoriteButtonTemplate = (isFavorite) => `
     <button class="event__favorite-btn ${isFavorite ? ActiveButtonClassName.FAVORITE : ''}" type="button">
       <span class="visually-hidden">Add to favorite</span>
       <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
         <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
       </svg>
     </button>
  `;

export default class FavoriteButtonView extends AbstractStatefulView {
  #handleFavoriteButtonClick;

  constructor({ isFavorite, handleFavoriteButtonClick }) {
    super();

    this.#handleFavoriteButtonClick = handleFavoriteButtonClick;

    this._setState({ isFavorite });
    this._restoreHandlers();
  }

  get template() {
    return createFavoriteButtonTemplate(this._state.isFavorite);
  }

  _restoreHandlers() {
    this.element.addEventListener('click', this.#onFavoriteButtonClick);
  }

  #onFavoriteButtonClick = () => {
    this.#handleFavoriteButtonClick();
  };
}