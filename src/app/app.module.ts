import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import {ServiceWorkerModule} from "@angular/service-worker";
import {Service} from "./service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {XhrInterceptor} from "./xhr.interceptor";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/service-worker.js', {enabled: environment.production}),
    HttpClientModule
  ],
  providers: [
    Service,
    [{provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true}],
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
