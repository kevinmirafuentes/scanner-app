import { ProductsListProps } from "@/types/types";
import ProductQuantityCard from "./ProductQuantityCard";
import ProductsListLoader from "./ProductsListLoader";
import { useEffect, useState } from "react";
import { FormControl, FormLabel, Text } from "@chakra-ui/react";
import BarcodeInput from "./BarcodeInput";
import { getBarcodeDetails } from "@/lib/utils";

export default function ProductsList({ 
  products,
  onChange,
  supplierId
}: ProductsListProps) {
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<string>('');

  const removeProduct = (index: number) => {
    if (typeof onChange === 'undefined') {
      return;
    }
    onChange(products?.filter((p, i) => i != index))
  };

  const changeQuantity = (index: number, qty: number) => {
    if (typeof onChange === 'undefined') {
      return;
    }
    onChange(
      products?.map((p, i) => {
        if (i === index) {
          p.qty = qty;
        }
        return p;
      })
    )
  }

  const onBarcodeChange = async (barcode: string) => {
    setIsLoading(true);
    let res = await getBarcodeDetails(barcode, supplierId||null);
    let productData = await res.json();
    setIsLoading(false);

    if (!res.ok || !productData?.barcode) {
      alert(`Barcode '${barcode}' not found`)
      return;
    }

    setBarcode('');

    if (typeof onChange === 'undefined') {
      return;
    } 

    for (let i = 0; i < products.length; i++) {
      if (products[i].barcode === productData?.barcode) {
        onChange(products.map(p => (p.barcode === productData?.barcode ? {...p, qty: p.qty+1} : p)));
        return;
      }
    }

    onChange([
      ...products, 
      { ...productData, qty: 1 }
    ]);
  };

  useEffect(() => {
    if (barcode) {
      onBarcodeChange(barcode);
    }
  }, [barcode]);

  return (
    <>
      <FormControl>
        <FormLabel>Type of Scan Barcode</FormLabel>
        <BarcodeInput clearOnChange={true} onChange={(text: string) => setBarcode(text)} />
      </FormControl>

      { products?.map((product, index) => (
        <ProductQuantityCard 
          key={index} 
          product={product} 
          index={index} 
          onClose={() => removeProduct(index)}
          onQuantityChange={(qty: number) => changeQuantity(index, qty)}
        />  
      ))}

      {isLoading && (<ProductsListLoader />)}
    </>
  )
}