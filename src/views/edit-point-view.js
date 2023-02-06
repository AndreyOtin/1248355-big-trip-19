import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { adaptStringsForRendering } from '../utils/adapt';
import { makeFirstLetterUpperCase } from '../utils/format';
import { transformKebabStringToCamel } from '../utils/common';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const createEventTypeTemplate = (types) => types.map((type) => `
     <div class="event__type-item">
       <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
       <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${makeFirstLetterUpperCase(type)}</label>
     </div>
    `).join('');

const createDestinationOptionsTemplate = (destinations) => destinations.map((destination) => `
    <option data-id="${destination.id}" value="${destination.name}"></option>`).join('');

const createEditPointViewTemplate = (state) => {
  const { destination, point, offerTypes, destinations, isNewPoint } = state;

  return `
    <li class="trip-events__item">
     <form class="event event--edit" action="#" method="post">
       <header class="event__header">
         <div class="event__type-wrapper">
           <label class="event__type  event__type-btn" for="event-type-toggle-1">
             <span class="visually-hidden">Choose event type</span>
             <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type || 'taxi'}.png" alt="Event type icon">
           </label>
           <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

           <div class="event__type-list">
             <fieldset class="event__type-group">
               <legend class="visually-hidden">Event type</legend>
               ${createEventTypeTemplate(offerTypes)}
             </fieldset>
           </div>
         </div>

         <div class="event__field-group  event__field-group--destination">
           <label class="event__label  event__type-output" for="event-destination-1">
             ${point.type}
           </label>
           <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination?.name}" list="destination-list-1">
           <datalist id="destination-list-1">
             ${createDestinationOptionsTemplate(destinations)}
           </datalist>
         </div>

         <div class="event__field-group  event__field-group--time">
           <label class="visually-hidden" for="event-start-time-1">From</label>
           <input data-id="date-from" class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${point.dateFrom ? point.dateFrom.toJSON() : ''}">
           &mdash;
           <label class="visually-hidden" for="event-end-time-1">To</label>
           <input data-id="date-to" class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${point.dateTo ? point.dateTo.toJSON() : ''}">
         </div>

         <div class="event__field-group  event__field-group--price">
           <label class="event__label" for="event-price-1">
             <span class="visually-hidden">Price</span>
             &euro;
           </label>
           <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}">
         </div>

         <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
         <button class="event__reset-btn" type="reset">${isNewPoint ? 'Cancel' : 'Delete'}</button>
         <button class="event__rollup-btn" type="button">
           <span class="visually-hidden">Open event</span>
         </button>
       </header>
       <section class="event__details"></section>
     </form>
    </li>
  `;
};

export default class EditPointView extends AbstractStatefulView {
  #handleCloseButtonClick;
  #handlePointTypeChange;
  #handleDestinationListChange;
  #calendars;
  #handleEditPointFormSubmit;
  #handleResetButtonClick;
  #saveButtonElement;
  #resetButtonElement;
  #formElement;

  constructor({
    state,
    handleCloseButtonClick,
    handlePointTypeChange,
    handleDestinationListChange,
    handleEditPointFormSubmit,
    handleResetButtonClick
  }) {
    super();

    this.#handleCloseButtonClick = handleCloseButtonClick;
    this.#handlePointTypeChange = handlePointTypeChange;
    this.#handleDestinationListChange = handleDestinationListChange;
    this.#handleResetButtonClick = handleResetButtonClick;
    this.#handleEditPointFormSubmit = handleEditPointFormSubmit;

    this._setState({ ...state, isNewPoint: !state.point.id });
    this._restoreHandlers();
  }

  get template() {
    return createEditPointViewTemplate(adaptStringsForRendering(this._state));
  }

  get childContainer() {
    return this.element.querySelector('.event__details');
  }

  _restoreHandlers() {
    this.#saveButtonElement = this.element.querySelector('.event__save-btn');
    this.#resetButtonElement = this.element.querySelector('.event__reset-btn');
    this.#formElement = this.element.querySelector('form');

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onCloseButtonClick);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#onPointTypeChange);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#onDestinationListChange);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#onPriceChange);
    this.#resetButtonElement.addEventListener('click', this.#onResetButtonClick);
    this.#formElement.addEventListener('submit', this.#onEditPointFormSubmit);

    this.#setCalendars();
  }

  #setCalendars() {
    this.#calendars = flatpickr(this.element.querySelectorAll('.event__input--time'), {
      'time_24hr': true,
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      onClose: this.#onCalendarClose
    });
  }

  setSaving() {
    this.#saveButtonElement.textContent = 'Saving';
    this.#formElement.disabled = true;
  }

  setDeleting() {
    this.#resetButtonElement.textContent = 'Deleting';
    this.#formElement.disabled = true;
  }

  setCanceling() {
    this.#formElement.disabled = false;
    this.#saveButtonElement.textContent = 'Save';
    this.#resetButtonElement.textContent = 'Delete';
  }

  destroyCalendars() {
    this.#calendars.forEach((calendar) => calendar.destroy());
  }

  #onCloseButtonClick = () => {
    this.#handleCloseButtonClick();
  };

  #onCalendarClose = ([date], str, { element }) => {
    const key = transformKebabStringToCamel(element.dataset.id);
    const isFromCalendar = element.dataset.id === this.#calendars[0].element.dataset.id;

    this._setState({ point: { ...this._state.point, [key]: date } });

    const isToCalendarWrong = dayjs(this._state.point.dateTo).isBefore(dayjs(this._state.point.dateFrom));

    if (isFromCalendar) {
      this.#calendars[1].set('minDate', date);
    }

    if (isToCalendarWrong) {
      this._setState({ point: { ...this._state.point, dateTo: this._state.point.dateFrom } });

      this.#calendars[1].setDate(this._state.point.dateFrom);
    }
  };

  #onDestinationListChange = (evt) => {
    for (const listItem of evt.target.list.children) {
      if (listItem.value === evt.target.value) {
        this._setState({ point: { ...this._state.point, destination: +listItem.dataset.id } });

        this.#handleDestinationListChange(+listItem.dataset.id);

        return;
      }
    }

    evt.target.value = 'No such destination';
  };

  #onPointTypeChange = (evt) => {
    this.element.querySelector('img').src = `img/icons/${evt.target.value}.png`;
    this.element.querySelector('.event__type-output').textContent = evt.target.value;

    this._setState({ point: { ...this._state.point, type: evt.target.value } });

    this.#handlePointTypeChange(evt.target.value);
  };

  #onEditPointFormSubmit = (evt) => {
    evt.preventDefault();
    this.#handleEditPointFormSubmit(this._state.point, this._state.isNewPoint);
  };

  #onResetButtonClick = (evt) => {
    evt.preventDefault();
    this.#handleResetButtonClick(this._state.point, this._state.isNewPoint);
  };

  #onPriceChange = (evt) => {
    this._setState({ point: { ...this._state.point, basePrice: +evt.target.value } });
  };
}
