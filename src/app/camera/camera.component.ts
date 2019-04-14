import { Component, OnInit } from '@angular/core';

import DetectRTC from 'detectrtc';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss', './camera.scss']
})
export class CameraComponent implements OnInit {
  video;
  amountOfCameras = 0;

  savedStream: any;
  viewingSnapshot: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  public initCamera(): void {
    DetectRTC.load(() => {
      // Check if camera feature is supported
      if (DetectRTC.isWebRTCSupported == false) {
        alert('Please use Chrome, Firefox, iOS 11, Android 5 or higher, Safari 11 or higher');
      } else {
        if (DetectRTC.hasWebcam == false) {
          alert('Please install an external webcam device.');
        } else {
          this.amountOfCameras = DetectRTC.videoInputDevices.length;
          this.initCameraUI();
          this.initCameraStream();
        }
      }
      console.log("RTC Debug info: " + 
        "\n OS:                   " + DetectRTC.osName + " " + DetectRTC.osVersion + 
        "\n browser:              " + DetectRTC.browser.fullVersion + " " + DetectRTC.browser.name +
        "\n is Mobile Device:     " + DetectRTC.isMobileDevice +
        "\n has webcam:           " + DetectRTC.hasWebcam + 
        "\n has permission:       " + DetectRTC.isWebsiteHasWebcamPermission +       
        "\n getUserMedia Support: " + DetectRTC.isGetUserMediaSupported + 
        "\n isWebRTC Supported:   " + DetectRTC.isWebRTCSupported + 
        "\n WebAudio Supported:   " + DetectRTC.isAudioContextSupported +
        "\n is Mobile Device:     " + DetectRTC.isMobileDevice
      );
    });
  }

  initCameraUI(): void {
    this.video = document.getElementById('video');
  }

  initCameraStream() {
    // Stop any active streams in the window
    if (window['stream']) {
      window['stream'].getTracks().forEach(track => {
        track.stop();
      });
    }

    let constraints = {
      audio: false,
      video: {
        width: { ideal: 4096 },
        height: { ideal: 2160 },
        facingMode: 'environment'
      }
    };

    const handleSuccess = (stream) => {
      window['stream'] = stream; // Make stream available to browser console
      this.video.srcObject = stream;
      return navigator.mediaDevices.enumerateDevices();
    }

    const handleError = (error) => {
      console.log('ERROR: '+error);
      if (error === 'PermissionDeniedError') {
        alert("Permission denied. Please refresh and give permission.");
      }
    }

    navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
  }

  takeSnapshot(): void {
    // if you'd like to show the canvas add it to the DOM
    let canvas = document.querySelector('canvas');

    let width = this.video.videoWidth;
    let height = this.video.videoHeight;

    console.log('VIDEO WIDTH: '+this.video.videoWidth+' VIDEO HEIGHT: '+this.video.videoHeight);

    canvas.width = width;
    canvas.height = height;

    canvas.getContext('2d').drawImage(this.video, 0, this.video.offsetTop, width, height);
    //this.pausePlayVideo();
  }

  clearSnapshot(): void {
    let canvas = document.querySelector('canvas');
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    this.pausePlayVideo();
  }

  stopVideo(): void {
    if (window['stream']) {
      window['stream'].getTracks().forEach(track => {
        track.stop();
      });
    }
  }

  pausePlayVideo(): void {
    this.viewingSnapshot = !this.viewingSnapshot;
    if (this.savedStream) {
      this.video.srcObject = this.savedStream;
      this.video.play();
      this.savedStream = null;
    } else {
      this.video.pause();
      this.savedStream = this.video.srcObject;
      this.video.srcObject = null;
    }
  }

  confirmSnapshot(): void{
    let container = document.getElementById('vid_container')
    let overlay = document.getElementById('overlay');
    let canvasResult = document.createElement('canvas');
    canvasResult.className = 'dni';

    /* let width = overlay.offsetWidth;
    let height = overlay.offsetHeight; */

    /* let aspect = this.video.videoHeight / this.video.videoWidth;
    let width = this.video.videoWidth - 100;   // or use height
    let height = Math.round(width * aspect); */

    const width = this.video.videoWidth*0.8;
    const height = this.video.videoHeight*0.35;

    console.log('width: '+width+' height: '+height);

    canvasResult.width = width;
    canvasResult.height = height;

    /* let left = 50;
    let top =  this.video.videoHeight/3; */

    const left = this.video.videoWidth*0.08;
    const top = this.video.videoHeight*0.35;

    console.log('LEFT: '+left+' TOP: '+top);

    let imageData = document.querySelector('canvas').getContext("2d").getImageData(left, top, width, height);

    //canvasResult.getContext('2d').drawImage(this.video, 0, 0, width, height);

    let ctx = canvasResult.getContext("2d");
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.putImageData(imageData, 0, 0);

    this.stopVideo();

    const getCanvasBlob = (canvas) => {
      return new Promise(resolve => {
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      })
    };

    // some API's (like Azure Custom Vision) need a blob with image data
    getCanvasBlob(canvasResult).then((blob) => {
      console.log('Size: '+blob.size/Math.pow(1024,2));
      // do something with the image blob
      let reader = new FileReader();
      reader.onload = () => {
        console.log('Blob in Base64 READY TO BE SENT'+reader.result);
        navigator.clipboard.writeText(reader.result);
      };
      reader.readAsDataURL(blob); // converts the blob to base64 and calls onload
    });
  }

}