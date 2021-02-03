import { EntityAction, EntityCollection, EntityCollectionReducerMethods, EntityDefinition } from '@ngrx/data';

export class AdditionalEntityCollectionReducerMethods<
  T
> extends EntityCollectionReducerMethods<T> {
  constructor(
    public entityName: string,
    public definition: EntityDefinition<T>
  ) {
    super(entityName, definition);
  }
  protected queryManySuccess(
    collection: EntityCollection<T>,
    action: EntityAction<T[]>
  ): EntityCollection<T> {
    const ec = super.queryManySuccess(collection, action);

    if ((action.payload as any).data) {
      (ec as any).count = (action.payload as any).count;
      (ec as any).page = (action.payload as any).page;
      (ec as any).pageCount = (action.payload as any).pageCount;
      (ec as any).total = (action.payload as any).total;
      // (ec as any).data = (action.payload as any).data;
    }
    return ec;
  }
}
