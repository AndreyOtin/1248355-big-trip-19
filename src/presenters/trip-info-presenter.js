import { RenderPosition } from '../framework/render';
import AbstractPointsPresenter from './abstracts/abstract-points-presenter';
import { sortPointsByDate } from '../utils/sort';
import dayjs from 'dayjs';
import { FilterType, MAX_DISPLAYED_CITIES_COUNT } from '../consts/app';
import { EventType } from '../consts/observer';
import { filter } from '../utils/filter';

export class TripInfoPresenter extends AbstractPointsPresenter {
  #state = {};
  #filterType = FilterType.EVERYTHING;
  #filteredPoints = [];

  constructor({ container, Component }) {
    super();

    this.container = container;
    this.Component = Component;

    this._pointsModel.addObserver(this.#handleModelEvent);
  }

  #getDestinationNameAtIndex(index) {
    return this._destinationsModel.getDestination(this.#filteredPoints.at(index).destination).name;
  }

  #setPrice() {
    this.#state.totalPrice = this.#filteredPoints.reduce((sum, point) => point.totalPrice + sum, 0);
  }

  #setTitle() {
    if (this.#filteredPoints.length > MAX_DISPLAYED_CITIES_COUNT) {
      const firstDestinationName = this.#getDestinationNameAtIndex(0);
      const lastDestinationName = this.#getDestinationNameAtIndex(-1);

      this.#state.title = `${firstDestinationName} &mdash; ... &mdash; ${lastDestinationName}`;

      return;
    }

    this.#state.title = this.#filteredPoints.map((point, index) => this.#getDestinationNameAtIndex(index)).join('&mdash;');
  }

  #setDates() {
    const startDate = this.#filteredPoints.at(0) ? dayjs(this.#filteredPoints.at(0).dateFrom).format('DD MMM') : '';
    const endDate = this.#filteredPoints.at(-1) ? dayjs(this.#filteredPoints.at(-1).dateTo).format('DD MMM') : '';

    this.#state.date = startDate && endDate ? `${startDate}&mdash;${endDate}` : '';
  }

  #setAll() {
    this.#filteredPoints = filter[this.#filterType](this.points);

    this.#filteredPoints.sort(sortPointsByDate);

    this.#setPrice();
    this.#setTitle();
    this.#setDates();
  }

  update(options = this.#state, renderPosition = RenderPosition.AFTERBEGIN) {
    this.#setAll();

    super.update(options, renderPosition);
  }

  init() {
    this.#setAll();

    super.init(this.#state);

    this.render(RenderPosition.AFTERBEGIN);
  }

  handleFilterChange(filterType) {
    this.#filterType = filterType;

    this.update();
  }

  #handleModelEvent = (event) => {
    if (event === EventType.UPDATE_DATA) {
      return;
    }

    this.update();
  };
}
