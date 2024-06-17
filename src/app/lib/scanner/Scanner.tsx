import { Html5Qrcode, QrcodeErrorCallback, QrcodeSuccessCallback } from "html5-qrcode";

export default class Scanner {
  _scanner: Html5Qrcode|null;
  _elemId: string;
  _videoContraints: MediaTrackConstraints;

  constructor() {
    this._elemId = "html5qr-code-full-region";
    this._scanner = null;

   this._videoContraints = {
      focusMode: "continuous",
      advanced:[
        {
          // @ts-ignore: This somehow works in mobile
          zoom: 3
        }
      ]
    }
  }

  init() {
    this._scanner = new Html5Qrcode(this._elemId);
  }
  
  start(onSuccessCallback: QrcodeSuccessCallback) {
    if (!this._scanner) {
      this.init();
    }

    let scannerConfig = {
      fps: 8,
      aspectRatio: 1.0,
      qrbox: {
        width: 300,
        height: 150,
      }
    };

    let onErrorCallback: QrcodeErrorCallback = (e) => {
      console.log(e)
    }

    this._scanner?.start(
      { facingMode: "environment" },
      scannerConfig,
      onSuccessCallback,
      onErrorCallback,
    );
    // sets zoom feature
		setTimeout(() => {
			this._scanner?.applyVideoConstraints(this._videoContraints)
		}, 1000);
  }

  stop(stopScannerCallback: CallableFunction|null) {
    if (this._scanner?.isScanning) {
      this._scanner.stop().then(() => {
        if (typeof stopScannerCallback == 'function') {
          stopScannerCallback();
        }
      });
    }
  }
} 