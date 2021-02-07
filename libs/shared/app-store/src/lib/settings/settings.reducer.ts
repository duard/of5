import { Action, createReducer, on } from '@ngrx/store';

import {
  actionPushMenu,
  actionSettingsChangeAnimationsElements,
  actionSettingsChangeAnimationsPage,
  actionSettingsChangeAnimationsPageDisabled,
  actionSettingsChangeAutoNightMode,
  actionSettingsChangeHour,
  actionSettingsChangeLanguage,
  actionSettingsChangeSideNav,
  actionSettingsChangeStickyHeader,
  actionSettingsChangeTheme
} from './settings.actions';

export const NIGHT_MODE_THEME = 'BLACK-THEME';

export type Language = 'en' | 'sk' | 'de' | 'fr' | 'es' | 'pt-br' | 'he';

export interface SettingsState {
  sideNav: boolean;
  language: string;
  theme: string;
  autoNightMode: boolean;
  nightTheme: string;
  stickyHeader: boolean;
  pageAnimations: boolean;
  pageAnimationsDisabled: boolean;
  elementsAnimations: boolean;
  hour: number;
  menus: any;
}

export const initialState: SettingsState = {
  sideNav: true,
  language: 'en',
  theme: 'DEFAULT-THEME',
  autoNightMode: false,
  nightTheme: NIGHT_MODE_THEME,
  stickyHeader: true,
  pageAnimations: true,
  pageAnimationsDisabled: false,
  elementsAnimations: true,
  hour: 0,
  menus: null
};

const reducer = createReducer(
  initialState,
  on(
    actionSettingsChangeLanguage,
    actionSettingsChangeTheme,
    actionSettingsChangeAutoNightMode,
    actionSettingsChangeStickyHeader,
    actionSettingsChangeAnimationsPage,
    actionSettingsChangeAnimationsElements,
    actionSettingsChangeHour,
    // actionSettingsChangeSideNav,
    (state, action) => ({ ...state, ...action })
  ),
  on(actionSettingsChangeAnimationsPageDisabled, (state, { pageAnimationsDisabled }) => ({
    ...state,
    pageAnimationsDisabled,
    pageAnimations: false
  })),
  // on(actionSettingsChangeSideNav, (state, { sideNav }) => ({
  //   ...state,
  //   sideNav: sideNav,
  // })),
  on(actionSettingsChangeSideNav, (state, { sideNav }) => ({
    ...state,
    sideNav: sideNav
  })),
  // on(actionPushMenu, (state, { menus}) => ({
  //   ...state,
  //   menus: menus
  // })),

  on(actionPushMenu, (state, { menus }) => {
    console.log('reducer', typeof menus);
    //  menus.map(item => Object.assign({}, item, { selected: false }));
    // state.menus = ['menu1', 'menu2'];

    return { ...state, menus };
  })
);

export function settingsReducer(state: SettingsState | undefined, action: Action) {
  return reducer(state, action);
}
