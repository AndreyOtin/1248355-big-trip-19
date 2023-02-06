import OffersModel from '../models/offers-model';
import DestinationsModel from '../models/destinations-model';
import { isEscapeKey } from '../utils/dom';
import OffersView from '../views/offers-view';
import { DescriptionPresenter } from './description-presenter';
import DescriptionView from '../views/description-view';
import { OffersPresenter } from './offers-presenter';
import { RenderPosition } from '../framework/render';
import AbstractPointsPresenter from './abstracts/abstract-points-presenter';
import { EventType } from '../consts/observer';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import { BlockTimeLimit } from '../consts/app';

export default class EditPointPresenter extends AbstractPointsPresenter {
  #offersModel = new OffersModel();
  #destinationModel = new DestinationsModel();
  #pointState;
  #handleEditViewClose;
  #descriptionPresenter;
  #offersPresenter;
  #toggleFilterDisabledState;
  #toggleSortDisabledState;
  #uiBlocker = new UiBlocker({
    lowerLimit: BlockTimeLimit.LOWER_LIMIT,
    upperLimit: BlockTimeLimit.UPPER_LIMIT
  });

  constructor({ Component, container, toggleFilterDisabledState, toggleSortDisabledState }) {
    super();

    this.container = container;
    this.Component = Component;

    this.#toggleFilterDisabledState = toggleFilterDisabledState;
    this.#toggleSortDisabledState = toggleSortDisabledState;
  }

  #renderOffers() {
    this.#offersPresenter = new OffersPresenter({
      container: this.component.childContainer,
      Component: OffersView
    });

    this.#offersPresenter.init({
      offers: this.#pointState.typeOffers,
      pickedOffers: this.#pointState.point.offers
    });

    if (this.#pointState.typeOffers.length) {
      this.#offersPresenter.render();

      return;
    }

    this.#offersPresenter.isComponentDestroyed = true;
  }

  #renderDescription() {
    this.#descriptionPresenter = new DescriptionPresenter({
      container: this.component.childContainer,
      Component: DescriptionView
    });

    this.#descriptionPresenter.init({
      ...this.#pointState.destination
    });

    if (this.#pointState.destination.description) {
      this.#descriptionPresenter.render();

      return;
    }

    this.#descriptionPresenter.isComponentDestroyed = true;
  }

  #renderChildComponents() {
    this.#renderOffers();
    this.#renderDescription();
  }

  init({ state, handleEditViewClose }) {
    if (!this.isComponentDestroyed) {
      this.destroy();
    }

    super.init({
      state,
      handleCloseButtonClick: this.#handleCloseButtonClick,
      handlePointTypeChange: this.#handlePointTypeChange,
      handleDestinationListChange: this.#handleDestinationListChange,
      handleEditPointFormSubmit: this.#handleEditPointFormSubmit,
      handleResetButtonClick: this.#handleResetButtonClick
    });

    this.#pointState = state;
    this.#handleEditViewClose = handleEditViewClose;

    this.#renderChildComponents();

    this.#toggleFilterDisabledState();
    this.#toggleSortDisabledState();

    document.addEventListener('keydown', this.#onEditPointEscKewDown);
  }

  destroy() {
    this.#handleEditViewClose?.();
    this.#toggleFilterDisabledState();
    this.#toggleSortDisabledState();
    this.component.destroyCalendars();

    super.destroy();

    document.removeEventListener('keydown', this.#onEditPointEscKewDown);
  }

  #handlePointTypeChange = (pointType) => {
    const offers = this.#offersModel.getOffersByType(pointType);
    const pickedOffers = pointType === this.#pointState.point.type ? this.#pointState.point.offers : [];

    if (offers.length) {
      this.#offersPresenter.update({ offers, pickedOffers }, RenderPosition.AFTERBEGIN);

      return;
    }

    this.#offersPresenter.destroy();

  };

  #handleDestinationListChange = (id) => {
    const destination = this.#destinationModel.getDestination(id);

    if (destination.description) {
      this.#descriptionPresenter.update(destination);

      return;
    }

    this.#descriptionPresenter.destroy();
  };

  #handleCloseButtonClick = () => {
    this.destroy();
  };

  #onEditPointEscKewDown = (evt) => {
    if (isEscapeKey(evt)) {
      this.destroy();
    }
  };

  #handleEditPointFormSubmit = async (point, isNewPoint) => {
    const newPoint = { ...point, offers: this.#offersPresenter.component.checkedOffers };

    this.#uiBlocker.block();
    this.component.setSaving();

    try {
      if (!isNewPoint) {
        await this._pointsModel.updatePoint(EventType.UPDATE_POINT, newPoint);

        this.destroy();
      } else {
        await this._pointsModel.postPoint(EventType.POST_POINT, newPoint);

        this.destroy();
      }
    } catch {
      this.component.shake();
    }

    this.component.setCanceling();
    this.#uiBlocker.unblock();
  };

  #handleResetButtonClick = async (point, isNewPoint) => {
    if (isNewPoint) {
      this.destroy();

      return;
    }

    this.#uiBlocker.block();
    this.component.setDeleting();

    try {
      await this._pointsModel.deletePoint(EventType.DELETE_POINT, point);

      this.destroy();
    } catch {
      this.component.shake();
    }

    this.component.setCanceling();
    this.#uiBlocker.unblock();
  };
}
