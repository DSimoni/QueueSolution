import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LayoutComponent } from './layout.component';
import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking.component';
import { BookingMapComponent } from './booking-map.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BookingRoutingModule,
        GoogleMapsModule,
        AutocompleteLibModule
        
    ],
    declarations: [
        LayoutComponent,
        BookingComponent,
        BookingMapComponent
    ]
})
export class BookingModule { }