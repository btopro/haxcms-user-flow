/* eslint-disable no-return-assign */
import { LitElement, html, css } from 'lit';
import { store } from './AppHaxStore.js';

export class AppHaxSearchBar extends LitElement {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return 'app-hax-search-bar';
  }

  constructor() {
    super();
    this.searchTerm = '';
    this.showSearch = false;
  }

  // Site.json is coming from

  static get properties() {
    return {
      searchTerm: { type: String},
      showSearch: { type: Boolean, reflect: true, attribute:'show-search'}
    };
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'searchItems') {
        this.displayItems = [...this.searchItems];
      }
      else if (propName === 'searchTerm') {
        store.searchTerm = this.searchTerm;
      }
      else if (propName === 'showSearch' && oldValue !== undefined) {
        this[propName] ? window.history.pushState({}, null, 'search') : history.back();
      }
    });
  }

  static get styles() {
    return [
      css`
        :host {
          overflow: hidden;
        }
        input {
          visibility: none;
          opacity: 0;
          width: 0;
          transition: all ease-in-out .3s;
          padding: 4px;
          font-family: 'Press Start 2P', sans-serif;
          font-size: 20px;
          margin: 2px 0 0 16px;
        }
        :host([show-search]) input {
          visibility: visible;
          opacity: 1;
          width: 250px;
          max-width: 25vw;
        }
        simple-icon-button-lite {
          color: black;
          --simple-icon-width: 40px;
          --simple-icon-height: 40px;
          padding: 2px;
          margin: 0;
          background-color: white;
        }
        simple-icon-button-lite:focus,
        simple-icon-button-lite:hover {
          background-color: #eeeeee;
        }
      `,
    ];
  }

  // eslint-disable-next-line class-methods-use-this
  search(e) {
    this.searchTerm = this.shadowRoot.querySelector('#searchField').value;
  }

  render() {
    return html`
      <simple-icon-button-lite label="Search" icon="icons:search" @click="${this.toggleSearch}"></simple-icon-button-lite>
      <input ?disabled="${!this.showSearch}" id="searchField" @input="${this.search}" type="text" placeholder="Search.." />
    `;
  }
  toggleSearch() {
    this.showSearch = !this.showSearch;
    setTimeout(() => {
      this.shadowRoot.querySelector("#searchField").focus();      
    }, 300);
  }
}
customElements.define(AppHaxSearchBar.tag, AppHaxSearchBar);