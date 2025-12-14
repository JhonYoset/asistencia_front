import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventosComponent } from './eventos/eventos.component';
import { FormsModule } from '@angular/forms';
import { AuthModule } from './modules/auth/auth.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { InjectSessionInterceptor } from '@core/interceptors/inject-session.interceptor';
import { GlobalErrorHandler } from '@shared/global/global-error-handler';
import { HttpErrorInterceptor } from '@core/interceptors/http-error.interceptor';
import { SharedModule } from '@shared/Shared.module';

@NgModule({
  declarations: [
    AppComponent,
    EventosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AuthModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    CookieService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InjectSessionInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }