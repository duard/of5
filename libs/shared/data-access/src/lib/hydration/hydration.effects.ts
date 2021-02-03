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
        const storageValue = localStorage.getItem('state');
        if (storageValue) {
          try {
            const state = JSON.parse(storageValue);
            return HydrationActions.hydrateSuccess({ state });
          } catch {
            localStorage.removeItem('state');
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
        tap(state => localStorage.setItem('state', JSON.stringify(state)))
      ),
    { dispatch: false }
  );

  constructor(private action$: Actions, private store: Store<RootState>, private ngZone: NgZone) {}

  ngrxOnInitEffects(): Action {
    // return this.ngZone.run(() => HydrationActions.hydrate());

    // let someThing: any;

    this.ngZone.run(() => {
      console.log('Hydration');
      HydrationActions.hydrate();
    });
    // // return HydrationActions.hydrate();

    // return this.ngZone.run(() => {
    //   console.log('Hydration');
    //   someThing = HydrationActions.hydrate();

    //   return someThing;

    // });

    // console.log('Não retornou', someThing);

    // return someThing;

    // this.hydrate();

    return null;
  }

  hydrate() {
    return this.ngZone.run(() => {
      console.log('Hydration');
      HydrationActions.hydrate();
    });
  }
}
