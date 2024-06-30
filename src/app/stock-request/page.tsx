"use client";
import BarcodeInput from "@/components/BarcodeInput";
import { NavFooterLayout } from "@/components/NavFooterLayout";
import ProductQuantityCard from "@/components/ProductQuantityCard";
import { StockRequestPrint } from "@/components/StockRequestPrint";
import { StoreRequestItem } from "@/types/types";
import { Button, Card, CardBody, Container, FormControl, FormLabel, HStack, Input, Skeleton, Stack, VStack, VisuallyHidden } from "@chakra-ui/react";
import { useRef, useState } from "react";
import ReactToPrint, { useReactToPrint } from "react-to-print";

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
  const [products, setProducts] = useState<StoreRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  let stockRequestPrintRef = useRef();

  const save = () => {
    if (!isValidForm()) {
      alert('Please fill out all fields on stock request form.');
      return;
    }

    setIsSaving(true);
    fetch("/api/stock-request", {
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
    .then((e) => resetForm())
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

            <ReactToPrint
              trigger={() => <Button 
                type='submit' 
                backgroundColor='teal.300' 
                color="white" 
                width="100%" 
                fontWeight="normal"
                fontSize='sm'
                isLoading={isSaving}
              >
                Print
              </Button>}
              content={() => stockRequestPrintRef}
            />
            
          </HStack>
  
        </VStack>

        <VisuallyHidden>
          <StockRequestPrint ref={(el) => (stockRequestPrintRef = el)} />
        </VisuallyHidden>
      </Container>
    </NavFooterLayout>  
  )
}