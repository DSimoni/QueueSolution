import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { BookingFormComponent } from './booking-form/booking-form.component'
import { HttpClientModule } from '@angular/common/http';
import { RestService } from './rest.service';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';


@NgModule({
  declarations: [AppComponent,
 BookingFormComponent
  ],
  imports: [
    BrowserModule, GoogleMapsModule, HttpClientModule, AutocompleteLibModule
  ],
  providers: [GoogleMapsModule, BookingFormComponent, RestService],
  bootstrap: [AppComponent],
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class AppModule { }
