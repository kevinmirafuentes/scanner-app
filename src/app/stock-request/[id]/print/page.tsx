'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StoreRequestItem } from '@/types/types';
import StockRequestPdf from '@/components/StockRequestPdf';

async function getStockRequestById(id: string) {
  return await fetch(`/api/stock-request/${id}`);
}

export default function Print() {
  const {id} = useParams<{id:string}>();
  return (
    <>
      <StockRequestPdf id={id} />
    </>
  )
}
