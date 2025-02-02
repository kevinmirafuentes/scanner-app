"use client";
import { NavFooterLayout } from "@/components/NavFooterLayout";
import ProductsList from "@/components/ProductsList";
import SelectSupplier from "@/components/SelectSupplier";
import { PhysicalCountItem, StoreRequestItem } from "@/types/types";
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

  const createPhysicalCountPayload = () => {
    return {
      ref_no: referenceNumber || 0,
      trans_date: date, 
      supp_id: supplier,
      branch_ref_no: latestReferenceNumber,
      items: products.map((product): PhysicalCountItem => {
        return {
          barcode_id: product.barcode_id,
          counted_qty: product.qty
        }
      })
    };
  }
  const save = async () => {
    if (!isValidForm()) {
      alert('Please fill out all fields on the form.');
      return;
    }
    setIsSaving(true);
    const payload = {
      method: "POST",
      body: JSON.stringify(createPhysicalCountPayload()),
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
    setLatestReferenceNumber('');
    setSupplier('');
    setDate(moment().format('YYYY-MM-DD'));
    getMaxReferenceNumber();
    getLatestReferenceNumber();
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
    let res = await fetch("/api/physical-count/nextrefid", { method: "POST" });
    let resJson = await res.json();
    setReferenceNumber(resJson.maxrefnum);
  }

  const getLatestReferenceNumber = async () => {
    let res = await fetch("/api/physical-count/latest-ref-number", { method: "GET" });
    let resJson = await res.json();
    setLatestReferenceNumber(resJson.latestRefNum);
  }

  useEffect(() => {
    getMaxReferenceNumber();
    getLatestReferenceNumber();
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
            <SelectSupplier value={supplier} onChange={(supplier: string) => setSupplier(supplier)}></SelectSupplier>
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
            supplierId={supplier||'0'}
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