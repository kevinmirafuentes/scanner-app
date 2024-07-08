'use client';
import { getCurrentBranch } from "@/auth";
import { StoreRequestItem } from "@/types/types";
import { Box, Table, Tbody, Td, Text, Tr } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";

async function getStockRequestById(id: string) {
  return await fetch(`/api/stock-request/${id}`);
}

export default function StockRequestDocPrint({id}: {id:string}) {
  const [items, setItems] = useState<StoreRequestItem[]>([]);
  const [employeeName, setEmployeeName] = useState<string>('');
  const [datetime, setDatetime] = useState<any>();
  
  useEffect(() => {
    getStockRequestById(id).then(async res => {
      let data = await res.json();
      setItems(data.items);
      setEmployeeName(data.user?.full_name);
      setDatetime(moment(data.date_created).format('MM/DD/YYYY hh:mm:ssA'))
      
      setTimeout(() => {
        window.print();
      }, 100);
    })
    .catch(err => {
      console.log(err)
    }); 
  }, [id]);
  
  return (
    <Table id='stockRequestDoc'>
        <Tbody>
          <Tr>
            <Td colSpan={7}>
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
                    <Td>{employeeName}</Td>
                  </Tr>
                  <Tr>
                    <Td>REQUEST TIME:</Td>
                    <Td>{datetime}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Td>
            <Td colSpan={4}>
              <Table>
                <Tbody>
                  <Tr>
                    <Td>PREPARED BY:</Td>
                    <Td>
                      <Text textDecoration={'underline'}></Text>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>PREPARED TIME:</Td>
                    <Td>
                      <Text textDecoration={'underline'}></Text>
                    </Td>  
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