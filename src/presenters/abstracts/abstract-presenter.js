import { remove, render, RenderPosition, replace } from '../../framework/render';

export default class AbstractPresenter {
  #Component;
  #container;
  #component;
  #isComponentDestroyed = true;
  #isComponentReplaced = false;

  constructor() {
    if (new.target === AbstractPresenter) {
      throw new Error('Can\'t instantiate AbstractPresenter only concrete one.');
    }
  }

  get Component() {
    return this.#Component;
  }

  set Component(Component) {
    this.#Component = Component;
  }

  get component() {
    return this.#component;
  }

  set component(component) {
    this.#component = component;
  }

  get isComponentDestroyed() {
    return this.#isComponentDestroyed;
  }

  set isComponentDestroyed(value) {
    this.#isComponentDestroyed = value;
  }

  get isComponentReplaced() {
    return this.#isComponentReplaced;
  }

  get container() {
    return this.#container;
  }

  set container(container) {
    this.#container = container;
  }

  render(renderPosition = RenderPosition.BEFOREEND) {
    this.#isComponentDestroyed = false;

    render(this.#component, this.#container, renderPosition);
  }

  init(options) {
    this.#isComponentDestroyed = false;

    this.component = new this.Component(options);
  }

  update(options, renderPosition = RenderPosition.BEFOREEND) {
    const prevComponent = this.component;

    this.component = new this.Component(options);

    if (this.isComponentDestroyed) {
      this.render(renderPosition);

      return;
    }

    replace(this.component, prevComponent);
  }

  destroy() {
    this.#isComponentDestroyed = true;

    remove(this.#component);
  }

  replaceWith(component) {
    if (this.#isComponentReplaced) {
      this.#isComponentReplaced = false;

      replace(this.#component, component);

      return;
    }

    this.#isComponentReplaced = true;

    replace(component, this.#component);
  }
}
