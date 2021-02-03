import { Inject, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedDataAccessModule } from '@of5/shared/data-access';
import { environment } from "@of5/shared/environments";

@NgModule({
  imports: [
    SharedDataAccessModule.forRoot(),
  ],
})
export class SharedCoreModule {

  isDev = !environment.production

  constructor(
    @Optional()
    @SkipSelf()
    parentModule?: SharedCoreModule
  ) {
    
    if (this.isDev) {
      console.log('isDev', this.isDev);
    }

    if (parentModule) {
      throw new Error(
        'SharedCoreModule só pode ser importada uma vez, no AppModule :-('
      );
    }
  }
}

