"use server"

import { getBarcode } from "@/repository/barcodes"

export default async function ProductDetails(props: { code: string|null}) {
  const barcode = await getBarcode('20600005428');
  return (
    <div>
      <div>Product ID: {barcode.product_id}</div>
      <div>Barcode: {barcode.barcode}</div>
      <div>Scanned code: {props.code}</div>
    </div>
  )
}