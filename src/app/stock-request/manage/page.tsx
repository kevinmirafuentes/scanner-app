'use client';
import { NavFooterLayout } from "@/components/NavFooterLayout";
import StockRequestPrintMenu from "@/components/StockRequestPrintMenu";
import { StoreRequestItem, StoreStockRequest } from "@/types/types";
import { Text, Box, Card, CardBody, Container, FormControl, FormLabel, HStack, Input, Skeleton, Stack, Switch, Table, Tbody, Td, Th, Thead, Tr, useToast, Button } from "@chakra-ui/react";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useState } from "react";

export default function StockRequestList() {
  const [date, setDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [results, setResults] = useState<StoreStockRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [collapsedItems, setCollapsedItems] = useState<number[]>([]);

  const onChangeDate = (date: string) => {
    setDate(date);
  };

  const toggleItems = (id: number|null|undefined) => {
    if (id === null || typeof id === 'undefined') {
      return; 
    }
    if (collapsedItems.includes(id)) {
      setCollapsedItems(collapsedItems.filter(i => i != id));
      return;
    }
    setCollapsedItems([...collapsedItems, id]);
  };

  const updateStockRequestItemStatus = async (id: number, status: string) => {
    return await fetch(`/api/stock-request/items/${id}/status`, {
      method: "POST",
      body: JSON.stringify({status}),
      headers: {
        "content-type": "application/json",
      },
    }) 
  };

  const toast = useToast();

  const onChangeStatus = (item: StoreRequestItem, isChecked: boolean) => {
    if (!item?.auto_id) {
      return;
    }
    item.request_status = isChecked ? 'R' : 'P';

    toast.promise(updateStockRequestItemStatus(item.auto_id, item.request_status), {
      success: { title: 'Success', description: 'Item status changed.' },
      error: { title: 'Error', description: 'Something went wrong.' },
      loading: { title: 'Loading', description: 'Please wait.' },
    })
  };

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/stock-request?date='+date)
    .then(async res => {
      setResults(await res.json());
    })
    .finally(() => setIsLoading(false))
    .catch(err => console.log(err));
  }, [date, setDate])

  return (
    <NavFooterLayout title='Stock Request List'>
      <Container>
        <FormControl>
          <FormLabel>Date</FormLabel>
          <Input type='date' value={date} onChange={e => onChangeDate(e.target.value)} />
        </FormControl>
      </Container>
      <Container>
        <Table variant='simple' width='100%'>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th colSpan={2}>Reference Number</Th>
            </Tr>
          </Thead>
          
            { isLoading && (
              <Tbody>
                <Tr>
                  <Td><Skeleton height='20px' /></Td>
                  <Td colSpan={2}><Skeleton height='20px' /></Td>
                </Tr>
              </Tbody>
            )}
            {results?.map((res, key) => (
              <Tbody key={key}>
                <Tr>
                  <Td onClick={e => toggleItems(res.ref_id)}>{key+1}</Td>
                  <Td onClick={e => toggleItems(res.ref_id)}>{res.ref_no}</Td>
                  <Td width={100}>
                    <StockRequestPrintMenu refId={res.ref_id || 0} />
                  </Td>
                </Tr>
                {collapsedItems.includes(res.ref_id || 0) && (
                  <Tr>
                    <Td colSpan={3} padding={0} backgroundColor='gray.100'>
                      <Table variant='simple' width='100%'>
                        <Thead>
                          <Tr>
                            <Th width='30px' padding='12px'>#</Th>
                            <Th>Item Description</Th>
                            <Th width='30px' padding='12px'>QTY</Th>
                            <Th width='30px' padding='12px'></Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                        {res.items?.length == 0 && (
                          <Tr>
                            <Td colSpan={4} textAlign='center'>No items found.</Td>
                          </Tr>
                        )}

                        {res.items?.map((item: StoreRequestItem, i:number) => (
                          <Tr key={i}>
                            <Td width='30px' padding='12px'>
                              <Text fontSize='sm'>{i+1}</Text>
                            </Td>  
                            <Td>
                              <Text fontSize='sm'>{item.name}</Text>
                            </Td>
                            <Td width='30px' padding='12px'>
                              <Text fontSize='sm'>{item.qty}</Text>
                            </Td>
                            <Td width='30px' padding='12px'><Switch defaultChecked={item.request_status == 'R'} onChange={e => onChangeStatus(item, e.target.checked)}/></Td>
                          </Tr>
                        ))}
                        </Tbody>
                      </Table>
                    </Td>
                  </Tr>
                ) }
              </Tbody>
            ))}
            {!isLoading && results.length == 0 && (
              <Tbody>
                <Tr>
                  <Td colSpan={3} textAlign={'center'}>No Results Found.</Td>
                </Tr>
              </Tbody>
            )}
        </Table>
      </Container>
    </NavFooterLayout>  
  );
}