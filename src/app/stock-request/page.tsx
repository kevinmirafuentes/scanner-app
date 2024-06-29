"use client";
import BarcodeInput from "@/components/BarcodeInput";
import { NavFooterLayout } from "@/components/NavFooterLayout";
import ProductQuantityCard from "@/components/ProductQuantityCard";
import { getProductByBarcode } from "@/repository/users";
import { StockRequestProduct } from "@/types/types";
import { Button, Card, CardBody, Container, FormControl, FormLabel, HStack, Input, Skeleton, Stack, VStack } from "@chakra-ui/react";
import { useState } from "react";

function SkeletonLoader() {
  return (
    <Container> 
      <Card width='100%'>
        <CardBody>
          <Stack spacing='13px'>
            <Skeleton height='20px' />
            <Skeleton height='20px' />
            <Skeleton height='20px' />
          </Stack>
        </CardBody>
      </Card>
    </Container>
  );
} 

const getBarcodeDetails = async (barcode: string) => {
  let res = await fetch(`/api/products/${barcode}/data`);
  return res;
}

export default function StockRequest() {
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');1
  const [date, setDate] = useState<string>('');
  const [products, setProducts] = useState<StockRequestProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const save = () => {
    console.log({referenceNumber, remarks, date, products})
  };
  const saveAndPrint = () => {
    console.log({referenceNumber, remarks, date, products})
  };

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
        name: productData?.name,
        quantity: 1,
      }
      setProducts([...products, product]);
    });

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
            <Input 
              type='text' 
              value={referenceNumber} 
              onChange={e =>setReferenceNumber(e.target.value)} 
            />
          </FormControl>
          <FormControl>
            <FormLabel>Remarks</FormLabel>
            <Input 
              type='text' 
              value={remarks} 
              onChange={e =>setRemarks(e.target.value)} 
            />
          </FormControl>
          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input 
              type='date' 
              value={date} 
              onChange={e =>setDate(e.target.value)} 
            />
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
              onClose={() => removeProduct(index)}
            />  
          ))}

          {isLoading && (<SkeletonLoader />)}

          <HStack width='100%' marginTop='20px'>
            <Button 
              type='submit' 
              backgroundColor='gray.300' 
              color="black" 
              width="100%" 
              fontWeight="normal"
              fontSize='sm'
              onClick={save}
            >
              Save
            </Button>
            <Button 
              type='submit' 
              backgroundColor='teal.300' 
              color="white" 
              width="100%" 
              fontWeight="normal"
              fontSize='sm'
              onClick={saveAndPrint}
            >
              Print
            </Button>
          </HStack>
  
        </VStack>
      </Container>
    </NavFooterLayout>  
  )
}