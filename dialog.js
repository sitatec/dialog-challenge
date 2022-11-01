export class Dialog {
  static _id = 0; // To uniquely identify a dialog and prevent conflict between instances.

  /**
   * Options:
   * {
   *  actions: ModalActions[],
   *  message: String
   * }
   */
  constructor(options) {
    this.options = options;
  }

  show() {}

  hide() {}
}
