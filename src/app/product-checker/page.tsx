"use client"
import BarcodeScanner from "@/components/BarcodeScanner";
import { useState } from "react";

export default function ProductChecker() {

  let [decodedText, setDecodedText] = useState<string|null>(null);

  const successCallback = (text: string) => {
    setDecodedText(text);
  }

  const handleReset =  () => {
    setDecodedText(null);
  }

  return (
    <main className="min-h-screen items-center justify-between">
      <BarcodeScanner onScan={successCallback} />
      <div className="w-full p-5 bg-white text-black flex flex-row items-center justify-between">
				<div>Value: { decodedText }</div>
				<button onClick={handleReset}>Reset</button>
			</div>
    </main>
  );
}
