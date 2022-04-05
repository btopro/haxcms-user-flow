/* eslint-disable lit/attribute-value-entities */
/* eslint-disable lit/binding-positions */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable class-methods-use-this */
import { html, css } from 'lit';
import 'scrollable-component/index.js';
import { autorun, toJS } from 'mobx';
import './AppHaxRouter.js';
import { SimpleColors } from '@lrnwebcomponents/simple-colors/simple-colors.js';
import { store, AppHaxStore } from './AppHaxStore.js';
import './random-word.js';
import './app-hax-hat-progress.js';
import './app-hax-portfolio-button.js';
import './app-hax-site-button.js';

const blueStyle = new URL('../lib/assets/images/BlueStyle.svg', import.meta.url)
  .href;
const greyStyle = new URL('../lib/assets/images/GreyStyle.svg', import.meta.url)
  .href;
const partyStyle = new URL(
  '../lib/assets/images/PartyStyle.svg',
  import.meta.url
).href;

export class AppHaxSteps extends SimpleColors {
  static get tag() {
    return 'app-hax-steps';
  }

  constructor() {
    super();
    this._progressReady = false;
    this.step = 1;
    this.isNewUser = true;
    this.loaded = false;
    this.callList = [
      () => import('@lrnwebcomponents/i18n-manager/lib/I18NMixin.js'),
      () => import('@lrnwebcomponents/wc-autoload/wc-autoload.js'),
      () => import('@lrnwebcomponents/replace-tag/replace-tag.js'),
      () => import('@lrnwebcomponents/utils/utils.js'),
      () => import('@lrnwebcomponents/grid-plate/grid-plate.js'),
      () => import('mobx/dist/mobx.esm.js'),
      () => import('@lrnwebcomponents/simple-fields/simple-fields.js'),
      () => import('@lrnwebcomponents/h-a-x/h-a-x.js'),
    ];
    this.routes = [
      {
        path: 'step-1',
        component: 'fake',
        step: 1,
        id: 'step-1',
        label: 'Welcome',
      },
      {
        path: 'step-2',
        component: 'fake',
        step: 2,
        id: 'step-2',
        label: 'Step 2',
      },
      {
        path: 'step-3',
        component: 'fake',
        step: 3,
        id: 'step-3',
        label: 'Select styles',
      },
      {
        path: 'step-4',
        component: 'fake',
        step: 4,
        id: 'step-4',
        label: 'Get writing!',
      },
    ];
    this.phrases = {
      new: ["What's ya name?", 'Dogecoin to the moon', 'Welcome to the Jungle'],
      return: ['Welcome back, take 2?', "That wasn't very long", 'Sup man'],
    };

    autorun(() => {
      this.step = toJS(store.step);
    });
    autorun(() => {
      this.isNewUser = toJS(store.isNewUser);
    });
  }

  static get properties() {
    return {
      ...super.properties,
      step: { type: Number, reflect: true },
      routes: { type: Array },
      isNewUser: { type: Boolean, reflect: true },
      phrases: { type: Object },
      callList: { type: Array },
      loaded: { type: Boolean, reflect: true },
    };
  }

  chooseStructure(e) {
    const { value } = e.target;
    // Do a type of and check that this is a string"
    store.site.structure = value;
    AppHaxStore.playSound('click2');
  }

  chooseType(e) {
    const { value } = e.target;
    store.site.type = value;
    this.step = 2;
    AppHaxStore.playSound('click2');
  }

  chooseTheme(e) {
    const { value } = e.target;
    store.site.theme = value;
    this.step = 3;
    AppHaxStore.playSound('click2');
  }

