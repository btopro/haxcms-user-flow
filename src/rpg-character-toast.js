import { css, html, unsafeCSS } from 'lit';
import { SimpleToastEl } from '@lrnwebcomponents/simple-toast/lib/simple-toast-el.js';
import { store } from "./AppHaxStore.js";
import { autorun, toJS } from "mobx";
import '@lrnwebcomponents/rpg-character/rpg-character.js';

const SpeechBubbleL = new URL('../lib/assets/images/SpeechBubbleL.svg', import.meta.url).href;
const SpeechBubbleMiddle = new URL('../lib/assets/images/SpeechBubbleMiddle.svg', import.meta.url).href;
const SpeechBubbleR = new URL('../lib/assets/images/SpeechBubbleR.svg', import.meta.url).href;
export class RPGCharacterToast extends SimpleToastEl {
  static get tag() {
    return 'rpg-character-toast';
  }

  constructor() {
    super();
    this.setDefaultToast();
    this.key = null;
    this.phrases = {};
    this.fire = false;
    this.walking = false;
    this.word = null;
    this.addEventListener('click', () => {this.opened = false;});
    autorun(() => {
      this.userName = toJS(store.user.name);
    });
    autorun(() => {
      this.darkMode = toJS(store.darkMode);
    });
  }

  static get styles() {
    return [
      ...super.styles,
      css`
      :host([opened]) {
        display: block;
      }

      :host([hidden]) {
        display: none;
      }
      :host {
        --simple-toast-bottom: 0px;
        height: 142px;
        display: none;
        width: var(--simple-toast-width, auto);
        color: var(--simple-toast-color, var(--simple-colors-default-theme-accent-12, black));
        background-color: transparent;
        top: var(--simple-toast-top);
        margin: var(--simple-toast-margin, 4px);
        padding: var(--simple-toast-padding, 4px);
        bottom: var(--simple-toast-bottom, 36px);
        right: var(--simple-toast-right, 0px);
        border: var(--simple-toast-border);
        z-index: var(--simple-toast-z-index, 10000000);
        font-size: var(--simple-toast-font-size, 40px);
        font-family: 'Press Start 2P', sans-serif;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        vertical-align: middle;
      }
      .bubble {
        height: 142px;
        display: inline-flex;
      }
      .mid {
        line-height: 142px;
        background-color: white;
        background-repeat: repeat-x;
        background-image: url('${unsafeCSS(SpeechBubbleMiddle)}');
      }
      .leftedge {
        background-image: url('${unsafeCSS(SpeechBubbleL)}');
        width: 24px;
        background-color: white;
      }
      .rightedge {
        background-image: url('${unsafeCSS(SpeechBubbleR)}');
        width: 54px;
        background-color: white;
      }
      :host([dark-mode]) .mid,
      :host([dark-mode]) .leftedge,
      :host([dark-mode]) .rightedge {
        filter: invert(1);
      }
      `];
  }

  static get properties() {
    return {
      ...super.properties,
      darkMode: {
        type: Boolean,
        reflect: true,
        attribute: 'dark-mode',
      },
      fire: { type: Boolean,},
      walking: { type: Boolean,},
      /**
       * Opened state of the toast, use event to change
       */
       opened: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Plain text based message to display
       */
      text: {
        type: String,
      },
      /**
       * Class name, fit-bottom being a useful one
       */
      classStyle: {
        type: String,
        attribute: "class-style",
      },
      /**
       * How long the toast message should be displayed
       */
      duration: {
        type: Number,
      },
      /**
       * Event callback when hide is called
       */
      eventCallback: {
        type: String,
        attribute: "event-callback",
      },
    };
  }

  render() {
    return html`
    <div class="bubble">
      <span class="bubble leftedge"></span>
      <span class="bubble mid">${this.text}</span>
      <slot></slot>
      <span class="bubble rightedge"></span>
      <rpg-character seed="${this.userName}" ?fire="${this.fire}" ?walking="${this.walking}"></rpg-character>
    </div>`;
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      "rpg-character-toast-hide",
      this.hideSimpleToast.bind(this)
    );
    window.addEventListener(
      "rpg-character-toast-show",
      this.showSimpleToast.bind(this)
    );
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    window.removeEventListener(
      "rpg-character-toast-hide",
      this.hideSimpleToast.bind(this)
    );
    window.removeEventListener(
      "rpg-character-toast-show",
      this.showSimpleToast.bind(this)
    );
    super.disconnectedCallback();
  }
  /**
   * Hide callback
   */
  hideSimpleToast() {
    this.hide();
  }
  openedChanged(e) {
    this.opened = e.detail.value;
  }
  setDefaultToast() {
    this.opened = false;
    this.text = "Saved";
    this.classStyle = "";
    this.duration = 3000;
    this.accentColor = "grey";
    this.dark = false;
    this.eventCallback = null;
    while (this.firstChild !== null) {
      this.removeChild(this.firstChild);
    }
  }
  /**
   * Show / available callback
   */
  showSimpleToast(e) {
    // establish defaults and then let event change settings
    this.setDefaultToast();
    // add your code to run when the singleton is called for
    if (e.detail.duration) {
      this.duration = e.detail.duration;
    }
    if (e.detail.fire) {
      this.fire = e.detail.fire;
    }
    if (e.detail.walking) {
      this.walking = e.detail.walking;
    }
    if (e.detail.text) {
      this.text = e.detail.text;
    }
    if (e.detail.classStyle) {
      this.classStyle = e.detail.classStyle;
    }
    if (e.detail.eventCallback) {
      this.eventCallback = e.detail.eventCallback;
    }
    if (e.detail.slot) {
      this.appendChild(e.detail.slot);
    }
    if (e.detail.accentColor) {
      this.accentColor = e.detail.accentColor;
    }
    if (e.detail.dark) {
      this.dark = e.detail.dark;
    }
    this.show();
  }
  show() {
    this.opened = true;
  }
  hide() {
    this.fire = false;
    this.walking = false;
    if (this.eventCallback) {
      const evt = new CustomEvent(this.eventCallback, {
        bubbles: true,
        cancelable: true,
        detail: true,
        composed: true,
      });
      this.dispatchEvent(evt);
    }
    this.opened = false;
  }
}
customElements.define(RPGCharacterToast.tag, RPGCharacterToast);

window.RPGToast = window.RPGToast || {};

window.RPGToast.requestAvailability = () => {
  if (!window.RPGToast.instance) {
    window.RPGToast.instance = document.createElement(RPGCharacterToast.tag);
    document.body.appendChild(window.RPGToast.instance);
  }
  return window.RPGToast.instance;
};
export const RPGToast = window.RPGToast.requestAvailability();