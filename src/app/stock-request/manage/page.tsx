'use client';
import { NavFooterLayout } from "@/components/NavFooterLayout";
import { StoreRequestItem, StoreStockRequest } from "@/types/types";
import { Container, FormControl, FormLabel, Input, Skeleton, Switch, Table, TableContainer, Tbody, Td, Th, Thead, Tr, VStack, useToast } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";

export default function StockRequestList() {
  const [date, setDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [results, setResults] = useState<StoreStockRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onChangeDate = (date: string) => {
    setDate(date);
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

  const onChangeStatus = (item: StoreRequestItem, isChecked: boolean) => {
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
          <Tbody>
            { isLoading && (
              <Tr>
                <Td><Skeleton height='20px' /></Td>
                <Td><Skeleton height='20px' /></Td>
                <Td><Skeleton height='20px' /></Td>
              </Tr>
            )}
            {results?.map((res, key) => (
              <Tr key={key}>
                <Td>{res.ref_id}</Td>
                <Td>{res.ref_no}</Td>
                <Td><Switch defaultChecked={res.request_status == 'R'} onChange={e => onChangeStatus(res, e.target.checked)}/></Td>
              </Tr>
            ))}
            {!isLoading && results.length == 0 && (
              <Tr>
                <Td colSpan={3} textAlign={'center'}>No Results Found.</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Container>
    </NavFooterLayout>  
  );
}