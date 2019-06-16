import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar.component';
import { MatToolbarModule } from '@angular/material';
import { MatMenuModule } from '@angular/material/menu';
@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatMenuModule
  ],
  exports: [
    ToolbarComponent
  ]
})
export class ToolbarModule { }
