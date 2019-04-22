import { Component, OnInit, ViewChild } from '@angular/core';

import { CameraComponent } from '../camera/camera.component';

@Component({
  selector: 'app-upload-your-document',
  templateUrl: './upload-your-document.component.html',
  styleUrls: ['./upload-your-document.component.scss']
})
export class UploadYourDocumentComponent implements OnInit {

  @ViewChild('appCamera') appCamera: CameraComponent;
  hiddenCamera: boolean = true;

  nativeApproach: boolean = false;

  stream;

  constructor() { }

  ngOnInit() {
  
  }

  changeApproachType(){
    this.nativeApproach = !this.nativeApproach;
  }

  triggerCamera() {
    let input = document.getElementById('capture');
    input.click();
  }

  onImageUpdate(event){
    const file = event.target.files[0];
    console.log('Name: '+file.name);
    console.log('Size: '+file.size/Math.pow(1024,2)+' mb');
  }

  openCamera(): void {
    this.appCamera.initCamera();
    this.hiddenCamera = false;
  }

  loadCaptureStream(stream): void {
    this.hiddenCamera = true;
    this.stream = stream;
  }

}