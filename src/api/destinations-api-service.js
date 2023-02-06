import ApiService from '../framework/api-service';

export default class DestinationsApiService extends ApiService{
  constructor(...args) {
    super(...args);
  }

  get destinations(){
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }
}
