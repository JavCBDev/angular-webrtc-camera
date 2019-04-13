import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  FlexLayoutModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatExpansionModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';

@NgModule({
  imports: [CommonModule],
  exports: [
    FlexLayoutModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatTooltipModule,

    // used after login
    MatSelectModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatMenuModule,
    MatListModule,
    MatTabsModule,
    MatTableModule,
    MatSliderModule,
    MatAutocompleteModule,
  ],
})
export class AppFlexMaterialModule {}
