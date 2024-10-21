"use client";
import BarcodeInput from "@/components/BarcodeInput";
import ComboBox from "@/components/ComboBox";
import { NavFooterLayout } from "@/components/NavFooterLayout";
import ProductQuantityCard from "@/components/ProductQuantityCard";
import SelectSupplier from "@/components/SelectSupplier";
import { getBarcodeDetails } from "@/lib/utils";
import { ComboBoxOption, StoreRequestItem, Supplier } from "@/types/types";
import { Button, Card, CardBody, Container, FormControl, FormLabel, HStack, Input, Radio, Select, Skeleton, Stack, Text, VStack, VisuallyHidden, useToast } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";

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
  const [latestReferenceNumber, setLatestReferenceNumber] = useState<string>('');
  const [supplier, setSupplier] = useState<string>('');
  const [date, setDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [products, setProducts] = useState<StoreRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<string>('');
  const toast = useToast();
  
  const save = async () => {
    if (!isValidForm()) {
      alert('Please fill out all fields on the form.');
      return;
    }

    toast({
      title: 'Physical count created.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })

    resetForm();
  };

  const resetForm = () => {
    setProducts([]);
    setReferenceNumber('');
    setLatestReferenceNumber('');
    setDate(moment().format('YYYY-MM-DD'));
    getMaxReferenceNumber();
  };

  const isValidForm = () => {
    if (referenceNumber.length == 0) return false;
    if (supplier.length == 0) return false; 
    if (date.length == 0) return false; 
    if (products.length == 0) return false;
    return true;
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
    return 1;
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
    <NavFooterLayout title='Physical Count' activeFooter='physical-count'>
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
            <FormLabel>Latest Reference No.</FormLabel>
            <Input 
              type='text' 
              readOnly={true}
              value={latestReferenceNumber}
              onChange={e => setLatestReferenceNumber(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Supplier</FormLabel>
            <SelectSupplier onChange={(supplier: string) => setSupplier(supplier)}></SelectSupplier>
          </FormControl>
          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input 
              type='date' 
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
              onClick={save}
            >
              Save
            </Button>
          </HStack>
  
        </VStack>
      </Container>
    </NavFooterLayout>  
  )
}