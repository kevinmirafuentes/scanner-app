"use client";
import { NavFooterLayout } from "@/components/NavFooterLayout";
import ProductsList from "@/components/ProductsList";
import SelectSupplier from "@/components/SelectSupplier";
import { StoreRequestItem } from "@/types/types";
import { Button, Container, FormControl, FormLabel, HStack, Input, UseToastOptions, VStack, useToast } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";

export default function PhysicalCount() {
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [latestReferenceNumber, setLatestReferenceNumber] = useState<string>('');
  const [supplier, setSupplier] = useState<string>('');
  const [date, setDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [products, setProducts] = useState<StoreRequestItem[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const toast = useToast();
  
  const showSuccess = () => {
    toast({
      title: 'Physical count created.',
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
    return fetch('/api/physical-count', payload)
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
    setLatestReferenceNumber('');
    setDate(moment().format('YYYY-MM-DD'));
    getMaxReferenceNumber();
  };

  const isValidForm = () => {
    return ![
      referenceNumber.length,
      supplier.length,
      date.length,
      products.length
    ].some(c => c === 0);
  };

  const getMaxReferenceNumber = async () => {
    setReferenceNumber(1);
  }

  useEffect(() => {
    getMaxReferenceNumber();
  }, []);

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
              value={date} 
              onChange={e =>setDate(e.target.value)} 
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