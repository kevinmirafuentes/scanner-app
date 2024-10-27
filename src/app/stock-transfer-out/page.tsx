"use client";
import { NavFooterLayout } from "@/components/NavFooterLayout";
import ProductsList from "@/components/ProductsList";
import { StoreRequestItem } from "@/types/types";
import { Button, Container, FormControl, FormLabel, HStack, Input, Select, VStack, useToast } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";

export default function StockTransferOut() {
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [stockRequestNo, setStockRequestNo] = useState<string>('');
  const [date, setDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [products, setProducts] = useState<StoreRequestItem[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const toast = useToast();
  
  const showSuccess = () => {
    toast({
      title: 'Stock transfer created.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  };

  const save = async () => {
    if (!isValidForm()) {
      alert('Please fill out all fields on the form.');
      return;
    }
    setIsSaving(true);
    const payload = {
      method: "POST",
      body: JSON.stringify({
        items: products, 
      }),
    };
    return fetch('/api/stock-transfer-out', payload)
      .then(e => {
        showSuccess();
        resetForm();
        return e;
      })
      .finally(() => setIsSaving(false))
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

  const getMaxReferenceNumber = async () => {
    setReferenceNumber(1)
  }

  useEffect(() => {
    getMaxReferenceNumber();
  }, []);

  return (
    <NavFooterLayout title='Stock Transfer - OUT' activeFooter='stock-transfer-out'>
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
            <FormLabel>Requesting Branch</FormLabel>
            <Select></Select>
          </FormControl>
          <FormControl>
            <FormLabel>Stock Request No.</FormLabel>
            <Input 
              type='text' 
              value={stockRequestNo}
              onChange={e => setStockRequestNo(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Remarks</FormLabel>
            <Input 
              type='text' 
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input 
              type='date' 
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </FormControl>
          
          <ProductsList
            products={products}
            onChange={(p: StoreRequestItem[]) => setProducts(p)}
          />
          
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