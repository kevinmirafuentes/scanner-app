'use client';
import { StoreRequestItem } from "@/types/types";
import { Box, Table, Tbody, Td, Text, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";

async function getStockRequestById(id: string) {
  return await fetch(`/api/stock-request/${id}`);
}

export default function StockRequestPdf({id}: {id:string}) {
  const [items, setItems] = useState<StoreRequestItem[]>([]);
  
  useEffect(() => {
    getStockRequestById(id).then(async res => {
      let data = await res.json();
      setItems(data.items);
    })
    .catch(err => {
      console.log(err)
    }); 
    
    // TODO: pring when data is loaded
  }, [id]);
  return (
    <Table id='stockRequestDoc'>
        <Tbody>
          <Tr>
            <Td colSpan={6}>
              <Text fontWeight='bold' textAlign='center'>STOCK REQUEST FORM</Text>
            </Td>
          </Tr>
        </Tbody>

        {/* REQUEST INFO */}
        <Tbody>
          <Tr>
            <Td colSpan={3}>
              <Table>
                <Tbody>
                  <Tr>
                    <Td>REQUESTED BY:</Td>
                    <Td>John doe</Td>
                  </Tr>
                  <Tr>
                    <Td>REQUEST TIME:</Td>
                    <Td>2024-07-31 00:00:00</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Td>
            <Td colSpan={3}>
              <Table>
                <Tbody>
                  <Tr>
                    <Td>PREPARED BY:</Td>
                    <Td>John doe</Td>
                  </Tr>
                  <Tr>
                    <Td>PREPARED TIME:</Td>
                    <Td>2024-07-31 00:00:00</Td>  
                  </Tr>
                </Tbody>
              </Table>
            </Td>
          </Tr>
        </Tbody>

        {/* ITEMS */}
        <Tbody id='stockRequestDocItems'>
          <Tr>
            <Td>NO.</Td>
            <Td>ITEM BARCODE</Td>
            <Td>ITEM DESCRIPTION</Td>
            <Td>QTY</Td>
            <Td>INV</Td>
            <Td>UOM</Td>
            <Td>REMARKS</Td>
          </Tr>
          {items.map((i, k) => (
          <Tr key={k}>
            <Td>{k+1}</Td>
            <Td>{i.barcode}</Td>
            <Td>{i.name}</Td>
            <Td>{i.qty}</Td>
            <Td>{i.inv}</Td>
            <Td>{i.uom}</Td>
            <Td>{i.remarks}</Td>
          </Tr>
          ))}
        </Tbody>
    </Table>
  )
}