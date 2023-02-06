import AbstractView from '../framework/view/abstract-view';

const createTripInfoTemplate = ({ title, date, totalPrice }) => `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>
        <p class="trip-info__dates">${date}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>
  `;

export default class TripInfoView extends AbstractView {
  #state;

  constructor(state) {
    super();

    this.#state = state;
  }

  get template() {
    return createTripInfoTemplate(this.#state);
  }
}
