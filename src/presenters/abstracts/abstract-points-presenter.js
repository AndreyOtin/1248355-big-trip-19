import AbstractPresenter from './abstract-presenter';
import { defaultPoint } from '../../consts/app';
import DestinationsModel from '../../models/destinations-model';
import OffersModel from '../../models/offers-model';
import PointsModel from '../../models/points-model';
import { EventType } from '../../consts/observer';

export default class AbstractPointsPresenter extends AbstractPresenter {
  #points;
  #totalPointsPrice;
  _destinationsModel = new DestinationsModel();
  _offersModel = new OffersModel();
  _pointsModel = new PointsModel();

  constructor() {
    super();

    if (new.target === AbstractPointsPresenter) {
      throw new Error('Can\'t instantiate AbstractFilmsPresenter, only concrete one.');
    }

    this.#updatePoints(EventType.UPDATE_DATA);

    this._pointsModel.addObserver(this.#updatePoints);
  }

  get points() {
    return this.#points;
  }

  set points(value) {
    this.#points = value;
  }

  get totalPointsPrice() {
    return this.#totalPointsPrice;
  }

  get newEditPoint() {
    return {
      typeOffers: [],
      destination: { description: '', name: '' },
      destinations: this._destinationsModel.destinations,
      offerTypes: this._offersModel.offersTypes,
      point: defaultPoint
    };
  }

  #updatePoints = (event) => {
    if (event !== EventType.UPDATE_DATA) {
      return;
    }

    this.#totalPointsPrice = 0;

    this.#points = this._pointsModel.points.map((point) => {
      const offers = this._offersModel.filterOffers(point.type, point.offers);
      const totalPrice = offers.reduce((sum, offer) => offer.price + sum, point.basePrice);

      this.#totalPointsPrice += totalPrice;

      return {
        ...point,
        totalPrice
      };
    });
  };

  findPoint(id) {
    return this.#points.find((point) => +point.id === +id);
  }

  destroy() {
    super.destroy();

    this._pointsModel.removeObserver(this.#updatePoints);
  }
}
