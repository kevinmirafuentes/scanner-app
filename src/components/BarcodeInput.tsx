"use client"
import { Box, Input, InputGroup, InputRightAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Skeleton, Text, useDisclosure } from "@chakra-ui/react"
import { faBarcode } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef, useState } from "react";
import Scanner from "@/lib/scanner/Scanner";
import useFocus from "@/lib/useFocus";

interface BarcodeInputProps {
  onChange: CallableFunction,
  clearOnChange?: boolean|null
};

let scannerObject = new Scanner;
let debounce: any;

export default function BarcodeInput({ onChange, clearOnChange }: BarcodeInputProps) {
  let [barcode, setBarcode] = useState<string>('');
  const audioRef = useRef();
  const [inputRef, setFocus] = useFocus<HTMLButtonElement>();

  const playBeepSound = () => {
    if (audioRef.current) {
      // @ts-ignore
      audioRef.current.play()
    }
  }

  const successCallback = (text: string) => {
    playBeepSound();
    setBarcode('')
    onChange(text);
    scannerObject.pause();
    setTimeout(() => scannerObject.resume(), 1000);
  }

  const handleChange = (e: any) => {
    setBarcode(e.target.value);
    if (debounce) {
      clearTimeout(debounce);
    }
    debounce = setTimeout(() => {
      onChange(e.target.value);
      clearOnChange && setBarcode('');
    }, 2000);

    setFocus();
  }

  const handleManualSubmit = () => {
    if (!barcode) {
      return;
    }
    if (debounce) {
      clearTimeout(debounce);
    }
    onChange(barcode);
    clearOnChange && setBarcode('');
  }

  useEffect(() => {
    setTimeout(() => scannerObject.start(successCallback), 100);
  })

  return (
    <>
    <Box marginBottom={10}>
      <div id={scannerObject._elemId} style={{ position: "relative" }} />
    </Box>
    <InputGroup>
      <Input
        ref={inputRef}
        autoFocus 
        type='number'
        value={barcode}
        onChange={handleChange}
        placeholder='Enter barcode' />
      <InputRightAddon onClick={handleManualSubmit}>
        <FontAwesomeIcon
          icon={faBarcode}
        ></FontAwesomeIcon>
      </InputRightAddon>
    </InputGroup>
    {/* @ts-ignore */}
    <audio ref={audioRef} src='/assets/beep.mp3' />
  </>
  )
}