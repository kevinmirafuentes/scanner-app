"use client";
import BarcodeInput from "@/components/BarcodeInput";
import { NavFooterLayout } from "@/components/NavFooterLayout";
import ProductQuantityCard from "@/components/ProductQuantityCard";
import { StockRequestProduct } from "@/types/types";
import { Container, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";
import { useState } from "react";

export default function StockRequest() {
  const [products, setProducts] = useState<StockRequestProduct[]>([]);

  const onBarcodeChange = (barcode: string) => {
    let product = {
      barcode: barcode, 
      name: 'prod name',
      quantity: 1,
    }
    setProducts([...products, product]);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((p, i) => i != index));
  };

  return (
    <NavFooterLayout title='Stock Request' activeFooter='stock-request'>
      <Container>
        <VStack spacing='20px'>
          <FormControl>
            <FormLabel>Reference No.</FormLabel>
            <Input type='text' />
          </FormControl>
          <FormControl>
            <FormLabel>Remarks</FormLabel>
            <Input type='text' />
          </FormControl>
          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input type='date' />
          </FormControl>
          <FormControl>
            <FormLabel>Type of Scan Barcode</FormLabel>
            <BarcodeInput clearOnChange={true} onChange={onBarcodeChange} />
          </FormControl>
          { products.map((product, index) => (
            <ProductQuantityCard 
              key={index} 
              product={product} 
              index={index} 
              onClose={e => removeProduct(index)}
            />  
          ))}
  
        </VStack>
      </Container>
    </NavFooterLayout>  
  )
}