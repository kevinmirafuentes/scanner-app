"use client";
import BarcodeInput from "@/components/BarcodeInput";
import { NavFooterLayout } from "@/components/NavFooterLayout";
import ProductQuantityCard from "@/components/ProductQuantityCard";
import RequestTagPrint from "@/components/RequestTagPrint";
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { getBarcodeDetails, printInNewTab } from "@/lib/utils";
import { StoreRequestItem } from "@/types/types";
import { Button, Card, CardBody, Checkbox, Container, FormControl, FormLabel, HStack, Input, Skeleton, Stack, Text, VStack, VisuallyHidden, useToast } from "@chakra-ui/react";
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
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const toast = useToast();

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
        retail_unit_price: productData.retail_unit_price,
        qty: 1,
      }
      setProducts([...products, product]);
    });
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((p, i) => i != index));
  };

  const resetForm = () => {
    setProducts([]);
    getMaxReferenceNumber();
  }

  const handleSaveAndPrint = async () => {
    let res = await save()
    let data = await res?.json();

    if (referenceNumber != data.ref_id) {
      alert(`Reference number ${referenceNumber} is already taken. Generated a new number: ${data.ref_id}`)
    }

    printInNewTab( `/tag-request/${data.ref_id}/print`);
  }

  const save = async () => {
    if (products.length == 0) {
      return;
    }

    setIsSaving(true);
    return fetch('/api/tag-request', {
      method: "POST",
      body: JSON.stringify({
        items: products, 
      }),
    })
    .then(e => {

      toast({
        title: 'Stock request created.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      resetForm(); 
      return e;
    
    })
    .finally(() =>setIsSaving(false))
    .catch((e) => console.log(e));
  };

  const getMaxReferenceNumber = async () => {
    let res = await fetch("/api/tag-request/nextrefid", { method: "POST" });
    let resJson = await res.json();
    setReferenceNumber(resJson.maxrefnum);
  }

  useEffect(() => {
    getMaxReferenceNumber();
  }, []);

  return (
    <NavFooterLayout title='Request Tag' activeFooter='tag-request'>
      <Container>
        <VStack spacing='20px'>
        <FormControl>
            <FormLabel>Reference No.</FormLabel>
            <Input 
              type='text' 
              readOnly={true}
              value={referenceNumber} 
              onChange={e =>setReferenceNumber(e.target.value)} 
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
              onClick={handleSaveAndPrint}
              isLoading={isSaving}
            >
              Print
            </Button>
          </HStack>

        </VStack>
      </Container>
    </NavFooterLayout> 
  ) 
}