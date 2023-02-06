import AbstractView from '../framework/view/abstract-view';
import { adaptStringsForRendering } from '../utils/adapt';

const createOffersTemplate = ({ offers, pickedOffers }) => offers.map((offer) => {
  const { title, price, id } = offer;
  const checkedState = pickedOffers.includes(id) ? 'checked' : '';

  return `
      <div class="event__offer-selector">
         <input data-id="${id}" class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${id}" type="checkbox" name="event-offer-luggage" ${checkedState}>
         <label class="event__offer-label" for="event-offer-luggage-${id}">
           <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
         </label>
      </div>

  `;
}).join('');

const createOffersListTemplate = (state) => `
 <section class="event__section  event__section--offers">
   <h3 class="event__section-title  event__section-title--offers">Offers</h3>
   <div class="event__available-offers">${createOffersTemplate(state)}</div>
 </section>
  `;

export default class OffersView extends AbstractView {
  #state;

  constructor(state) {
    super();

    this.#state = state;
  }

  get template() {
    return createOffersListTemplate(adaptStringsForRendering(this.#state));
  }

  get checkedOffers() {
    const offers = [];

    for (const element of this.element.querySelectorAll('input')) {
      if (element.checked) {
        offers.push(+element.dataset.id);
      }
    }

    return offers;
  }
}
