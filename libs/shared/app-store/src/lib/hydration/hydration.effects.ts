import { Injectable, NgZone } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { RootState } from '..';
import * as HydrationActions from './hydration.actions';

@Injectable()
export class HydrationEffects implements OnInitEffects {
  hydrate$ = createEffect(() =>
    this.action$.pipe(
      ofType(HydrationActions.hydrate),
      map(() => {
        const storageValue = localStorage.getItem('of5-state');
        if (storageValue) {
          try {
            const state = JSON.parse(storageValue);
            return HydrationActions.hydrateSuccess({ state });
          } catch {
            localStorage.removeItem('of5-state');
          }
        }
        return HydrationActions.hydrateFailure();
      })
    )
  );

  serialize$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(HydrationActions.hydrateSuccess, HydrationActions.hydrateFailure),
        switchMap(() => this.store),
        distinctUntilChanged(),
        tap(state => localStorage.setItem('of5-state', JSON.stringify(state)))
      ),
    { dispatch: false }
  );

  constructor(private action$: Actions, private store: Store<RootState>, private ngZone: NgZone) {}

  ngrxOnInitEffects(): Action {
    // return this.ngZone.run(() => HydrationActions.hydrate());

    return HydrationActions.hydrate();
  }

  hydrate() {
    return this.ngZone.run(() => {
      console.log('Hydration');
      HydrationActions.hydrate();
    });
  }
}
