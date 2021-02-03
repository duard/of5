import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';

import * as thisActions from './settings.actions';
import * as fromSelector from './settings.selectors';

@Injectable({
  providedIn: 'root'
})
export class SettingsFacade {
  selectSidenav$ = this.store$.select(fromSelector.selectSettingsSideNav);
  selectMenu$ = this.store$.select(fromSelector.selectMenu);

  constructor(private store$: Store, private ngZone: NgZone) {}

  changeLeftSidenav(payload: boolean) {
    this.ngZone.run(() => {
      this.store$.dispatch(thisActions.actionSettingsChangeSideNav({ sideNav: payload }));
    });
  }

  pushMenu(payload: any) {
    this.ngZone.run(() => {
      console.log('facade', payload);
      this.store$.dispatch(thisActions.actionPushMenu({ menus: payload }));
    });
  }
}
