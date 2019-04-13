import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UploadYourDocumentComponent } from './upload-your-document/upload-your-document.component';

const routes: Routes = [
  { path: '',
    component: UploadYourDocumentComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
