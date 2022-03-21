import { SimpleColors } from '@lrnwebcomponents/simple-colors/simple-colors';
import '@lrnwebcomponents/simple-icon';
import { html, css } from 'lit';

export class HAXCMSPortfolioButton extends SimpleColors {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return 'haxcms-profolio-button';
  }

  constructor() {
    super();
    this.type = '';
    this.value = null;
    this.disabled = false;
    this.elevation = '3';
  }

  static get properties() {
    return {
      icon: { type: String },
      type: { type: String, reflect: true },
      value: { type: String },
      disabled: { type: Boolean, reflect: true },
      elevation: { type: Number },
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'type') {
        switch (this.type) {
          case 'Technology':
            this.icon = 'hardware:desktop-mac';
            break;
          case 'Business':
            this.icon = 'maps:local-atm';
            break;
          case 'Art':
            this.icon = 'image:palette';
            break;
          default:
            this.icon = 'image:photo-filter';
            this.type = 'Create Your Own';
            break;
        }
      }
    });
  }

  // HTMLElement life-cycle, element has been connected to the page / added or moved
  // this fires EVERY time the element is moved
  connectedCallback() {
    super.connectedCallback();
  }

  // HTMLElement life-cycle, element has been removed from the page OR moved
  // this fires every time the element moves
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  static get styles() {
    return css`
      :host {
        background-color: white;
        font-family: 'Press Start 2P', cursive;
        width: 132px;
        height: 112px;
      }
      .haxButton {
        background-color: white;
        color: black;
        width: 132px;
        height: 112px;
      }
      simple-icon {
        --simple-icon-width: 60px;
        --simple-icon-height: 60px;
        --simple-icon-color: black;
      }
      p {
        font-size: 10px;
        color: black;
      }
    `;
  }

  render() {
    return html`
      <div>
        <wired-button
          elevation=${this.elevation}
          ?disabled=${this.disabled}
          class="haxButton"
        >
          <simple-icon icon=${this.icon}> </simple-icon>

          <p>${this.type}</p>
        </wired-button>
      </div>
    `;
  }

  static get haxProperties() {
    return new URL(`../lib/app.haxProperties.json`, import.meta.url).href;
  }
}
