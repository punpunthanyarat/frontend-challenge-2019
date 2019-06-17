import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale('th-TH'); // DD/MM/YYYY
  }
}
