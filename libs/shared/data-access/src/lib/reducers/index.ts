import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '@of5/shared/environments';

import { debug } from './debug';

export interface State {}

export const reducers: ActionReducerMap<State> = {};

export const metaReducers: MetaReducer<State>[] =
  !environment.production ? [debug] : [];