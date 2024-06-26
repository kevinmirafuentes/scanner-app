"use client";
import { Container, Input, InputGroup, InputRightElement, Text, VStack, Select, HStack, Box, Card, CardBody, Checkbox, Flex, Stack, Skeleton } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import { NavFooterLayout } from "@/components/NavFooterLayout";
import { InventoryDetails } from "@/types/types";
import { useState } from "react";
import NoResultsFound from "@/components/NoResultsFound";
import BarcodeInput from "@/components/BarcodeInput";

const getInventoryDetails = async (barcode: string) => {
  let res = await fetch(`/api/products/${barcode}/inventory`);
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

export default function InventoryChecker() {
  const [inventoryDetails, setInventoryDetails] = useState<InventoryDetails|null>(null);
  const [isOrderUnit, setIsOrderUnit] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<null|string>(null);

  function isNoResults() {
    return !isLoading && barcode && !inventoryDetails;
  }

  const onBarcodeChange = (barcode: string) => {
    setIsLoading(true);
    setBarcode(barcode);

    if (!barcode) {
      setIsLoading(false);
      setInventoryDetails(null);
      return;
    }

    getInventoryDetails(barcode).then(async res => {
      let details = await res.json();
      setIsLoading(false);
      if (!res.ok) {
        return;
      } 
      setInventoryDetails(details);
    })   
  };

  return (
    <NavFooterLayout title='Inventory Checker' activeFooter='inventory-checker'>
      <Container>
        <BarcodeInput onChange={onBarcodeChange} />
      </Container>         
      <Container >
        <HStack justify='end'>
          <Text>Convert to Order Unit</Text>
          <Checkbox isChecked={isOrderUnit} onChange={e => setIsOrderUnit(e.target.checked)}></Checkbox>
        </HStack>
      </Container>

      {isLoading && (<SkeletonLoader />)}

      {isNoResults() && (<NoResultsFound />)}

      {inventoryDetails && (
        <Container>
          <Card>
            <CardBody>
              <VStack spacing='13px'>
                <HStack
                  width='100%'
                  justify="space-between"
                >
                  <Text fontSize='xs'>Product code:</Text>
                  <Text fontSize='xs'>{inventoryDetails?.barcode}</Text>
                </HStack>
                <Text fontSize='xl'>{inventoryDetails?.name}</Text>
                <VStack spacing='0'>  
                  { isOrderUnit && (<Text fontSize='3xl' fontWeight='bold'>{inventoryDetails?.inventory}</Text>)}
                  { !isOrderUnit && (<Text fontSize='3xl' fontWeight='bold'>{inventoryDetails?.order_unit}</Text>)}
                  <Text fontSize='md' fontWeight='bold'>Total Inventory</Text>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </Container>
      )}
      
    </NavFooterLayout>
  );
}
