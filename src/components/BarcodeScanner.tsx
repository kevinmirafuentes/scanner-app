"use client"

import { Html5Qrcode, Html5QrcodeResult, Html5QrcodeScanner, QrcodeErrorCallback, QrcodeSuccessCallback } from 'html5-qrcode';
import { Html5QrcodeError } from 'html5-qrcode/esm/core';
import { Html5QrcodeScannerConfig } from 'html5-qrcode/esm/html5-qrcode-scanner';
import { useEffect, useRef, useState } from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

const scannerConfig = {
	fps: 8,
	aspectRatio: 1.0,
	qrbox: {
		width: 300,
		height: 150,
	},

	focusMode: "continuous",
	advanced:[
		{
			zoom: 2
		}
	]
};

let scanner: Html5Qrcode;


type OnScan = (decodedText: string) => void;

interface BarcodeScannerProps {
	// verbose?: boolean;
	// fps?: number|null|undefined;
	// success: QrcodeSuccessCallback;
	// error?: QrcodeErrorCallback;

	onScan?: OnScan|undefined
};



export default function BarcodeScanner({ onScan }: BarcodeScannerProps) {

	const onSuccessCallback = (result: string) => {
		onScan(result);
		setDecodedText(result);
	}

	const onErrorCallback = (errorMessage: string, error: Html5QrcodeError) => {
		// console.log(errorMessage);
	}

	const start = () => {
		scanner.start(
				{ facingMode: "environment" },
				scannerConfig,
				onSuccessCallback,
				onErrorCallback,
		)
		.catch((error) => {
				console.error('Error starting HTML5 QR Code:', error);
		})
		// sets zoom feature
		setTimeout(() => {
			scanner.applyVideoConstraints({ focusMode: "continuous", advanced: [ { zoom: 2 } ]})
		}, 2000);
	}

	const stop = () => {
		if (!scanner.isScanning)
			return
			scanner.stop()
	};

	const handleReset = () => {
		setDecodedText(null);
	};

	useEffect(() => {
		if (!scanner) {
			scanner = new Html5Qrcode(qrcodeRegionId);
			start();
		}
	});

	const [decodedText, setDecodedText ] = useState();

	return (
		<div className="w-full">
			<div id={qrcodeRegionId} style={{ position: "relative", width: '100%', height: '100%' }} />
			<div className="p-5 bg-white text-black flex flex-row items-center justify-between">
				<div>Value: { decodedText }</div>
				<button onClick={handleReset}>Reset</button>
			</div>
		</div>
	);
};