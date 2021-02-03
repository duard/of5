import { SettingsState } from './settings.reducer';

import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, State, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { distinctUntilChanged, filter, map, mapTo, tap, withLatestFrom } from 'rxjs/operators';

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
import {
  selectEffectiveTheme,
  selectElementsAnimations,
  selectPageAnimations,
  selectSettingsLanguage,
  selectSettingsSideNav
} from './settings.selectors';
import { of, interval } from 'rxjs';

// import { combineLatest, interval, merge, of } from 'rxjs';
export const SETTINGS_KEY = 'SETTINGS';

const INIT = of('anms-init-effect-trigger');

@Injectable()
export class SettingsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<SettingsState>,
    private router: Router,
    private overlayContainer: OverlayContainer
  ) {}

  changeHour = createEffect(() =>
    interval(60_000).pipe(
      mapTo(new Date().getHours()),
      distinctUntilChanged(),
      map(hour => actionSettingsChangeHour({ hour }))
    )
  );
  changeLeftSideNav$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actionSettingsChangeSideNav),
        tap(action =>
          // this.analytics.trackPageView(action.payload.routerState.url)
          console.log('=> changeLeftSideNav$', action.sideNav)
        )
      ),
    { dispatch: false }
  );

  pushMenu$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actionPushMenu),
        tap(action =>
          // this.analytics.trackPageView(action.payload.routerState.url)
          console.log('=> actionPushMenu$', typeof action.menus)
        )
      ),
    { dispatch: false }
  );

  // setTranslateServiceLanguage = createEffect(
  //   () =>
  //     this.store.pipe(
  //       select(selectSettingsLanguage),
  //       distinctUntilChanged(),
  //       tap(language => this.translateService.use(language))
  //     ),
  //   { dispatch: false }
  // );

  // setTitle = createEffect(
  //   () =>
  //     merge(
  //       this.actions$.pipe(ofType(actionSettingsChangeLanguage)),
  //       this.router.events.pipe(filter(event => event instanceof ActivationEnd))
  //     ).pipe(
  //       tap(() => {
  //         this.titleService.setTitle(
  //           this.router.routerState.snapshot.root,
  //           this.translateService
  //         );
  //       })
  //     ),
  //   { dispatch: false }
  // );
}
