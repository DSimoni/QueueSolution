import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { DetailsQueueComponent } from './details-queue.component';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
      path: '', component: LayoutComponent,
      children: [
          { path: '', component: DetailsQueueComponent },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsQueueRoutingModule { }
