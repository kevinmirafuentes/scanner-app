"use client";
import { NavFooterLayout } from "@/components/NavFooterLayout";
import ProductsList from "@/components/ProductsList";
import SelectSupplier from "@/components/SelectSupplier";
import { StoreRequestItem } from "@/types/types";
import { Button, Container, FormControl, FormLabel, HStack, Input, Select, VStack, useToast } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";

export default function PurchaseReturns() {
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [distributor, setDistributor] = useState<string>('');
  const [supplier, setSupplier] = useState<string>('');
  const [returnSlipNo, setReturnSlipNo] = useState<string>('');
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
    return fetch('/api/purchase-returns', payload)
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
    setReturnSlipNo('');
    setDistributor('');
    setSupplier('');
  };

  const isValidForm = () => {
    return ![
      referenceNumber, 
      date, 
      products, 
      // distributor, 
      supplier
    ].some(v => v.length === 0);
  };

  const getMaxReferenceNumber = async () => {
    setReferenceNumber(1);
  }

  useEffect(() => {
    getMaxReferenceNumber();
  }, []);

  return (
    <NavFooterLayout title='Purchase Returns' activeFooter='purchase-returns'>
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
            <FormLabel>Distributor</FormLabel>
            <Select></Select>
          </FormControl>
          <FormControl>
            <FormLabel>Supplier</FormLabel>
            <SelectSupplier 
              value={supplier} 
              onChange={(supplier: string) => setSupplier(supplier)}></SelectSupplier>
          </FormControl>
          <FormControl>
            <FormLabel>Return Slip No.</FormLabel>
            <Input 
              type='text' 
              value={returnSlipNo} 
              onChange={e =>setReturnSlipNo(e.target.value)}
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