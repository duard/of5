import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { isDevMode, ModuleWithProviders, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@of5/shared/environments';

import { metaReducers, reducers } from './reducers';

const RouterStateMinimal = 1;

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictActionImmutability: false,
        strictActionSerializability: false,
        strictActionTypeUniqueness: isDevMode(),
        strictActionWithinNgZone: isDevMode(),
        strictStateImmutability: isDevMode(),
        strictStateSerializability: false
      }
    }),
    // EffectsModule.forRoot([HydrationEffects, RouterEffects, SettingsEffects]),
    // StoreRouterConnectingModule.forRoot({ routerState: RouterStateMinimal }),
    // EntityDataModule.forRoot(entityConfig),

    environment.production
      ? []
      : StoreDevtoolsModule.instrument({
          name: '2020 Estoques',
          maxAge: 26
        })
  ],
  providers: [
    // {
    //   provide: PersistenceResultHandler,
    //   useClass: AdditionalPersistenceResultHandler
    // },
    // {
    //   provide: EntityCollectionReducerMethodsFactory,
    //   useClass: AdditionalEntityCollectionReducerMethodsFactory
    // }
  ]
})
export class SharedDataAccessRootModule {}

@NgModule({})
export class SharedDataAccessModule {
  static forRoot(): ModuleWithProviders<SharedDataAccessRootModule> {
    return {
      ngModule: SharedDataAccessRootModule,
    };
  }
}

/*
const RouterStateMinimal = 1;

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        // strictActionWithinNgZone: false,
        strictActionImmutability: false,
        strictActionSerializability: false,
        strictActionTypeUniqueness: isDevMode(),
        strictActionWithinNgZone: isDevMode(),
        strictStateImmutability: isDevMode(),
        strictStateSerializability: false
      }
    }),
    EffectsModule.forRoot([HydrationEffects, RouterEffects, SettingsEffects]),
    StoreRouterConnectingModule.forRoot({ routerState: RouterStateMinimal }),
    EntityDataModule.forRoot(entityConfig),

    environment.production
      ? []
      : StoreDevtoolsModule.instrument({
          name: '2020 Estoques',
          maxAge: 26
        })
  ],
  providers: [
    {
      provide: PersistenceResultHandler,
      useClass: AdditionalPersistenceResultHandler
    },
    {
      provide: EntityCollectionReducerMethodsFactory,
      useClass: AdditionalEntityCollectionReducerMethodsFactory
    }
  ]
})
export class AppStoreModule {
  constructor() {
    console.log('isDevMode()', isDevMode());
  }
}

*/