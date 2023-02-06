import ApiService from '../framework/api-service';
import { Method } from '../consts/api';
import { adaptToServer } from '../utils/adapt';

export default class PointsApiService extends ApiService {
  constructor(...args) {
    super(...args);
  }

  get points() {
    return this._load({ url: 'points' })
      .then(ApiService.parseResponse);
  }

  updatePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
      .then(ApiService.parseResponse);
  }

  postPoint(point) {
    return this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
      .then(ApiService.parseResponse);
  }

  deletePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.DELETE
    });
  }
}
