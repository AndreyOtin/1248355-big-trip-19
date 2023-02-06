import AbstractPresenter from './abstracts/abstract-presenter';

export class DescriptionPresenter extends AbstractPresenter {
  constructor({ container, Component }) {
    super();

    this.container = container;
    this.Component = Component;
  }

  init(destination) {
    super.init(destination);
  }
}
