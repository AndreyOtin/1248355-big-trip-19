import AbstractView from '../framework/view/abstract-view';
import { adaptStringsForRendering } from '../utils/adapt';

const createImagesTemplate = (images) => images.map(({
  src,
  description
}) => `<img class="event__photo" src="${src}" alt="${description}">`).join('');

const createDescriptionTemplate = ({ description, pictures }) => `
  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${createImagesTemplate(pictures)}
      </div>
    </div>
  </section>
`;

export default class DescriptionView extends AbstractView {
  #state;

  constructor(state) {
    super();

    this.#state = state;
  }

  get template() {
    return createDescriptionTemplate(adaptStringsForRendering(this.#state));
  }
}
