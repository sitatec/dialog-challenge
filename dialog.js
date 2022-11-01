class Dialog {
  static _id = 0; // To uniquely identify a dialog and prevent conflict between instances.

  /**
   * Options:
   * {
   * 
   *  actions: DialogActions[],
   * 
   *  message: String
   * 
   * }
   */
  constructor(options) {
    this.options = options;
    this.id = Dialog._id++;
  }

  show() {
    if (this._htmlElement) {
      this._htmlElement.style.display = "block";
    } else {
      this._htmlElement = this._buildDialogHtml();
      document.body.appendChild(this._htmlElement);
    }
  }

  _buildDialogHtml() {
    const dialogActions = this._buildDialogActions();

    return htmlElementFromString(`
      <div id="modal${this.id}" class="modal">
        <div class="dialog">
          <div class="dialog-content">
             ${this.options.message}
            <div class="dialog-actions">
              ${dialogActions}
            </div>
          </div>
        </div>
      </div>
    `);
  }

  _buildDialogActions() {
    const actions = this.options.actions;
    if (actions) {
      return actions.map(action => action.toString("html")).join("\n");
    }
    return "";
  }

  hide(destroyDialog = true) {
    if (destroyDialog) {
      this.destroy();
    } else {
      this._htmlElement.style.display = "none";
    }
  }

  destroy(){
    document.body.removeChild(this._htmlElement);
    this._htmlElement = null;
  }

}

class DialogAction {

  /**
   * Options:
   * {
   * 
   *  text: string
   * 
   *  style: "info" | "critical" | "success",
   * 
   *  onClick: () -> void
   * 
   * }
   */
  constructor(options) {
    this.options = options;
  }

  toHtmlElement() {
    const htmlElement = htmlElementFromString(this._getHtmlString());
    htmlElement.addEventListener("click", () => {
      this.options.onClick && this.options.onClick();
    });

    return htmlElement;
  }
  
  _getHtmlString() {
    return `
    <button class="button ${this.options.style ?? "info"}">
      ${this.options.text}
    </button>
  `;
  }
    
  toString(stringType) {
    if (stringType == "html") {
      return this.toHtmlElement().outerHTML;
    }
    return `ModalAction:\n ${JSON.stringify(this)}`;
  }

}

function htmlElementFromString(htmlString){
  const element = document.createElement('template');
  element.innerHTML = htmlString.trim();
  return element.content.firstElementChild;
}
