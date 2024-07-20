'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StoreRequestItem } from '@/types/types';
import StockRequestDocPrint from '@/components/StockRequestDocPrint';
import StockRequestPOSPrint from '@/components/StockRequestPOSPrint';

async function getStockRequestById(id: string) {
  return await fetch(`/api/stock-request/${id}`);
}

export default function Print() {
  const {id} = useParams<{id:string}>();
  return (
    <>
      <StockRequestDocPrint id={id} />
    </>
  )
}
