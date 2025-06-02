import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Productomponent } from './product.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    Productomponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: Productomponent }
    ])
  ]
})
export class ProductModule { }
