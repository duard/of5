import { Injectable } from '@angular/core';
import { DefaultPersistenceResultHandler, EntityAction } from '@ngrx/data';
import { Action } from '@ngrx/store';

@Injectable()
export class AdditionalPersistenceResultHandler extends DefaultPersistenceResultHandler {
  handleSuccess(originalAction: EntityAction): (data: any) => Action {
    const actionHandler = super.handleSuccess(originalAction);
    // return a factory to get a data handler to
    // parse data from DataService and save to action.payload
    return function (data: any) {
      const action = actionHandler.call(this, data);

      // console.log('voltei', data);

      if (action && data) {
        (action as any).payload.count = data.count;
        (action as any).payload.page = data.page;
        (action as any).payload.pageCount = data.pageCount;
        (action as any).payload.total = data.total;
        (action as any).payload.data = data.data || data;
      } else {
        console.log('não contem data 2');
      }

      return action;
    };
  }
}
