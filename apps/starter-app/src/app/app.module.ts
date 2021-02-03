import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppCoreModule } from '@of5/shared/app-core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppCoreModule, RouterModule.forRoot([], { initialNavigation: 'enabled' })],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
