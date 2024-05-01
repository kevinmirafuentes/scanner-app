"use client"

import { useState } from "react";
import BarcodeScanner from "./BarcodeScanner";

export default function ProductBarcodeChecker() {

    let [decodedText, setDecodedText] = useState();

    const handleOnScan = () => {

    };

    const handleReset = () => {
		setDecodedText(null);
	};

    return (
        <div className="w-full">
            <BarcodeScanner onScan={handleOnScan} />
            <div className="p-5 bg-white text-black flex flex-row items-center justify-between">
				<div>Value: { decodedText }</div>
				<button onClick={handleReset}>Reset</button>
			</div>
        </div>
    );
};