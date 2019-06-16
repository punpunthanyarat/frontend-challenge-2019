import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
          MatFormFieldModule,
          MatInputModule,
          MatSelectModule,
          MatOptionModule,
          MatDatepickerModule,
          MatNativeDateModule,
          DateAdapter,
          MatSidenavModule,
          MatButtonModule,
          MatPaginatorModule,
          MatDialogModule,
          MatRadioModule,
          MatCheckboxModule,
          MatToolbarModule,
          MatProgressSpinnerModule,
          MatCardModule,
          MatProgressBarModule,
          MatAutocompleteModule,
          MatSortModule,
          MatIconModule,
          MatTabsModule,
          MatBadgeModule
       } from '@angular/material';
import { ToolbarModule } from '.././toolbar/toolbar.module';
import { HomeComponent } from './home/home.component';
import { VersionComponent } from './version/version.component';
@NgModule({
  declarations: [
    LayoutComponent,
    HomeComponent,
    VersionComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatButtonModule,
    MatPaginatorModule,
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatSortModule,
    MatIconModule,
    MatTabsModule,
    MatBadgeModule,
    ToolbarModule
  ],
  providers: [
    DatePipe
  ],
  exports: [
    VersionComponent
  ]
})
export class LayoutModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale('th-TH');
  }
}
