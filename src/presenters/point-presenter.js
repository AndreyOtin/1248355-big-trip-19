import { render, RenderPosition } from '../framework/render';
import { EventType } from '../consts/observer';
import FavoriteButtonView from '../views/favorite-button-view';
import AbstractPointsPresenter from './abstracts/abstract-points-presenter';

export default class PointPresenter extends AbstractPointsPresenter {
  #favoriteButtonComponent;
  #editPointPresenter;
  #state;

  constructor({ container, Component, editPointPresenter }) {
    super();

    this.container = container;
    this.Component = Component;
    this.#editPointPresenter = editPointPresenter;
  }

  #setState(point) {
    this.#state = {
      typeOffers: this._offersModel.getOffersByType(point.type),
      destination: this._destinationsModel.getDestination(point.destination),
      destinations: this._destinationsModel.destinations,
      offerTypes: this._offersModel.offersTypes,
      point: point.totalPrice ? point : this.findPoint(point.id)
    };

    this.#state.modifiedPoint = {
      ...this.#state.point,
      offers: this._offersModel.filterOffers(point.type, point.offers),
      destination: this.#state.destination
    };
  }

  #renderFavoriteButtonComponent() {
    this.#favoriteButtonComponent = new FavoriteButtonView({
      isFavorite: this.#state.point.isFavorite,
      handleFavoriteButtonClick: this.#handleFavoriteButtonClick
    });

    render(this.#favoriteButtonComponent, this.component.favoriteContainer, RenderPosition.AFTEREND);
  }

  init(point, index) {
    this.#setState(point);

    super.init({
      point: this.#state.modifiedPoint,
      handleEditPointButtonClick: this.#handleEditPointButtonClick
    });

    this.#renderFavoriteButtonComponent();
    this.component.animate(index);
    this.render();
  }

  destroy() {
    if (!this.#editPointPresenter.isComponentDestroyed) {
      this.#handleEditViewClose();
    }

    super.destroy();
  }

  updateFavoriteButton(isFavorite) {
    this.#favoriteButtonComponent.updateElement({ isFavorite });
  }

  #handleEditPointButtonClick = () => {
    this.#editPointPresenter.init({
      state: this.#state,
      handleEditViewClose: this.#handleEditViewClose
    });

    this.replaceWith(this.#editPointPresenter.component);
  };

  #handleEditViewClose = () => {
    this.replaceWith(this.#editPointPresenter.component);
  };

  #handleFavoriteButtonClick = async () => {
    this.#state.point = {
      ...this.#state.point,
      isFavorite: !this.#state.point.isFavorite
    };

    try {
      await this._pointsModel.updatePoint(EventType.FAVORITE_BUTTON_CLICK, this.#state.point);
    } catch {
      this.component.shake();
    }
  };
}
