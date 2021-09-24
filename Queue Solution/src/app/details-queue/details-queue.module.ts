import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailsQueueRoutingModule } from './details-queue-routing.module';
import { DetailsQueueComponent } from './details-queue.component';
import { LayoutComponent } from './layout.component';



@NgModule({
  declarations: [DetailsQueueComponent, LayoutComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DetailsQueueRoutingModule
  ]
})
export class DetailsQueueModule { }
