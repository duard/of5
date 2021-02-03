import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AppStoreModule } from '@of5/shared/app-store';
import { environment } from '@of5/shared/environments';

@NgModule({
  imports: [AppStoreModule.forRoot()],
})
export class AppCoreModule {
  isDev = !environment.production;

  constructor(
    @Optional()
    @SkipSelf()
    parentModule?: AppCoreModule,
  ) {
    if (this.isDev) {
      console.log('isDev', this.isDev);
    }

    if (parentModule) {
      throw new Error('AppCoreModule só pode ser importada uma vez, no AppModule :-(');
    }
  }
}
