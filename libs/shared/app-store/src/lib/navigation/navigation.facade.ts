
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromSelector from './navigation.selectors';

@Injectable({
  providedIn: 'root'
})
export class NavigationFacade {
  selectLoading$ = this.store$.select(fromSelector.selectLoading);

  constructor(private store$: Store) {}


}
