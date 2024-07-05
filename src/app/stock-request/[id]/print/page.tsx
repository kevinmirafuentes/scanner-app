'use client';
import React, { useEffect } from 'react';
import StockRequestPdf from '@/components/StockRequestPdf';
import { Box } from '@chakra-ui/react';



export default function Print() {

  useEffect(() => {
    setTimeout(() => window.print(), 100)
  }, []);

  return (
    <StockRequestPdf />
  )
}
