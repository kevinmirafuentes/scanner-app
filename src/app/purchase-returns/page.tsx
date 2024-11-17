"use client";
import { NavFooterLayout } from "@/components/NavFooterLayout";
import ProductsList from "@/components/ProductsList";
import SelectDistributor from "@/components/SelectDistributor";
import SelectSupplier from "@/components/SelectSupplier";
import { PurchaseReturnItem, StoreRequestItem } from "@/types/types";
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

  const createPurchaseReturnPayload = () => {
    return {
      ref_no: referenceNumber || 0,
      trans_date: date, 
      supp_id: supplier,
      distributor_id: distributor,
      return_slip_no: returnSlipNo,
      remarks: remarks,
      items: products.map((product): PurchaseReturnItem => {
        return {
          barcode_id: product.barcode_id,
          qty: product.qty
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
      body: JSON.stringify(createPurchaseReturnPayload()),
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
    let res = await fetch("/api/purchase-returns/nextrefid", { method: "POST" });
    let resJson = await res.json();
    setReferenceNumber(resJson.maxrefnum);
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
            <SelectDistributor
              value={distributor} 
              onChange={(d: string) => setSupplier(d)}
            ></SelectDistributor>
          </FormControl>
          <FormControl>
            <FormLabel>Supplier</FormLabel>
            <SelectSupplier 
              value={supplier} 
              onChange={(s: string) => setSupplier(s)}
              ></SelectSupplier>
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