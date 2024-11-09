"use client";
import { NavFooterLayout } from "@/components/NavFooterLayout";
import ProductsList from "@/components/ProductsList";
import { StockTransferIn, StockTransferInItem, StoreRequestItem } from "@/types/types";
import { Button, Container, FormControl, FormLabel, HStack, Input, VStack, useToast } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";

export default function StockAdjustmentIn() {
  const [adjustmentNo, setAdjustmentNo] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');1
  const [date, setDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [products, setProducts] = useState<StoreRequestItem[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const toast = useToast();
  
  const createStockTransferInPayload = () => {
    return {
      adj_no: adjustmentNo, 
      trans_date: date,
      remarks: remarks,
      items: products.map((product): StockTransferInItem => {
        return {
          barcode_id: product.barcode_id,
          qty: product.qty
        }
      })
    };
  };

  const showSuccess = () => {
    toast({
      title: 'Stock adjustment created.',
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
      body: JSON.stringify(createStockTransferInPayload()),
    };
    return fetch('/api/stock-adjustment-in', payload)
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
    setAdjustmentNo('');
    setRemarks('');
    setDate(moment().format('YYYY-MM-DD'));
    getMaxReferenceNumber();
  };

  const isValidForm = () => {
    if (adjustmentNo.length == 0) return false;
    if (date.length == 0) return false; 
    if (products.length == 0) return false;
    return true;
  };

  const getMaxReferenceNumber = async () => {
    let res = await fetch("/api/stock-adjustment-in/nextrefid", { method: "POST" });
    let resJson = await res.json();
    setAdjustmentNo(resJson.maxrefnum);
  }

  useEffect(() => {
    getMaxReferenceNumber();
  }, []);

  return (
    <NavFooterLayout title='Stock Adjustments - IN' activeFooter='stock-adjustments-in'>
      <Container>
        <VStack spacing='20px'>
          <FormControl>
            <FormLabel>Adjustment No.</FormLabel>
            <Input 
              type='text' 
              readOnly={true}
              value={adjustmentNo} 
              onChange={e =>setAdjustmentNo(e.target.value)} 
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