import { Component, OnInit } from '@angular/core';

import DetectRTC from 'detectrtc';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {
  video;
  takePhotoButton;
  toggleFullScreenButton;
  
  amountOfCameras = 0;
  currentFacingMode = 'environment';

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

    this.takePhotoButton = document.getElementById('takePhotoButton');
    this.toggleFullScreenButton = document.getElementById('toggleFullScreenButton');

    // https://developer.mozilla.org/nl/docs/Web/HTML/Element/button
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role

    this.takePhotoButton.addEventListener("click", () => {
      //this.takeSnapshotUI();
      this.takeSnapshot();
    });

    // Listen for orientation changes to make sure buttons stay at the side of the 
    // physical (and virtual) buttons (opposite of camera) most of the layout change is done by CSS media queries
    // https://www.sitepoint.com/introducing-screen-orientation-api/
    // https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
    window.addEventListener("orientationchange", () => {
      let angle;

      // iOS doesn't have screen.orientation, so fallback to window.orientation.
      // screen.orientation will 
      if (screen.orientation) angle = screen.orientation.angle;
      else angle = window.orientation;

      let guiControls = document.getElementById("gui_controls").classList;
      let vidContainer = document.getElementById("vid_container").classList;

      if (angle == 270 || angle == -90) {
        guiControls.add('left');
        vidContainer.add('left');
      } else {
        if (guiControls.contains('left')) guiControls.remove('left');
        if (vidContainer.contains('left')) vidContainer.remove('left');
      }

      //0   portrait-primary   
      //180 portrait-secondary device is down under
      //90  landscape-primary  buttons at the right
      //270 landscape-secondary buttons at the left
    }, false);
  }

  initCameraStream() {

    // stop any active streams in the window
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
        //width: { min: 1024, ideal: window.innerWidth, max: 1920 },
        //height: { min: 720, ideal: window.innerHeight, max: 1080 },
        facingMode: this.currentFacingMode
      }
    };

    const handleSuccess = (stream) => {

      window['stream'] = stream; // make stream available to browser console
      this.video.srcObject = stream;

      if (constraints.video.facingMode) {

        if (constraints.video.facingMode === 'environment') {
          //this.switchCameraButton.setAttribute("aria-pressed", true);
        } else {
          //this.switchCameraButton.setAttribute("aria-pressed", false);
        }
      }

      return navigator.mediaDevices.enumerateDevices();
    }

    const handleError = (error) => {

      console.log(error);

      //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
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

  clearCanvas(): void {
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

  useDNIMedia(): void{
    let container = document.getElementById('vid_container')
    let overlay = document.getElementById('video_overlay');
    let canvasResult = document.createElement('canvas');
    canvasResult.className = 'dni';

    /* let width = overlay.offsetWidth;
    let height = overlay.offsetHeight; */
    console.log('video: '+this.video+' - '+this.video.videoWidth)

    let aspect = this.video.videoHeight / this.video.videoWidth;
    let width = this.video.videoWidth - 100;   // or use height
    let height = Math.round(width * aspect);
    //console.log('OVERLAY WIDTH: '+width+' OVERLAY HEIGHT: '+height);

    canvasResult.width = width;
    canvasResult.height = height;

    console.log('overlay.offsetLeft: '+overlay.offsetLeft+' overlay.offsetTop: '+overlay.offsetTop);
    console.log('container.offsetLeft: '+container.offsetLeft+' container.offsetTop: '+container.offsetTop);

    /* let left = overlay.offsetLeft - container.offsetLeft;
    let top =  overlay.offsetTop - container.offsetTop; */

    let left = 50;
    let top =  this.video.videoHeight/3;

    console.log('LEFT: '+left+' TOP: '+top);

    let imageData = document.querySelector('canvas').getContext("2d").getImageData(left, top, width, height);

    //canvasResult.getContext('2d').drawImage(this.video, 0, 0, width, height);

    let ctx = canvasResult.getContext("2d");
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.putImageData(imageData, 0, 0);

    this.stopVideo();

    // polyfil if needed https://github.com/blueimp/JavaScript-Canvas-to-Blob
    
    // https://developers.google.com/web/fundamentals/primers/promises
    // https://stackoverflow.com/questions/42458849/access-blob-value-outside-of-canvas-toblob-async-function
    const getCanvasBlob = (canvas) => {
      return new Promise(resolve => {
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      })
    };

    // some API's (like Azure Custom Vision) need a blob with image data
    getCanvasBlob(canvasResult).then((blob) => {
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