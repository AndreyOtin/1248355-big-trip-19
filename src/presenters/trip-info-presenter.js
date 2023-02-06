import { RenderPosition } from '../framework/render';
import AbstractPointsPresenter from './abstracts/abstract-points-presenter';
import { sortPointsByDate } from '../utils/sort';
import dayjs from 'dayjs';
import { MAX_DISPLAYED_CITIES_COUNT } from '../consts/app';
import { EventType } from '../consts/observer';

export class TripInfoPresenter extends AbstractPointsPresenter {
  #state = {};

  constructor({ container, Component }) {
    super();

    this.container = container;
    this.Component = Component;

    this._pointsModel.addObserver(this.#handleModelEvent);
  }

  #getDestinationNameAtIndex(index) {
    return this._destinationsModel.getDestination(this.points.at(index).destination).name;
  }

  #setPrice() {
    this.#state.totalPrice = this.totalPointsPrice;
  }

  #setTitle() {
    if (this.points.length > MAX_DISPLAYED_CITIES_COUNT) {
      const firstDestinationName = this.#getDestinationNameAtIndex(0);
      const lastDestinationName = this.#getDestinationNameAtIndex(-1);

      this.#state.title = `${firstDestinationName} &mdash; ... &mdash; ${lastDestinationName}`;

      return;
    }

    this.#state.title = this.points.map((point, index) => this.#getDestinationNameAtIndex(index)).join('&mdash;');
  }

  #setDates() {
    const startDate = this.points.at(0) ? dayjs(this.points.at(0).dateFrom).format('DD MMM') : '';
    const endDate = this.points.at(-1) ? dayjs(this.points.at(-1).dateTo).format('DD MMM') : '';

    this.#state.date = startDate && endDate ? `${startDate}&mdash;${endDate}` : '';
  }

  #setAll() {
    this.points.sort(sortPointsByDate);

    this.#setPrice();
    this.#setTitle();
    this.#setDates();
  }

  update(options, renderPosition = RenderPosition.BEFOREEND) {
    this.#setAll();

    super.update(options, renderPosition);
  }

  init() {
    this.#setAll();

    super.init(this.#state);

    this.render(RenderPosition.AFTERBEGIN);
  }

  #handleModelEvent = (event) => {
    if (event === EventType.UPDATE_DATA) {
      return;
    }

    this.update(this.#state, RenderPosition.AFTERBEGIN);
  };
}
