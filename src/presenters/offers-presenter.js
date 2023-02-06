import AbstractPresenter from './abstracts/abstract-presenter';

export class OffersPresenter extends AbstractPresenter {
  constructor({ container, Component }) {
    super();

    this.container = container;
    this.Component = Component;
  }

  init(options) {
    super.init(options);
  }
}
