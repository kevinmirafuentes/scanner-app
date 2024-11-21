'use client';
import { getCurrentBranch } from "@/auth";
import { StoreRequestItem } from "@/types/types";
import { Box, HStack, Table, Tbody, Td, Text, Tr } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";

async function getStockRequestById(id: string) {
  return await fetch(`/api/stock-request/${id}`);
}

export default function StockRequestPOSPrint({id}: {id:string}) {
  const [items, setItems] = useState<StoreRequestItem[]>([]);
  const [branchName, setBranchName] = useState<string>('');
  const [refNo, setRefNo] = useState<number>(0);
  const [employeeName, setEmployeeName] = useState<string>('');
  const [datetime, setDatetime] = useState<any>();

  useEffect(() => {
    getStockRequestById(id).then(async res => {
      let data = await res.json();
      setItems(data.items);
      setRefNo(data.ref_no);
      setEmployeeName(data.user?.full_name);
      setDatetime(moment(data.date_created).utc(false).format('MM/DD/YYYY hh:mm:ssA'))
      const branch = await getCurrentBranch();
      setBranchName(branch.branch_name);

      setTimeout(() => {
        window.print();
      }, 100);
    })
    .catch(err => {
      console.log(err)
    });

  }, [id]);
  return (
    <Table className="pos_print" id='stockRequestPos'>
      <Tbody>
        <Tr>
          <Td colSpan={4}>
            <Text textTransform='uppercase' textAlign='center'>{branchName}</Text>
          </Td>
        </Tr>
      </Tbody>

      {/* REQUEST INFO */}
      <Tbody>
        <Tr>
          <Td colSpan={4} lineHeight={1}>REF#: {refNo}</Td>
        </Tr>
        <Tr>
          <Td colSpan={4} lineHeight={1}>
            <Text textTransform='uppercase'>EMPLOYEE NAME: {employeeName}</Text>
          </Td>
        </Tr>
        <Tr>
          <Td colSpan={4} lineHeight={1}>DATE/TIME: {datetime}</Td>
        </Tr>

        <Tr>
          <Td colSpan={4}><Box className="line-behind" width='100%'></Box></Td>
        </Tr>
        <Tr>
          <Td colSpan={4}>
            <Text align='center'>STOCK REQUEST</Text>
          </Td>
        </Tr>
        <Tr>
          <Td colSpan={4}><Box className="line-behind" width='100%'></Box></Td>
        </Tr>
      </Tbody>

      {/* ITEMS */}
      <Tbody id='stockRequestPosItems'>
        <Tr>
          <Td lineHeight={1}>QTY</Td>
          <Td lineHeight={1}>UOM</Td>
          <Td lineHeight={1}>DESCRIPTION</Td>
          <Td lineHeight={1}>INV</Td>
        </Tr>
        {items.map((i, k) => (
        <Tr key={k}>
          <Td lineHeight={1}>{i.qty}</Td>
          <Td lineHeight={1}>{i.uom}</Td>
          <Td lineHeight={1}>{i.name}</Td>
          <Td lineHeight={1}>{i.inv}</Td>
        </Tr>
        ))}
      </Tbody>

      <Tbody>
        <Tr>
          <Td colSpan={4}>
            <HStack>
              <Box className="line-behind" width='100%'></Box>
              <Text whiteSpace={'nowrap'}>{items.length} items(s)</Text>
              <Box className="line-behind" width='100%'></Box>
            </HStack>
          </Td>
        </Tr>
        <Tr>
          <Td colSpan={4}>

            <Table>
              <Tbody>
                <Tr>
                  <Td>Total Case:</Td>
                  <Td></Td>
                  <Td>Total Bags:</Td>
                  <Td></Td>
                </Tr>
                <Tr>
                  <Td colSpan={4}>
                    <HStack>
                      <Box>
                        <Text whiteSpace={'nowrap'}>Prepared By:</Text>
                      </Box>
                      <Text width='100%' borderBottom='1px solid black'>
                        &nbsp;
                      </Text>
                    </HStack>
                  </Td>
                </Tr>
              </Tbody>
            </Table>

          </Td>
        </Tr>

        {/* Spaces */}
        <Tr><Td colSpan={4} height='100px'>&nbsp;</Td></Tr>
      </Tbody>
    </Table>
  )
}