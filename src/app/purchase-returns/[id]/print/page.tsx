'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, HStack, Table, Tbody, Td, Text, Tfoot, Thead, Tr } from '@chakra-ui/react';

export default function Print() {
  const {id} = useParams<{id:string}>();
  return (
    <Table className='pos_print compact'>
      <Thead>
        <Tr>
          <Td colSpan={4}>
            <Text textTransform={'uppercase'} textAlign={'center'}>ORIENTAL BAZAAR TABACO</Text>
          </Td>
        </Tr>
        <Tr>
          <Td colSpan={4}>
            <Text textTransform={'uppercase'} textAlign={'center'}>ZIGA AVENUE, BASUD, TABACO CITY</Text> 
          </Td>
        </Tr>
        <Tr>
          <Td colSpan={4}></Td>
        </Tr>
        <Tr>
          <Td colSpan={4}></Td>
        </Tr>
        <Tr>
          <Td><Text lineHeight={1}>REF. #</Text></Td>
          <Td><Text lineHeight={1}>: &nbsp;&nbsp;&nbsp; 230</Text></Td>
          <Td><Text lineHeight={1}>B.O. #</Text></Td>
          <Td><Text lineHeight={1}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 230</Text></Td>
        </Tr>
        <Tr>
          <Td><Text lineHeight={1}>CASHIER</Text></Td>
          <Td><Text lineHeight={1}>: &nbsp;&nbsp;&nbsp; 000</Text></Td>
          <Td><Text lineHeight={1}>POS #</Text></Td>
          <Td><Text lineHeight={1}>: &nbsp;&nbsp;&nbsp; 0</Text></Td>
        </Tr>
        <Tr>
          <Td><Text lineHeight={1}>CASHIER</Text></Td>
          <Td colSpan={3}><Text lineHeight={1}>: &nbsp;&nbsp;&nbsp; INHOUSE PROMO</Text></Td>
        </Tr>
        <Tr>
          <Td><Text lineHeight={1}>DATE/TIME</Text></Td>
          <Td colSpan={3}><Text lineHeight={1}>: &nbsp;&nbsp;&nbsp; 11/20/2024 1:33:29 PM</Text></Td>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td colSpan={4}><Box className="line-behind" width='100%'></Box></Td>
        </Tr>
        
        <Tr>
          <Td valign='top'><Text lineHeight={1.2}>1</Text></Td>
          <Td valign='top'><Text lineHeight={1.2}>PK1</Text></Td>
          <Td valign='top'>
            <Text lineHeight={1.2}>PEPSI1.5L+ICE@60</Text>
            <Text lineHeight={1.2}>@60</Text>
          </Td>
          <Td valign='top'><Text lineHeight={1.2}>60</Text></Td>
        </Tr>

        <Tr>
          <Td colSpan={4}>
            <HStack>
              <Box className="line-behind" width='100%'></Box>
              <Text whiteSpace={'nowrap'}>1 items(s)</Text>
              <Box className="line-behind" width='100%'></Box>
            </HStack>
          </Td>
        </Tr>
        
        <Tr>
          <Td colSpan={2}><Text textAlign={'left'}>TOTAL</Text></Td>
          <Td colSpan={2}><Text textAlign={'right'}>60</Text></Td>
        </Tr>
        <Tr>
          <Td colSpan={2}><Text textAlign={'right'} lineHeight={1.2}>TENDERED: </Text></Td>
          <Td colSpan={2}><Text textAlign={'right'} lineHeight={1.2}>60</Text></Td>
        </Tr>
        <Tr>
          <Td colSpan={2}><Text textAlign={'right'} lineHeight={1.2}>CASH: </Text></Td>
          <Td colSpan={2}><Text textAlign={'right'} lineHeight={1.2}>60</Text></Td>
        </Tr>
        <Tr>
          <Td colSpan={2}><Text textAlign={'left'}>CHANGE</Text></Td>
          <Td colSpan={2}><Text textAlign={'right'}>60</Text></Td>
        </Tr>
        

      </Tbody>
      <Tfoot>
        <Tr>
          <Td colSpan={4}></Td>
        </Tr>
        <Tr>
          <Td colSpan={4}></Td>
        </Tr>

        <Tr>
          <Td colSpan={4}>
            <Table>
              <Tr>
                <Td width={100}><Text>TOTAL CASES</Text></Td>
                <Td><Box className="line-behind" width='90%'></Box></Td>
                <Td width={50}><Text>BAGS</Text></Td>
                <Td><Box className="line-behind" width='90%'></Box></Td>
              </Tr>
              <Tr>
                <Td width={100}><Text>ENCODED BY</Text></Td>
                <Td><Box className="line-behind" width='90%'></Box></Td>
                <Td width={50}><Text>DATE</Text></Td>
                <Td><Box className="line-behind" width='90%'></Box></Td>
              </Tr>
              <Tr>
                <Td width={100}><Text>RELEASED BY</Text></Td>
                <Td><Box className="line-behind" width='90%'></Box></Td>
                <Td width={50}><Text>DATE</Text></Td>
                <Td><Box className="line-behind" width='90%'></Box></Td>
              </Tr>
              <Tr>
                <Td width={100}><Text>RECIEVED BY</Text></Td>
                <Td><Box className="line-behind" width='90%'></Box></Td>
                <Td width={50}><Text>DATE</Text></Td>
                <Td><Box className="line-behind" width='90%'></Box></Td>
              </Tr>
            </Table>
          </Td>
        </Tr>

        

      </Tfoot>
    </Table>
  )
}
