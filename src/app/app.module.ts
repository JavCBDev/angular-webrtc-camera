import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppFlexMaterialModule } from './app-flex-material.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { UploadYourDocumentComponent } from './upload-your-document/upload-your-document.component';
import { CameraComponent } from './camera/camera.component';

@NgModule({
  imports:      [ BrowserModule, BrowserAnimationsModule, AppFlexMaterialModule, AppRoutingModule ],
  declarations: [ AppComponent, UploadYourDocumentComponent, CameraComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
