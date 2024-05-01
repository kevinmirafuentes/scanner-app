"use client"

import { Html5Qrcode } from 'html5-qrcode';
import { Html5QrcodeError } from 'html5-qrcode/esm/core';
import { useEffect } from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

const videoContraints: MediaTrackConstraints = {
	focusMode: "continuous",
	advanced:[
		{
			// @ts-ignore: This somehow works in mobile
			zoom: 2
		}
	]
}
const scannerConfig = {
	fps: 8,
	aspectRatio: 1.0,
	qrbox: {
		width: 300,
		height: 150,
	},
};

let scanner: Html5Qrcode;

type OnScan = (decodedText: string) => void;

interface BarcodeScannerProps {
	onScan?: OnScan|undefined
};

export default function BarcodeScanner({ onScan }: BarcodeScannerProps) {

	const onSuccessCallback = (result: string) => {
		onScan(result);
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
			scanner.applyVideoConstraints(videoContraints)
		}, 1000);
	}

	const stop = () => {
		if (!scanner.isScanning) {
			return
		}
		scanner.stop()
	};

	useEffect(() => {
		if (!scanner) {
			scanner = new Html5Qrcode(qrcodeRegionId);
			start();
		}
	});

	return (
		<div className="w-full">
			<div id={qrcodeRegionId} style={{ position: "relative", width: '100%', height: '100%' }} />
		</div>
	);
};