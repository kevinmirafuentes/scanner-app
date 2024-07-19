'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StockRequestDocPrint from '@/components/StockRequestDocPrint';
import { Button, Stack } from '@chakra-ui/react';

async function getStockRequestById(id: string) {
  return await fetch(`/api/stock-request/${id}`);
}

export default function Print() {
  const {id} = useParams<{id:string}>();
  const handlePrint = () => {
    window.print();
  }
  return (
    <>
      <StockRequestDocPrint id={id} />

      <Stack justifyContent='center' alignItems='center' my={2}>
        <Button 
          flexGrow={0}
          width={100}
          colorScheme='gray' 
          backgroundColor='gray.300' 
          className="print-btn"
          onClick={handlePrint}>
          Print
        </Button>
      </Stack>
    </>
  )
}
