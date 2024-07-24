'use client';
import { NavFooterLayout } from "@/components/NavFooterLayout";
import StockRequestPrintMenu from "@/components/StockRequestPrintMenu";
import { printInNewTab } from "@/lib/utils";
import { StoreRequestItem, StoreStockRequest } from "@/types/types";
import { Text, Box, Card, CardBody, Container, FormControl, FormLabel, HStack, Input, Skeleton, Stack, Switch, Table, Tbody, Td, Th, Thead, Tr, useToast, Button } from "@chakra-ui/react";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useState } from "react";

export default function TagRequestList() {
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

  const handlePrint = (id: number|null|undefined) => {
    printInNewTab(`/tag-request/${id}/print`);
  }

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/tag-request?date='+date)
    .then(async res => {
      setResults(await res.json());
    })
    .finally(() => setIsLoading(false))
    .catch(err => console.log(err));
  }, [date, setDate])

  return (
    <NavFooterLayout title='Tag Request List'>
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
                  <Td onClick={e => toggleItems(res.ref_id)}>{res.ref_id}</Td>
                  <Td width={100}>
                    <Button onClick={() => handlePrint(res.ref_id)}>
                      <FontAwesomeIcon
                        icon={faPrint}
                        color='gray'
                      ></FontAwesomeIcon>
                    </Button>
                  </Td>
                </Tr>
                {collapsedItems.includes(res.ref_id || 0) && (
                  <Tr>
                    <Td colSpan={3} padding={0} backgroundColor='gray.100'>
                      <Table variant='simple' width='100%'>
                        <Thead>
                          <Tr>
                            <Th>Item Description</Th>
                            <Th width='30px' padding='12px'>QTY</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                        {res.items?.length == 0 && (
                          <Tr>
                            <Td colSpan={3} textAlign='center'>No items found.</Td>
                          </Tr>
                        )}

                        {res.items?.map((item: StoreRequestItem, i:number) => (
                          <Tr key={i}>
                            <Td>
                              <Text fontSize='sm'>{item.name}</Text>
                            </Td>
                            <Td width='30px' padding='12px'>
                              <Text fontSize='sm'>{item.qty}</Text>
                            </Td>
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