import { createSelector } from '@ngrx/store';

import { RootState } from '..';
import { NavigationState } from './navigation.state';

// export const selectFeature = (state: RootState) => state.navigation;
export const selectFeature = (state: RootState) => state.navigation;
export const selectNavigation = createSelector(
  selectFeature,
  (state: NavigationState) => state
);

// export const selectLoading = createSelector(
//   selectFeature,
//   ({ loading }) => loading
// );

export const selectLoading = createSelector(
  selectNavigation,
  (state: NavigationState) => state.loading
);
