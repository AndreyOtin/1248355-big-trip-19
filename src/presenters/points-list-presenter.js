import PointPresenter from './point-presenter';
import { EventType } from '../consts/observer';
import EditPointPresenter from './edit-point-presenter';
import PointView from '../views/point-view';
import EditPointView from '../views/edit-point-view';
import SortView from '../views/sort-view';
import { FilterType, SortType } from '../consts/app';
import { sortPointsByDate, sortPointsByPrice, sortPointsByTime } from '../utils/sort';
import { remove, render, RenderPosition, replace } from '../framework/render';
import { filter } from '../utils/filter';
import { toggleDisabledState } from '../utils/dom';
import AbstractPointsPresenter from './abstracts/abstract-points-presenter';
import EmptyListView from '../views/empty-list-view';

export default class PointsListPresenter extends AbstractPointsPresenter {
  #points;
  #editPointPresenter;
  #sortComponent;
  #handleNewEventButtonClose;
  #toggleFilterDisabledState;
  #emptyListComponent;
  #sortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #pointPresenter = new Map();

  constructor({ container, Component, handleNewEventButtonClose, toggleFilterDisabledState }) {
    super();

    this.container = container;
    this.Component = Component;
    this.#handleNewEventButtonClose = handleNewEventButtonClose;
    this.#toggleFilterDisabledState = toggleFilterDisabledState;

    this._pointsModel.addObserver(this.#handlePointsModelEvent);
  }

  #setState() {
    this.#points = filter[this.#filterType](this.points);

    switch (this.#sortType) {
      case SortType.PRICE:
        this.#points.sort(sortPointsByPrice);
        break;
      case SortType.TIME:
        this.#points.sort(sortPointsByTime);
        break;
      default:
        this.#points.sort(sortPointsByDate);
    }
  }

  #clearList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #renderList() {
    this.#setState();
    this.#handleEmptyList();

    if (!this.#points.length && this.#sortComponent) {
      remove(this.#sortComponent);

      return;
    }

    this.#renderPoints();
  }

  #renderPoint(point, index) {
    const pointPresenter = new PointPresenter({
      container: this.component.element,
      Component: PointView,
      editPointPresenter: this.#editPointPresenter
    });

    pointPresenter.init(point, index);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.#points.forEach((point, index) => this.#renderPoint(point, index));
  }

  #renderSort() {
    this.#sortComponent = new SortView({ handleSortButtonClick: this.#handleSortButtonClick });

    render(this.#sortComponent, this.component.element, RenderPosition.BEFOREBEGIN);
  }

  #updatePointFavoriteButton(point) {
    this.#pointPresenter.get(point.id).updateFavoriteButton(point.isFavorite);
  }

  #deletePoint(point) {
    this.#pointPresenter.get(point.id).destroy();
    this.#pointPresenter.delete(point.id);
    this.#handleEditViewClose();
  }

  #resetSort() {
    if (this.#sortComponent) {
      this.#sortType = SortType.DAY;
      this.#sortComponent.element.reset();
    }
  }

  #toggleSortDisabledState = () => {
    if (this.#sortComponent) {
      toggleDisabledState(this.#sortComponent.element, 'input');
    }
  };

  init() {
    super.init();
    this.render();

    this.#editPointPresenter = new EditPointPresenter({
      container: this.component.element,
      Component: EditPointView,
      toggleSortDisabledState: this.#toggleSortDisabledState,
      toggleFilterDisabledState: this.#toggleFilterDisabledState
    });

    this.#setState();
    this.#handleEmptyList();

    if (!this.#points.length) {
      return;
    }

    this.#renderSort();
    this.#renderPoints();
  }

  initNewEvent() {
    this.#filterType = FilterType.EVERYTHING;

    this.#resetSort();

    this.#editPointPresenter.init({
      state: this.newEditPoint,
      handleEditViewClose: this.#handleEditViewClose
    });

    if (!this.points.length || this.isComponentReplaced) {
      this.replaceWith(this.#emptyListComponent);
      this.#renderSort();
    }

    this.#editPointPresenter.render(RenderPosition.AFTERBEGIN);
  }

  handleFilterChange(filterType) {
    this.#filterType = filterType;

    this.#resetSort();
    this.#clearList();
    this.#renderList();
  }

  #handleSortButtonClick = (sortType) => {
    if (sortType === this.#sortType) {
      return;
    }

    this.#sortType = sortType;

    this.#clearList();
    this.#renderList();
  };

  #handleEditViewClose = () => {
    this.#handleNewEventButtonClose();

    if (!this.points.length) {
      this.#emptyListComponent = new EmptyListView(this.#filterType);

      this.replaceWith(this.#emptyListComponent);

      remove(this.#sortComponent);

      return;
    }

    this.#clearList();
    this.#renderList();
  };

  #handleEmptyList() {
    if (!this.#points.length && this.isComponentReplaced) {
      const prevEmptyList = this.#emptyListComponent;

      this.#emptyListComponent = new EmptyListView(this.#filterType);

      replace(this.#emptyListComponent, prevEmptyList);

      return;
    }

    if (this.#points.length && this.isComponentReplaced) {
      this.replaceWith(this.#emptyListComponent);

      this.#renderSort(true);

      return;
    }

    if (!this.#points.length) {
      this.#emptyListComponent = new EmptyListView(this.#filterType);

      this.replaceWith(this.#emptyListComponent);
    }
  }

  #handlePointsModelEvent = (event, payload) => {
    switch (event) {
      case EventType.FAVORITE_BUTTON_CLICK:
        this.#updatePointFavoriteButton(payload);
        break;
      case EventType.DELETE_POINT:
        this.#deletePoint(payload);
        break;
      case EventType.POST_POINT:
      case EventType.UPDATE_POINT:
        this.#clearList();
        this.#renderList();
        break;
      default:
        break;
    }
  };
}
