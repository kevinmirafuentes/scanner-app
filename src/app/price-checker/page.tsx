"use client";

import { Container, Text, VStack, Select, HStack, Box, Card, CardBody, Menu, MenuButton, MenuList, MenuItem, Tabs, TabPanels, TabPanel, Stack, Skeleton, Thead, Table, Tbody, Tr, Td } from "@chakra-ui/react";
import Navbar from "@/components/Navbar"
import FooterNav from "@/components/FooterNav";
import BarcodeInput from "@/components/BarcodeInput";
import { useState } from "react";
import Viewport from "@/components/Viewport";
import { PriceCheck } from "@/types/types";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { NavFooterLayout } from "@/components/NavFooterLayout";
import NoResultsFound from "@/components/NoResultsFound";
import { getSession } from "@/auth";

const getPriceDetails = async (barcode: string) => {
  let res = await fetch(`/api/products/${barcode}/price`);
  return res;
}

function SkeletonLoader() {
  return (
    <Container>
      <Stack spacing='13px'>
        <Skeleton height='40px' />
        <Card>
          <CardBody>
          <Stack spacing='13px'>
            <Skeleton height='20px' />
            <Skeleton height='20px' />
            <Skeleton height='20px' />
            <Skeleton height='20px' />
            </Stack>
          </CardBody>
        </Card>
      </Stack>
    </Container>
  );
}

export default function PriceChecker() {
  const [priceDetails, setPriceDetails] = useState<PriceCheck|null>();
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(0);
  const [barcode, setBarcode] = useState<null|string>(null);

  const onBarcodeChange = (barcode: string) => {
    setIsLoading(1);
    setBarcode(barcode);

    if (!barcode) {
      setIsLoading(0);
      setPriceDetails(null);
      return;
    }

    getPriceDetails(barcode).then(async res => {
      let details = await res.json();
      setIsLoading(0);
      if (!res.ok) {
        return;
      }
      setPriceDetails(details);
    })
  };

  const formatNum = (x: string) => Number.parseFloat(x).toFixed(2);

  return (
    <NavFooterLayout title='Price Checker' activeFooter='price-checker'>
      <Container>
        <BarcodeInput onChange={onBarcodeChange} />
      </Container>

      {isLoading && (<SkeletonLoader />)}

      {barcode && priceDetails && priceDetails?.prices.length < 1 && !isLoading && (<NoResultsFound />)}

      {priceDetails && priceDetails?.prices.length > 0 && !isLoading && (
        <>
          <Container>
            <Menu matchWidth={true}>
              <MenuButton
                width='100%'
                px={4}
                py={2}
                textAlign='right'
                transition='all 0.2s'
                borderRadius='md'
                borderWidth='1px'
                backgroundColor='teal.300'
                color='white'
                _expanded={{ bg: 'teal.400' }}
                _focus={{ boxShadow: 'none' }}
              >
                {priceDetails?.prices[tabIndex].uom} <ChevronDownIcon />
              </MenuButton>
              <MenuList width='100%'>
                {priceDetails?.prices.map((price, key) => (
                  <MenuItem
                    width='100%'
                    key={key}
                    onClick={() => setTabIndex(key)}
                  >
                    {price.uom}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Container>
          <Container>
            <Tabs index={tabIndex} >
              <TabPanels>
                {priceDetails?.prices.map((price, key) => (
                  <TabPanel key={key}>
                    <Card mb='15px'>
                      <CardBody>
                        <VStack spacing='13px'>
                          <HStack
                            width='100%'
                            justify="space-between"
                          >
                            <Text fontSize='xs'>Product code:</Text>
                            <Text fontSize='xs'>{price.barcode}</Text>
                          </HStack>
                          <Text fontSize='xl'>{price?.name}</Text>
                          <Text fontSize='3xl' fontWeight='bold'>Php {formatNum(price.retail_unit_price)}</Text>
                          <Box>
                            {Number.parseFloat(price.retail_unit_price2) > 0 && (<Text align='center' fontSize='xl'>[ {`${price.retail_qty2}@${formatNum(price.retail_unit_price2)}`} ]</Text>)}
                            {Number.parseFloat(price.retail_unit_price3) > 0 && (<Text align='center' fontSize='xl'>[ {`${price.retail_qty3}@${formatNum(price.retail_unit_price3)}`} ]</Text>)}
                            {Number.parseFloat(price.retail_unit_price4) > 0 && (<Text align='center' fontSize='xl'>[ {`${price.retail_qty4}@${formatNum(price.retail_unit_price4)}`} ]</Text>)}
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>

                    {/* Admin only view */}
                    {price?.supp_id && (
                      <Table variant='simple' width='100%'>
                        <Tbody>
                          <Tr>
                            <Td>Supplier:</Td>
                            <Td>
                              <Text align='right' fontSize='sm'>#{price?.supp_id}</Text>
                              <Text align='right'>{price?.supp_name}</Text>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td>Inventory:</Td>
                            <Td>
                              <Text align='right'>{price?.qty_on_hand}</Text>
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    )}

                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Container>
        </>
      )}
    </NavFooterLayout>
  );
}
