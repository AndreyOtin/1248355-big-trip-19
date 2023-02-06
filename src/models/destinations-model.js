import Observable from '../framework/observable';

export default class DestinationsModel extends Observable {
  #destinationApiService;
  #destinationsMap;
  #destinations;

  constructor(destinationApiService) {
    super();

    if (this.constructor.instance) {
      return this.constructor.instance;
    }

    this.constructor.instance = this;
    this.#destinationApiService = destinationApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  getDestination(id) {
    return this.#destinationsMap.get(id);
  }

  init() {
    return this.#destinationApiService.destinations
      .then((response) => {
        this.#destinationsMap = new Map(response.map((destination) => [destination.id, destination]));
        this.#destinations = [...this.#destinationsMap.values()];
      });
  }
}
