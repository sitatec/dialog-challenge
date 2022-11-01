class Dialog {
  static _id = 0; // To uniquely identify a dialog and prevent conflict between instances.

  static confirm() {
    return new Promise((resolve, _) => {
      const positiveAction = new DialogAction({
        text: "Yes",
        style: "success",
      });

      const negativeAction = new DialogAction({
        text: "Cancel",
        style: "critical",
      });
      const dialog = new Dialog({
        message: "Are you sure you want to continue?",
        actions: [positiveAction, negativeAction],
      });

      positiveAction.onClick = () => {
        resolve(true);
        dialog.hide();
      };

      negativeAction.onClick = () => {
        resolve(false);
        dialog.hide();
      };

      dialog.show();
    });
  }

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

    const dialogHtml = htmlElementFromString(`
      <div id="modal${this.id}" class="modal">
        <div class="dialog">
          <div class="dialog-content">
             ${this.options.message}
            <div class="dialog-actions">
            </div>
          </div>
        </div>
      </div>
    `);

    const dialogActionsContainer = dialogHtml.getElementsByClassName("dialog-actions").item(0);
    dialogActions.forEach(action => {
      dialogActionsContainer.appendChild(action);
    });
    return dialogHtml;
  }

  _buildDialogActions() {
    const actions = this.options.actions;
    if (actions) {
      return actions.map(action => action.toHtmlElement());
    }
    return [];
  }

  hide(destroyDialog = true) {
    if (destroyDialog) {
      this.destroy();
    } else {
      this._htmlElement.style.display = "none";
    }
  }

  destroy() {
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
    htmlElement.addEventListener("click", (e) => {
      console.log("KKK",htmlElement);

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

function htmlElementFromString(htmlString) {
  const element = document.createElement("template");
  element.innerHTML = htmlString.trim();
  return element.content.firstElementChild;
}
