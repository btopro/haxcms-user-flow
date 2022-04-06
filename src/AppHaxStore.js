/* eslint-disable max-classes-per-file */
import {
  localStorageGet,
} from '@lrnwebcomponents/utils/utils.js';
import {
  observable,
  makeObservable,
  computed,
  configure,
  autorun,
  toJS,
} from 'mobx';

configure({ enforceActions: false, useProxies: 'ifavailable' }); // strict mode off

class Store {
  constructor() {
    this.location = null;
    this.isNewUser = true;
    this.appEl = null;
    this.soundStatus = localStorageGet('app-hax-soundStatus', true);
    // If user is new, make sure they are on step 1

    if (this.isNewUser) {
      this.step = 1;
    } else {
      this.step = !localStorageGet('app-hax-step') ? 1 : localStorageGet('app-hax-step');
    }
    this.isLoggedIn = true;
    this.routes = [];
    this.searchTerm = '';
    this.user = {
      name: 'btopro',
    };
    this.site = !localStorageGet('app-hax-site')
      ? { structure: null, type: null, theme: null }
      : localStorageGet('app-hax-site');

    this.darkMode = !localStorageGet('app-hax-darkMode')
      ? false
      : localStorageGet('app-hax-darkMode');

    makeObservable(this, {
      location: observable.ref, // router location in url
      step: observable, // step that we're on in our build
      searchTerm: observable,
      isNewUser: observable,
      isLoggedIn: observable,
      routes: observable, // routes that are valid
      site: observable, // information about the site being created
      activeItem: computed, // active item is route
      darkMode: observable,
      soundStatus: observable,
      user: observable,
    });
  }

  // site{ structure, type, theme } (course, portfolio, buz, colors)
  get activeItem() {
    if (this.routes.length > 0 && this.step) {
      return this.routes.find(item => {
        if (item.step !== this.step) {
          return false;
        }
        return true;
      });
    }
    // fake it if we have nothing on initial tee-up
    return null;
  }
}
/**
 * Central store
 */
export const store = new Store();