import { Input, InputGroup, InputRightAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Skeleton, Text, useDisclosure } from "@chakra-ui/react"
import { faBarcode } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRef, useState } from "react";
import Scanner from "@/app/lib/scanner/scanner";

interface BarcodeInputProps {
  onChange: CallableFunction
};

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
    setBarcode(text);
    onChange(text);
    scannerObject.stop(onClose);
  }

  const handleClose = () => {
    scannerObject.stop(onClose);
  }

  const handleOpen = () => {
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
          <div id={scannerObject._elemId} style={{ position: "relative", width: '100%', height: '100%' }} />
        </ModalBody>
      </ModalContent>
    </Modal>
    <audio ref={audioRef} src='/beep.mp3' />
  </>
  )
}