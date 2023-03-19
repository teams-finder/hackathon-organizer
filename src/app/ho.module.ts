import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';


import {HoRoutingModule} from './ho-routing.module';
import {MenuComponent} from './core/menu/menu.component';
import {HoComponent} from './ho.component';
import {FooterComponent} from './core/footer/footer.component';
import {HackathonModule} from "./hackathon/hackathon.module";
import {UserModule} from "./user/user.module";
import {initializeKeycloak} from "./init/keycloak-init.factory";
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TeamModule} from "./team/team.module";
import {HomepageComponent} from './core/homepage/homepage.component';
import {LoggerModule, NgxLoggerLevel} from "ngx-logger";
import {CustomDateFormatter, MentorModule} from "./mentor/mentor.module";
import {CalendarDateFormatter, CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {FlatpickrModule} from "angularx-flatpickr";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ApiInterceptor} from "./core/interceptors/api.interceptor";

@NgModule({
  declarations: [
    HoRoutingModule.components
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    KeycloakAngularModule,
    HoRoutingModule,
    LoggerModule.forRoot({
      serverLoggingUrl: '/api/logs',
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR
    }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }, {
      dateFormatter: {
        provide: CalendarDateFormatter,
        useClass: CustomDateFormatter
      }
    }),
    FlatpickrModule.forRoot(),
    ToastrModule.forRoot()
  ],

  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: ApiInterceptor
    }
  ],
  bootstrap: [HoComponent]
})
export class HoModule {
}
