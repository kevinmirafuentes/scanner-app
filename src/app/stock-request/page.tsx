"use client";
import BarcodeInput from "@/components/BarcodeInput";
import { NavFooterLayout } from "@/components/NavFooterLayout";
import ProductQuantityCard from "@/components/ProductQuantityCard";
import { StockRequestPrint } from "@/components/StockRequestPrint";
import { getBarcodeDetails } from "@/lib/utils";
import { StoreRequestItem } from "@/types/types";
import { Button, Card, CardBody, Checkbox, Container, FormControl, FormLabel, HStack, Input, Skeleton, Stack, Text, VStack, VisuallyHidden } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

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
  const [date, setDate] = useState<string>('');
  const [products, setProducts] = useState<StoreRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  let stockRequestPrintRef = useRef();
  const router = useRouter();

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
    .then((e) => { resetForm(); return e;})
    .finally(() =>setIsSaving(false))
    .catch((e) => console.log(e));
  };

  const resetForm = () => {
    setProducts([]);
    setReferenceNumber('');
    setRemarks('');
    setDate('');
  };

  const isValidForm = () => {
    if (referenceNumber.length == 0) return false;
    if (remarks.length == 0) return false;
    if (date.length == 0) return false; 
    if (products.length == 0) return false;
    return true;
  };

  const saveAndPrint = async () => {
    let res = await save()
    let data = await res.json();
    router.push(`/stock-request/${data.ref_id}/print`)
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
              onQuantityChange={(qty: number) => product.qty = qty}
            />  
          ))}

          {isLoading && (<SkeletonLoader />)}

          <VStack spacing={5} mt='20px' alignItems='start' width='100%'>
            <Text fontWeight='bold'>Print Options</Text>
            <Checkbox defaultChecked>Document Layout</Checkbox>
            <Checkbox>Small Layout</Checkbox>
          </VStack>

          <HStack width='100%' marginTop='20px'>
            <Button 
              type='submit' 
              backgroundColor='gray.300' 
              color="black" 
              width="100%" 
              fontWeight="normal"
              fontSize='sm'
              onClick={save}
              isLoading={isSaving}
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
              isLoading={isSaving}
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