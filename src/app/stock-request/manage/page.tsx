'use client';
import { NavFooterLayout } from "@/components/NavFooterLayout";
import { StoreRequestItem, StoreStockRequest } from "@/types/types";
import { Text, Box, Card, CardBody, Container, FormControl, FormLabel, HStack, Input, Skeleton, Stack, Switch, Table, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react";
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
    return await fetch(`/api/stock-request/${id}/status`, {
      method: "POST",
      body: JSON.stringify({status}),
      headers: {
        "content-type": "application/json",
      },
    }) 
  };

  const toast = useToast();

  const onChangeStatus = (item: StoreStockRequest, isChecked: boolean) => {
    if (!item?.ref_id) {
      return;
    }
    item.request_status = isChecked ? 'R' : 'P';

    toast.promise(updateStockRequestItemStatus(item.ref_id, item.request_status), {
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
              <Th>Reference Number</Th>
              <Th></Th>
            </Tr>
          </Thead>
          
            { isLoading && (
              <Tbody>
                <Tr>
                  <Td><Skeleton height='20px' /></Td>
                  <Td><Skeleton height='20px' /></Td>
                  <Td><Skeleton height='20px' /></Td>
                </Tr>
              </Tbody>
            )}
            {results?.map((res, key) => (
              <Tbody key={key}>
                <Tr >
                  <Td onClick={e => toggleItems(res.ref_id)}>{res.ref_id}</Td>
                  <Td onClick={e => toggleItems(res.ref_id)}>{res.ref_no}</Td>
                  <Td><Switch defaultChecked={res.request_status == 'R'} onChange={e => onChangeStatus(res, e.target.checked)}/></Td>
                </Tr>
                {collapsedItems.includes(res.ref_id || 0) && (
                  <Tr>
                    <Td colSpan={3}>
                      <Card width='100%'>
                        <CardBody width='100%'>
                          <Stack spacing='10px'>
                            {res.items?.map((item: StoreRequestItem, i:number) => (
                              <HStack key={i} justifyContent='space-between'>
                                <Box>{item.name}</Box>
                                <Box>&times; {item.qty}</Box>
                              </HStack>
                            ))}

                            {res.items?.length == 0 && (
                              <Text textAlign='center'>No items found.</Text>
                            )}
                          </Stack>
                        </CardBody>
                      </Card>
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