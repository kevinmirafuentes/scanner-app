"use client";
import BarcodeInput from "@/components/BarcodeInput";
import { NavFooterLayout } from "@/components/NavFooterLayout";
import ProductQuantityCard from "@/components/ProductQuantityCard";
import RequestTagPrint from "@/components/RequestTagPrint";
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { getBarcodeDetails } from "@/lib/utils";
import { StoreRequestItem } from "@/types/types";
import { Button, Card, CardBody, Checkbox, Container, FormControl, FormLabel, HStack, Input, Skeleton, Stack, Text, VStack, VisuallyHidden } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

function SkeletonLoader() {
  return (
    <Card width='100%'>
      <CardBody>
        <Stack spacing='10px'>
          <Skeleton height='20px' />
          <Skeleton height='20px' />
          <Skeleton height='20px' />
        </Stack>
      </CardBody>
    </Card>
  );
} 

export default function TagRequest() {
  const [products, setProducts] = useState<StoreRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [test, setTest] = useState<boolean>();

  const onBarcodeChange = (barcode: string) => {
    setIsLoading(true);
    getBarcodeDetails(barcode).then(async (res: Response) => {
      let productData = await res.json();
      setIsLoading(false);

      if (!res.ok || !productData?.barcode) {
        alert(`Barcode '${barcode}' not found`)
        return;
      }

      let product = {
        product_id: productData?.product_id,
        barcode: productData?.barcode, 
        barcode_id: productData.barcode_id,
        name: productData?.name,
        qty: 1,
      }
      setProducts([...products, product]);
    });
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((p, i) => i != index));
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <NavFooterLayout title='Request Tag' activeFooter='tag-request'>
      <Container>
        <VStack spacing='20px'>
          <FormControl>
            <FormLabel>Type of Scan Barcode</FormLabel>
            <BarcodeInput clearOnChange={true} onChange={onBarcodeChange} />
          </FormControl>

          { products.map((product, index) => (
            <ProductQuantityCard 
              key={index} 
              product={product} 
              index={index} 
              onClose={() => removeProduct(index)}
              onQuantityChange={(qty: number) => {
                product.qty = qty;
                // force rerender for print component
                setTest(!test);
              }}
            />  
          ))}

          {isLoading && (<SkeletonLoader />)}
          
          <HStack width='100%' justifyContent='center'>
            <Button 
              type='button' 
              backgroundColor='teal.300' 
              color="white" 
              width={['100%', 'auto']} 
              fontWeight="normal"
              fontSize='sm'
              onClick={handlePrint}
            >
              Print
            </Button>
          </HStack>

        </VStack>

        <VisuallyHidden>
          <RequestTagPrint ref={componentRef} items={products} />
        </VisuallyHidden>
      </Container>
    </NavFooterLayout> 
  ) 
}