import PointsListPresenter from './points-list-presenter';
import PointsListView from '../views/points-list-view';
import TripInfoView from '../views/trip-info-view';
import { remove, render } from '../framework/render';
import FilterView from '../views/filter-view';
import { FilterType } from '../consts/app';
import { toggleDisabledState } from '../utils/dom';
import { TripInfoPresenter } from './trip-info-presenter';
import EmptyListView from '../views/empty-list-view';

export default class AppPresenter {
  #pointsListPresenter;
  #filterComponent;
  #container;
  #element;
  #tripInfoPresenter;
  #emptyListComponent;
  #filterType = FilterType.EVERYTHING;

  constructor({ container, element }) {
    this.#container = container;
    this.#element = element;
  }

  #renderEventPoints() {
    this.#pointsListPresenter = new PointsListPresenter({
      container: this.#container.tripEvents,
      Component: PointsListView,
      handleNewEventButtonClose: this.#handleNewEventButtonClose,
      toggleFilterDisabledState: this.#toggleFilterDisabledState
    });

    this.#pointsListPresenter.init();
  }

  #renderTripInfo() {
    this.#tripInfoPresenter = new TripInfoPresenter({
      container: this.#container.tripInfo,
      Component: TripInfoView
    });

    this.#tripInfoPresenter.init();
  }

  #renderFilterFilter() {
    this.#filterComponent = new FilterView({ handleFilterButtonClick: this.#handleFilterButtonClick });
    render(this.#filterComponent, this.#container.filters);
  }

  #destroyEmptyList() {
    remove(this.#emptyListComponent);

    this.#emptyListComponent = null;
  }

  #renderApp() {
    this.#renderEventPoints();
    this.#renderTripInfo();
  }

  #resetFilter() {
    this.#filterComponent.element.reset();

    this.#filterType = FilterType.EVERYTHING;
  }

  #renderEmptylist(type) {
    this.#emptyListComponent = new EmptyListView(type);

    render(this.#emptyListComponent, this.#container.tripEvents);
  }

  #toggleFilterDisabledState = () => {
    toggleDisabledState(this.#filterComponent.element, 'input');
  };

  init(isLoading) {
    if (isLoading) {
      this.#renderFilterFilter();
      this.#renderEmptylist('loading');
      this.#toggleFilterDisabledState();

      return;
    }

    this.#toggleFilterDisabledState();
    this.#destroyEmptyList();
    this.#renderApp();

    this.#element.newEventButton.addEventListener('click', this.#onNewEventButtonClick);
  }

  #onNewEventButtonClick = () => {
    this.#resetFilter();

    this.#element.newEventButton.disabled = true;

    this.#pointsListPresenter.initNewEvent();
  };

  #handleNewEventButtonClose = () => {
    this.#element.newEventButton.disabled = false;
  };

  #handleFilterButtonClick = (filterType) => {
    if (filterType === this.#filterType) {
      return;
    }

    this.#filterType = filterType;

    this.#tripInfoPresenter.handleFilterChange(filterType);
    this.#pointsListPresenter.handleFilterChange(filterType);
  };
}
