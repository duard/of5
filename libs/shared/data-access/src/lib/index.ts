import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { hydrationMetaReducer } from './hydration/hydration.reducer';
import { resettingMetaReducer } from './meta-reducers';
import { navigationReducer } from './navigation/navigation.reducer';
import { NavigationState } from './navigation/navigation.state';
import { settingsReducer, SettingsState } from './settings/settings.reducer';

export interface RootState {
  settings: SettingsState;
  navigation: NavigationState;
  router: RouterReducerState;
}

export const reducers: ActionReducerMap<RootState> = {
  settings: settingsReducer,
  navigation: navigationReducer,
  router: routerReducer,
};

export const metaReducers: MetaReducer[] = [
  // hydrationMetaReducer,
  // resettingMetaReducer,
];
