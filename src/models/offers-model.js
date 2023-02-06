import Observable from '../framework/observable';

export default class OffersModel extends Observable {
  #offersApiService;
  #offers;
  #offersTypes;
  #offersMap;

  constructor(offersApiService) {
    super();

    if (this.constructor.instance) {
      return this.constructor.instance;
    }

    this.constructor.instance = this;
    this.#offersApiService = offersApiService;
  }

  get offers() {
    return this.#offersMap;
  }

  get offersTypes() {
    return this.#offersTypes;
  }

  getOffersByType(type) {
    return this.#offersMap.get(type);
  }

  filterOffers(type, offers) {
    return this.#offersMap.get(type).filter((offer) => offers.includes(offer.id));
  }

  init() {
    return this.#offersApiService.offers
      .then((response) => {
        this.#offersMap = new Map(response.map((offer) => [offer.type, offer.offers]));
        this.#offers = [...this.#offersMap.values()];
        this.#offersTypes = [...this.#offersMap.keys()];
      });
  }
}
