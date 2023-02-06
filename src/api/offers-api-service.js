import ApiService from '../framework/api-service';

export default class OffersApiService extends ApiService{
  constructor(...args) {
    super(...args);
  }

  get offers(){
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }
}
