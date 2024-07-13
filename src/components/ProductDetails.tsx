import { getBarcode } from "@/repository/barcodes"
import { useEffect, useState } from "react"

export default function ProductDetails(props: { code: string|null}) {

  let [barcode, setBarcode] = useState({product_id: null, barcode: null});

  useEffect(() => {
    const fetchBarcode = async (code: string|null) => {
      let bcode;
  
      if (code) {
        let res = await fetch('/api/products/barcodes/' + code);
        bcode = await res.json();
      }
  
      if (bcode) {
        setBarcode(bcode);
        return;
      } 
      setBarcode({product_id: null, barcode: null});
    };  
    fetchBarcode(props.code)
  }, [props]);
  
  if (!props.code) {
    return (<></>);
  }
  
  if (!barcode.product_id) {
    return (
      <div className="bg-gray-100 p-5 text-black">
        Barcode is unrecorgnized
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-5 text-black">
      <div>Product ID: {barcode.product_id}</div>
      <div>Barcode In Database: {barcode.barcode}</div>
      <div>Scanned code: {props.code}</div>
    </div>
  )
}