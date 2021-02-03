import { NgModule } from '@angular/core';
import { SharedDataAccessModule } from '@of5/shared/data-access';

@NgModule({
  imports: [
    SharedDataAccessModule.forRoot(),
  ],
})
export class SharedCoreModule {}

