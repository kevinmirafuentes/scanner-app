'use client';
import { Box, Container, HStack, Stack, Table, TableContainer, Tbody, Td, Text, Tr, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import React, { ForwardedRef, forwardRef, useEffect, useState }  from "react";
import Barcode from "./Barcode";
import { StoreRequestItem } from "@/types/types";
import moment from "moment";
import { getSession } from "@/auth";

export const RequestTag = ({ data }: { data: StoreRequestItem}) => {
  return (
    <WrapItem w={'30%'}>
      <VStack justifyContent='center' w='100%' gap='10px' paddingY={3}>
        <Text textAlign='center' lineHeight='14px' width='100%'>
          { data.name }
        </Text>
        <Box>
          <Barcode value={ data.barcode?.trim() } />
        </Box>
      </VStack>
    </WrapItem>
  )
}

function RequestTagForm({ items }: { items: StoreRequestItem[] }, ref: ForwardedRef<HTMLButtonElement>) {
  const [employeeName, setEmployeeName] = useState<string>('');
  const [datetime, setDateTime] = useState<string>();
  useEffect(() => {
    setDateTime(moment().format('MM/DD/YYYY hh:mm:ssA'));
    getSession().then(u => setEmployeeName(u.full_name))
  }, [])
  return (
    // @ts-ignore
    <VStack gap='25px' ref={ref} padding='15px' fontSize='sm'>
      <Text align='center'>ORIENTAL BAZAAR</Text>
      <VStack w='100%' alignItems='start'>
        <Text align='left'>EMPLOYEE NAME: {employeeName}</Text>
        <Text align='left'>DATE/TIME: {datetime}</Text>
      </VStack>
      <Text>TAG REQUEST</Text>
      <Table>
        <Tbody>
          <Tr>
            <Td padding={1} border={0}>QTY</Td>
            <Td padding={1} border={0}></Td>
            <Td padding={1} border={0}>BARCODE/DESCRIPTIONS</Td>
          </Tr>
          {items?.map((i, k) => (
            <Tr key={k}>
              <Td padding={1} border={0} valign='top'>{i.qty}</Td>
              <Td padding={1} border={0} valign='top'>PCS</Td>
              <Td padding={1} border={0}>
                <Text>{i.barcode}</Text>
                <Text>{i.name}</Text>
              </Td>
            </Tr>
          ))}
          
        </Tbody>
      </Table>
      <VStack alignItems='start' w='100%'>
        <HStack w='100%'>
          <Text align='left' whiteSpace='nowrap'>RECEIVED BY:</Text>  
          <Box borderBottom='1px solid black' w='100%'>&nbsp;</Box>
        </HStack>
        <HStack w='100%'>
          <Text align='left' whiteSpace='nowrap'>PRINTED BY:</Text>  
          <Box borderBottom='1px solid black' w='100%'>&nbsp;</Box>
        </HStack>
        <HStack w='100%'>
          <Text align='left' whiteSpace='nowrap'>RELEASED BY:</Text>  
          <Box borderBottom='1px solid black' w='100%'>&nbsp;</Box>
        </HStack>
      </VStack>
    </VStack>
  );
} 
// @ts-ignore
const RequestTagPrint = forwardRef<any, Props>(RequestTagForm);
export default RequestTagPrint;