"use client";

import { Container, Text, VStack, Select, HStack, Box, Card, CardBody, Menu, MenuButton, MenuList, MenuItem, Tabs, TabPanels, TabPanel, Stack, Skeleton } from "@chakra-ui/react";
import Navbar from "@/components/Navbar"
import FooterNav from "@/components/FooterNav";
import BarcodeInput from "@/components/BarcodeInput";
import { useState } from "react";
import Viewport from "@/components/Viewport";
import { PriceCheck } from "@/types/types";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { NavFooterLayout } from "@/components/NavFooterLayout";

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

function NoResultsFound() {
  return (
    <Box>
      <Text fontSize='md'>No results found.</Text>
    </Box>
  )
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

  const formatNum = (x: number) => Number.parseFloat(x).toFixed(2);

  return (
    <NavFooterLayout title='Price Checker' activeFooter='price-checker'>
      <Container>
        <BarcodeInput onChange={onBarcodeChange} />
      </Container>  

      {isLoading && (<SkeletonLoader />)}

      {barcode && !priceDetails && !isLoading && (<NoResultsFound />)} 

      {priceDetails && !isLoading && (
        <>
          <Container>
            <Menu width='100%' matchWidth={true}>
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
                            {price.retail_markup2 > 0 && (<Text align='center' fontSize='xl'>[ {`${price.retail_qty2}@${formatNum(price.retail_markup2)}`} ]</Text>)}
                            {price.retail_markup3 > 0 && (<Text align='center' fontSize='xl'>[ {`${price.retail_qty3}@${formatNum(price.retail_markup3)}`} ]</Text>)}
                            {price.retail_markup4 > 0 && (<Text align='center' fontSize='xl'>[ {`${price.retail_qty4}@${formatNum(price.retail_markup4)}`} ]</Text>)}
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>

                    {/* Admin only view */}
                    <HStack justify='space-between'>
                      <Text>Supplier</Text>
                      <HStack borderWidth='1px' border-color='gray.200'>
                        <Text padding='10px 15px'>{price?.supp_id}</Text>
                        <Text padding='10px 15px' borderLeft='1px' borderColor='gray.200'>{price?.supp_name}</Text>
                      </HStack>
                    </HStack>
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
