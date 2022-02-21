/* eslint-disable max-classes-per-file */
import { observable, makeObservable, computed, configure, autorun } from 'mobx';

configure({ enforceActions: false, useProxies: 'ifavailable' }); // strict mode off

/*
function localStorageSet(name, newItem) {
  try {
    return localStorage.setItem(name, JSON.stringify(newItem));
  } catch (e) {
    return false;
  }
}

function localStorageGet(name){
  try {
    return JSON.parse(localStorage.getItem(name));
  } catch (e) {
    return false;
  }
}
*/

class Store {
  constructor() {
    this.location = null;
    this.step = 1; // localStorageGet("step") === false ? 1: localStorageGet("step");
    this.routes = [];
    this.site = []; // localStorageGet("site") === false ? { structure: null, type: null, theme: null }: localStorageGet("site");

    makeObservable(this, {
      location: observable.ref, // router location in url
      step: observable, // step that we're on in our build
      routes: observable, // routes that are valid
      site: observable, // information about the site being created
      activeItem: computed, // active item is route
    });
  }

  // site{ structure, type, theme } (course, portfolio, buz, colors)
  get activeItem() {
    if (this.routes) {
      return this.routes.find(item => {
        if (item.step !== this.step) {
          return false;
        }
        return true;
      });
    }
    return null;
  }
}
/**
 * Central store
 */
export const store = new Store();
// register globally so we can make sure there is only one
window.HAXCMS = window.HAXCMS || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.HAXCMS.requestAvailability = () => {
  if (!window.HAXCMS.instance) {
    window.HAXCMS.instance = document.createElement('haxcms-app-store');
    document.body.appendChild(window.HAXCMS.instance);
  }
  return window.HAXCMS.instance;
};

// weird, but self appending
export const HAXcmsStore = window.HAXCMS.requestAvailability();

/**
 * HTMLElement
 */
export class HAXCMSAppStore extends HTMLElement {
  static get tag() {
    return 'haxcms-app-store';
  }

  constructor() {
    super();
    // full on store that does the heavy lifting
    this.store = store;
    // source for reading in the store if different than default site.json
    this.source = '';
    /**
     * When location changes update activeItem
     */
    autorun(() => {
      if (store.location && store.location.route) {
        // get the id from the router
        console.log('Store Auto Run ran');
        this.store.step = store.location.route.step;
        console.log(this.store.step);
      }

      // When site(the object and NOT the attributes) & Step change write this to local storage
      if (store.step) {
        console.log('Store Step Changed');
        // localStorageSet("step", store.step);
      }

      if (store.site) {
        // localStorageSet("site", store.site);
      }
    });
  }
}
customElements.define(HAXCMSAppStore.tag, HAXCMSAppStore);
