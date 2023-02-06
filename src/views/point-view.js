import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { formatDate, formatDuration, makeFirstLetterUpperCase } from '../utils/format';
import { DateFormat, TimeFormat } from '../consts/dayjs-formats';
import { adaptStringsForRendering } from '../utils/adapt';

const createOffersTemplate = (offers) => offers.map(({ title, price }) => `
    <li class="event__offer">
         <span class="event__offer-title">${title}</span>
         +€&nbsp;
         <span class="event__offer-price">${price}</span>
       </li>
    `).join('');

const createPointViewTemplate = (state) => {
  const { id, dateFrom, dateTo, offers, destination, type, totalPrice } = state;

  const formattedDate = formatDate(dateFrom, DateFormat.MONTH_AND_DAY);
  const formattedDateTo = formatDate(dateTo, TimeFormat.DEFAULT);
  const formattedDateFrom = formatDate(dateFrom, TimeFormat.DEFAULT);
  const eventDuration = formatDuration({ to: dateTo, from: dateFrom });
  const formattedType = makeFirstLetterUpperCase(type);

  const offersTemplate = createOffersTemplate(offers);

  return `
    <li data-id="${id}" class="trip-events__item">
       <div class="event">
         <time class="event__date" datetime="${dateFrom}">${formattedDate}</time>
         <div class="event__type">
           <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
         </div>
         <h3 class="event__title">${formattedType} ${destination.name}</h3>
         <div class="event__schedule">
           <p class="event__time">
             <time class="event__start-time" datetime="${dateFrom || ''}">${formattedDateFrom}</time>
             &mdash;
             <time class="event__end-time" datetime="${dateTo || ''}">${formattedDateTo}</time>
           </p>
           <p class="event__duration">${eventDuration || ''}</p>
         </div>
         <p class="event__price">
           &euro;&nbsp;<span class="event__price-value">${totalPrice || 0}</span>
         </p>
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">${offersTemplate}</ul>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
       </div>
    </li>
  `;
};

export default class PointView extends AbstractStatefulView {
  #point;
  #handleEditPointButtonClick;

  constructor({ point, handleEditPointButtonClick }) {
    super();

    this.#point = point;
    this.#handleEditPointButtonClick = handleEditPointButtonClick;

    this._setState(this.#point);
    this._restoreHandlers();
  }

  get template() {
    return createPointViewTemplate(adaptStringsForRendering(this._state));
  }

  get favoriteContainer() {
    return this.element.querySelector('.event__selected-offers');
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onEditPointButtonClick);
  }

  #onEditPointButtonClick = () => {
    this.#handleEditPointButtonClick();
  };

  animate(index) {
    this.element.animate({
      opacity: [0, 1],
      transform: ['translate(0, -50px)', 'none']
    },
    {
      duration: 1000,
      easing: 'ease',
      fill: 'both',
      delay: 50 * index
    });
  }
}
