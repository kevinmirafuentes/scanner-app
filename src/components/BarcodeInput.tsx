import { Input, InputGroup, InputRightAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Skeleton, Text, useDisclosure } from "@chakra-ui/react"
import { faBarcode } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRef, useState } from "react";
import { Html5Qrcode, QrcodeErrorCallback, QrcodeSuccessCallback } from "html5-qrcode";

interface BarcodeInputProps {
  onChange: CallableFunction
};

const qrcodeRegionId = "html5qr-code-full-region";

class Scanner {
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

let scannerObject = new Scanner;

export default function BarcodeInput({ onChange }: BarcodeInputProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let [barcode, setBarcode] = useState<string|number>('');
  const audioRef = useRef();
  
  const playBeepSound = () => {
    if (audioRef.current) {
      audioRef.current.play()
    } 
  }

  const successCallback = (text: string) => {
    playBeepSound();
    scannerObject.stop();
    setBarcode(text);
    onChange(text);
    setTimeout(onClose, 100);
  }

  const handleClose = () => {
    scannerObject.stop();
    setTimeout(onClose, 100)
  }

  const handleOpen = () => {
    // setIsScanning(true);
    onOpen();
    setTimeout(() => scannerObject.start(successCallback), 100);
  }
  return (
    <>
    <InputGroup>
      <Input 
        type='text' 
        value={barcode} 
        onChange={() => onChange(barcode)}
        placeholder='Enter barcode' />
      <InputRightAddon onClick={handleOpen}>
        <FontAwesomeIcon 
          icon={faBarcode}
        ></FontAwesomeIcon>
      </InputRightAddon>
    </InputGroup>
    <Modal isOpen={isOpen} onClose={handleClose} size='sm'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize='lg'>Barcode Scanner</ModalHeader>
        <ModalCloseButton />
        <ModalBody> 
          <div id={qrcodeRegionId} style={{ position: "relative", width: '100%', height: '100%' }} />
        </ModalBody>
      </ModalContent>
    </Modal>
    <audio ref={audioRef} src='/beep.mp3' />
  </>
  )
}