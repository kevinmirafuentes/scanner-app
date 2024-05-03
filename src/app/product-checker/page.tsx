"use client"
import BarcodeScanner from "@/components/BarcodeScanner";
import ProductDetails from "@/components/ProductDetails";
import Link from "next/link";
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
      <ProductDetails code={decodedText} />
      <div className="p-5">
        Chrome’s security policy will only allow you to access your device’s microphone/camera when a site’s has a secure origin.  
        <ol>
          <li>1. Navigate to <a href="chrome://flags/#unsafely-treat-insecure-origin-as-secure" className="text-blue-300" target="__blank">`chrome://flags/#unsafely-treat-insecure-origin-as-secure`</a> in Chrome.</li>
          <li>2. Find and enable the `Insecure origins treated as secure` section (see below).</li>
          <li>3. Add the IP address to ignore the secure origin policy for. Remember to include the port number too (if required).</li>
          <li>4. Save and restart Chrome.</li>
        </ol>
      </div>
    </main>
  );
}
