import Observable from '../framework/observable';
import { adaptToClient } from '../utils/adapt';
import { EventType } from '../consts/observer';

export default class PointsModel extends Observable {
  #pointsApiService;
  #pointsMap = [];
  #points = [];

  constructor(pointsApiService) {
    super();

    if (this.constructor.instance) {
      return this.constructor.instance;
    }

    this.constructor.instance = this;
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  updatePoint(event, point) {
    delete point['totalPrice'];

    return this.#pointsApiService.updatePoint(point)
      .then((response) => {
        const adaptedPoint = adaptToClient(response);

        this.#pointsMap.set(response.id, adaptedPoint);

        this.#points = [...this.#pointsMap.values()];

        this._notify(EventType.UPDATE_DATA, null);
        this._notify(event, adaptedPoint);
      });

  }

  postPoint(event, point) {
    delete point['totalPrice'];

    return this.#pointsApiService.postPoint(point)
      .then((response) => {
        const adaptedPoint = adaptToClient(response);

        this.#pointsMap.set(adaptedPoint.id, adaptedPoint);

        this.#points = [...this.#pointsMap.values()];

        this._notify(EventType.UPDATE_DATA, null);
        this._notify(event, point);
      });
  }

  deletePoint(event, point) {
    delete point['totalPrice'];

    return this.#pointsApiService.deletePoint(point)
      .then(() => {
        this.#pointsMap.delete(point.id);

        this.#points = [...this.#pointsMap.values()];

        this._notify(EventType.UPDATE_DATA, null);
        this._notify(event, point);
      });
  }

  init() {
    return this.#pointsApiService.points
      .then((response) => {
        this.#pointsMap = new Map(response.map((point) => [point.id, adaptToClient(point)]));
        this.#points = [...this.#pointsMap.values()];
      });
  }
}