  progressReady(e) {
    if (e.detail) {
      this._progressReady = true;
      if (this.step === 4) {
        setTimeout(() => {
          this.shadowRoot.querySelector('app-hax-hat-progress').process();
        }, 300);
      }
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      // start the 'game'
      if (this.step === 1 && oldValue === undefined && propName === 'step') {
        AppHaxStore.playSound('coin2');
      }
      if (this.step !== 1 && oldValue === undefined && propName === 'step') {
        setTimeout(() => {
          this.shadowRoot.querySelector(`#step-${this.step}`).scrollIntoView();
        }, 0);
      }
      // for if we start here
      if (
        this.step === 4 &&
        propName === 'step' &&
        this.shadowRoot &&
        this._progressReady
      ) {
        setTimeout(() => {
          this.shadowRoot.querySelector('app-hax-hat-progress').process();
        }, 600);
      }
      // update the store
      if (['step', 'routes'].includes(propName)) {
        store[propName] = this[propName];
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this.maintainScroll.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.maintainScroll.bind(this));
    super.disconnectedCallback();
  }

  // account for resizing

  maintainScroll() {
    console.log('here');
    if (this.shadowRoot && this.step) {
      this.shadowRoot.querySelector(`#step-${this.step}`).scrollIntoView();
      // account for an animated window drag... stupid.
      setTimeout(() => {
        this.shadowRoot.querySelector(`#step-${this.step}`).scrollIntoView();
      }, 100);
    }
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    autorun(() => {
      if (store.location && store.location.route && store.location.route.id) {
        // use ID from location change to scroll into view
        setTimeout(() => {
          this.shadowRoot
            .querySelector('#'.concat(toJS(store.location.route.id)))
            .scrollIntoView({
              block: 'nearest',
              inline: 'nearest',
              behavior: 'smooth',
            });
        }, 300); // this delay helps w/ initial paint timing but also user perception
        // there's a desire to have a delay especialy when tapping things of
        // about 300ms
      }
    });
    autorun(() => {
      const activeItem = toJS(store.activeItem);
      if (activeItem && activeItem.id) {
        if (activeItem.step !== this.step) {
          this.step = activeItem.step;
        }
        this.shadowRoot
          .querySelector('#link-'.concat(toJS(activeItem.id)))
          .click();
      } else {
        this.shadowRoot.querySelector('#link-step-1').click();
      }
    });
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :root {
          background: blue;
        }
        scrollable-component {
          --scrollbar-width: 0px;
          --scrollbar-height: 0px;
          --scrollbar-padding: 0;
          --viewport-overflow-x: hidden;
          overflow: hidden;
        }
        #grid-container {
          display: grid;
          grid-template-columns: 200px 200px;
          background: transparent;
        }
        #hide-my-butt {
          visibility: hidden;
          width: 0;
          height: 0;
        }
        .carousel-with-snapping-track {
          display: grid;
          grid-auto-flow: column;
          grid-gap: 30px;
        }
        .carousel-with-snapping-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          scroll-snap-align: center;
          scroll-snap-stop: always;
          width: var(--viewport-width);
          font-size: 1.5rem;
          text-align: center;
        }
        li {
          display: inline-flex;
          margin: 4px;
        }
        li a {
          text-decoration: none;
          padding: 10px;
        }
        li a:hover,
        li a:focus {
          background-color: blue;
          color: white;
        }
        li a.active-step {
          background-color: orange;
          color: white;
        }
        app-hax-portfolio-button {
          padding: 10px 0px 10px 0px;
          background: transparent;
        }
        #theme-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
        img {
          pointer-events: none;
        }
        .theme-button {
          background-color: transparent;
          border: none;
        }
        app-hax-site-button {
          --app-hax-site-button-width: 30vw;
          --app-hax-site-button-min-width: 300px;
        }
      `,
    ];
  }

  getNewWord() {
    this.shadowRoot.querySelector('random-word').getNewWord();
  }

  progressFinished(e) {
    if (e.detail) {
      this.loaded = true;
      AppHaxStore.playSound('success');
    }
  }

  render() {
    return html`
      <app-hax-router></app-hax-router>
      <random-word
        key="new"
        .phrases="${this.phrases}"
        @click="${this.getNewWord}"
      ></random-word>
      <div id="container">
        <ul id="hide-my-butt">
          ${this.routes.map(
            item =>
              html`<li>
                <a
                  href="${item.path}"
                  id="link-${item.id}"
                  class="${this.step === item.step ? 'active-step' : ''}"
                  >${item.label}</a
                >
              </li>`
          )}
        </ul>
        <scrollable-component>
          <div class="carousel-with-snapping-track">
            <div class="carousel-with-snapping-item" id="step-1">
              <div class="step-wrapper">
                <app-hax-site-button
                  tabindex="${this.step !== 1 ? '-1' : ''}"
                  label="> Course"
                  value="course"
                  @click=${this.chooseStructure}
                ></app-hax-site-button>
                <app-hax-site-button
                  tabindex="${this.step !== 1 ? '-1' : ''}"
                  label="> Portfolio"
                  value="portfolio"
                  @click=${this.chooseStructure}
                ></app-hax-site-button>
              </div>
            </div>
            <div class="carousel-with-snapping-item" id="step-2">
              <div id="grid-container">
                <app-hax-profolio-button
                  tabindex="${this.step !== 2 ? '-1' : ''}"
                  @click=${this.chooseType}
                  type="Technology"
                ></app-hax-profolio-button>
                <app-hax-profolio-button
                  tabindex="${this.step !== 2 ? '-1' : ''}"
                  @click=${this.chooseType}
                  type="Business"
                ></app-hax-profolio-button>
                <app-hax-profolio-button
                  tabindex="${this.step !== 2 ? '-1' : ''}"
                  @click=${this.chooseType}
                  type="Art"
                ></app-hax-profolio-button>
                <app-hax-profolio-button
                  tabindex="${this.step !== 2 ? '-1' : ''}"
                  @click=${this.chooseType}
                ></app-hax-profolio-button>
              </div>
            <div class="carousel-with-snapping-item" id="step-3">
              <div id="themeContainer">
                <button
                  value="blue"
                  class="theme-button"
                  @click=${this.chooseTheme}
                  tabindex="${this.step !== 3 ? '-1' : ''}"
                >
                  <img src=${blueStyle} alt="" />
                </button>
                <button
                  value="gray"
                  class="theme-button"
                  @click=${this.chooseTheme}
                  tabindex="${this.step !== 3 ? '-1' : ''}"
                >
                  <img src=${greyStyle} alt="" />
                </button>
                <button
                  value="party"
                  class="theme-button"
                  @click=${this.chooseTheme}
                  tabindex="${this.step !== 3 ? '-1' : ''}"
                >
                  <img src=${partyStyle} alt="" />
                </button>
              </div>
            </div>
            <div class="carousel-with-snapping-item" id="step-4">
              <app-hax-hat-progress
                @progress-ready="${this.progressReady}"
                @promise-progress-finished="${this.progressFinished}"
                .promises="${this.callList}"
                tabindex="${this.step !== 4 ? '-1' : ''}"
              ></app-hax-hat-progress>
            </div>
          </div>
        </scrollable-component>
      </div>
    `;
  }
}
customElements.define(AppHaxSteps.tag, AppHaxSteps);
