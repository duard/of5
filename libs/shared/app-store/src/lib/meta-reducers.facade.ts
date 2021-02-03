import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import * as thisActions from './meta-reducers';
import { reset } from './meta-reducers';

@Injectable({
  providedIn: 'root'
})
export class StoreFacade {
  constructor(private store$: Store, private ngZone: NgZone) {}

  resetCache() {
    // console.log('reseting');

    this.ngZone.run(() => {
      // Bring event back inside Angular's zone
      this.store$.dispatch(reset());
    });
  }
}
