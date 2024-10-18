"use client";
import BarcodeInput from "@/components/BarcodeInput";
import { NavFooterLayout } from "@/components/NavFooterLayout";
import ProductQuantityCard from "@/components/ProductQuantityCard";
import { getBarcodeDetails } from "@/lib/utils";
import { StoreRequestItem } from "@/types/types";
import { Button, Card, CardBody, Checkbox, Collapse, Container, FormControl, FormLabel, HStack, Input, Radio, Select, Skeleton, Stack, Text, VStack, VisuallyHidden, useToast } from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function SkeletonLoader() {
  return (
    <Card width='100%'>
        <CardBody>
          <Stack spacing='13px'>
            <Skeleton height='20px' />
            <Skeleton height='20px' />
            <Skeleton height='20px' />
          </Stack>
        </CardBody>
      </Card>
  );
} 

export default function StockRequest() {
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');1
  const [date, setDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [products, setProducts] = useState<StoreRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [printLayout, setPrintLayout] = useState<number>(1);
  const [barcode, setBarcode] = useState<string>('');
  const toast = useToast();
  
  const save = async () => {
    if (!isValidForm()) {
      alert('Please fill out all fields on stock request form.');
      return;
    }

    setIsSaving(true);
    return fetch("/api/stock-request", {
      method: "POST",
      body: JSON.stringify({
        ref_no: referenceNumber, 
        trans_date: date, 
        remarks, 
        items: products, 
      }),
      headers: {
        "content-type": "application/json",
      },
    })
    .then((e) => { 
      
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

  const resetForm = () => {
    setProducts([]);
    setReferenceNumber('');
    setRemarks('');
    setDate(moment().format('YYYY-MM-DD'));
    getMaxReferenceNumber();
  };

  const isValidForm = () => {
    if (referenceNumber.length == 0) return false;
    if (date.length == 0) return false; 
    if (products.length == 0) return false;
    return true;
  };

  const submit = async () => {
    let res = await save()
    let data = await res?.json();
    
    if (referenceNumber != data.ref_no) {
      alert(`Reference number ${referenceNumber} is already taken. Generated a new number: ${data.ref_no}`)
    }

    let url = `/stock-request/${data.ref_id}/print`;
    if (printLayout == 2) {
      url = `/stock-request/${data.ref_id}/print-pos`;
    }
    let win = window.open('', '_blank');
    if (win) {
      win.location = url;
    }
  };

  const onBarcodeChange = async (barcode: string) => {
    setBarcode('');
    setIsLoading(true);
    let res = await getBarcodeDetails(barcode);

    let productData = await res.json();
    setIsLoading(false);

    if (!res.ok || !productData?.barcode) {
      alert(`Barcode '${barcode}' not found`)
      return;
    }
    setProducts([
      ...products, 
      {
        product_id: productData?.product_id,
        barcode: productData?.barcode, 
        barcode_id: productData.barcode_id,
        name: productData?.name,
        qty: 1,
      }
    ]);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((p, i) => i != index));
  };

  const getMaxReferenceNumber = async () => {
    let res = await fetch("/api/stock-request/maxrefnum", { method: "POST" });
    let resJson = await res.json();
    setReferenceNumber(resJson.maxrefnum);
  }

  useEffect(() => {
    getMaxReferenceNumber();
  }, []);

  useEffect(() => {
    if (barcode)  {
      onBarcodeChange(barcode);
    }
  }, [barcode]);

  return (
    <NavFooterLayout title='Stock Adjustments - IN' activeFooter='stock-adjustments-in'>
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
            <BarcodeInput clearOnChange={true} onChange={(text: string) => setBarcode(text)} />
          </FormControl>
          
          { products.map((product, index) => (
            <ProductQuantityCard 
              key={index} 
              product={product} 
              index={index} 
              onClose={() => removeProduct(index)}
              onQuantityChange={(qty: number) => product.qty = qty}
            />  
          ))}

          {isLoading && (<SkeletonLoader />)}
          
          <HStack width='100%' marginTop='20px'>
            <Button 
              type='button' 
              backgroundColor='teal.300' 
              color="white" 
              width="100%" 
              fontWeight="normal"
              fontSize='sm'
              isLoading={isSaving}
              onClick={submit}
            >
              Save
            </Button>
          </HStack>
  
        </VStack>
      </Container>
    </NavFooterLayout>  
  )
}