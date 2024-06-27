import { Input, InputGroup, InputRightAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Skeleton, Text, useDisclosure } from "@chakra-ui/react"
import { faBarcode } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRef, useState } from "react";
import Scanner from "@/lib/scanner/Scanner";

interface BarcodeInputProps {
  onChange: CallableFunction,
  clearOnChange?: boolean|null
};

let scannerObject = new Scanner;
let debounce: any;

export default function BarcodeInput({ onChange, clearOnChange }: BarcodeInputProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let [barcode, setBarcode] = useState<string>('');
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
    clearOnChange && setBarcode('');
    scannerObject.stop(onClose);
  }

  const handleClose = () => {
    scannerObject.stop(onClose);
  }

  const handleOpen = () => {
    onOpen();
    setTimeout(() => scannerObject.start(successCallback), 100);
  }

  const handleChange = (e: any) => {
    setBarcode(e.target.value);
    
    if (debounce) {
      clearTimeout(debounce);
    }
    debounce = setTimeout(() => {
      onChange(e.target.value);
      clearOnChange && setBarcode('');
    }, 500);
  }

  return (
    <>
    <InputGroup>
      <Input 
        type='number' 
        value={barcode}
        onChange={handleChange}
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
    <audio ref={audioRef} src='/assets/beep.mp3' />
  </>
  )
}