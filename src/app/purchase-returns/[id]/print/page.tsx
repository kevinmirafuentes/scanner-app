'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, HStack, Table, Tbody, Td, Text, Tfoot, Thead, Tr } from '@chakra-ui/react';
import { getPurchaseReturnById } from '@/repository/purchaseReturns';
import { PurchaseReturn } from '@/types/types';
import moment from 'moment';

export default function Print() {
  const {id} = useParams<{id:string}>();
  const [purchaseReturn, setPurchaseReturn] = useState<PurchaseReturn>();
  const [dateCreated, setDateCreated] = useState<string>();
  
  useEffect(() => {
    
    fetch(`/api/purchase-returns/${id}`).then(async res => {
      let data = await res.json();
      setPurchaseReturn(data);
      setDateCreated(moment(purchaseReturn?.date_created).format('D/M/YYYY h:mm:ss A'));
      setTimeout(() => window.print(), 100);
    })
    .catch(e => console.log(e));
  }, [id]);

  return (
    <Table className='pos_print compact'>
      <Thead>
        <Tr>
          <Td colSpan={4}>
            <Text textTransform={'uppercase'} textAlign={'center'}>{purchaseReturn?.branch?.branch_name}</Text>
          </Td>
        </Tr>
        <Tr>
          <Td colSpan={4}>
            <Text textTransform={'uppercase'} textAlign={'center'}>{purchaseReturn?.branch?.address}</Text> 
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
          <Td><Text lineHeight={1}>: &nbsp;&nbsp;&nbsp; {purchaseReturn?.ref_no}</Text></Td>
          <Td><Text lineHeight={1}>B.O. #</Text></Td>
          <Td><Text lineHeight={1}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {purchaseReturn?.ref_no}</Text></Td>
        </Tr>
        <Tr>
          <Td><Text lineHeight={1}>CASHIER</Text></Td>
          <Td><Text lineHeight={1}>: &nbsp;&nbsp;&nbsp; 000</Text></Td>
          <Td><Text lineHeight={1}>POS #</Text></Td>
          <Td><Text lineHeight={1}>: &nbsp;&nbsp;&nbsp; 0</Text></Td>
        </Tr>
        <Tr>
          <Td><Text lineHeight={1}>SUPPLIER</Text></Td>
          <Td colSpan={3}><Text lineHeight={1}>: &nbsp;&nbsp;&nbsp; {purchaseReturn?.supplier?.supp_name}</Text></Td>
        </Tr>
        <Tr>
          <Td><Text lineHeight={1}>DATE/TIME</Text></Td>
          <Td colSpan={3}><Text lineHeight={1}>: &nbsp;&nbsp;&nbsp; {dateCreated}</Text></Td>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td colSpan={4}><Box className="line-behind" width='100%'></Box></Td>
        </Tr>
        
        <Tr>
          <Td colSpan={4}>
            <Table width={'100%'}>
              <Tbody>
                {purchaseReturn?.items?.map((i, index) => (
                  <Tr key={index}>
                    <Td valign='top'><Text lineHeight={1.2}>{i.qty}</Text></Td>
                    <Td valign='top'><Text lineHeight={1.2}>{i.unit_code}</Text></Td>
                    <Td valign='top' width={'50%'}>
                      <Text lineHeight={1.2}>{i.product_name}</Text>
                      <Text lineHeight={1.2}>@{i.unit_price?.toFixed(2)}</Text>
                    </Td>
                    <Td valign='top'><Text textAlign={'right'} lineHeight={1.2}>{i.gross_amt?.toFixed(2)}</Text></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Td>
        </Tr>
        
        
        <Tr>
          <Td colSpan={4}>
            <HStack>
              <Box className="line-behind" width='100%'></Box>
              <Text whiteSpace={'nowrap'}>{purchaseReturn?.total_qty } items(s)</Text>
              <Box className="line-behind" width='100%'></Box>
            </HStack>
          </Td>
        </Tr>
        
        <Tr>
          <Td colSpan={2}><Text textAlign={'left'}>TOTAL</Text></Td>
          <Td colSpan={2}><Text textAlign={'right'}>{purchaseReturn?.total_gross_amt?.toFixed(2)}</Text></Td>
        </Tr>
        <Tr>
          <Td colSpan={2}><Text textAlign={'right'} lineHeight={1.2}>TENDERED: </Text></Td>
          <Td colSpan={2}><Text textAlign={'right'} lineHeight={1.2}>0</Text></Td>
        </Tr>
        <Tr>
          <Td colSpan={2}><Text textAlign={'right'} lineHeight={1.2}>CASH: </Text></Td>
          <Td colSpan={2}><Text textAlign={'right'} lineHeight={1.2}>0</Text></Td>
        </Tr>
        <Tr>
          <Td colSpan={2}><Text textAlign={'left'}>CHANGE</Text></Td>
          <Td colSpan={2}><Text textAlign={'right'}>0</Text></Td>
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
              <Tbody>
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
              </Tbody>
            </Table>
          </Td>
        </Tr>

        

      </Tfoot>
    </Table>
  )
}
