"use client";

import { Container, Text, VStack, Select, HStack, Box, Card, CardBody } from "@chakra-ui/react";
import Navbar from "@/components/Navbar"
import FooterNav from "@/components/FooterNav";
import BarcodeInput from "@/components/BarcodeInput";
import { useState } from "react";

export default function PriceChecker() {
  let [productDetails, setProductDetails] = useState();
  
  const onBarcodeChange = (barcode: string) => {
    // todo: find barcode details
    setProductDetails(1);
  }

  return (
    <>
      <VStack>
        <Navbar>
          Price Checker
        </Navbar>
        <VStack 
          width='100%' 
          height='calc(100vh - 114px)' 
          spacing='30px'
          paddingY='30px'
        >
          <Container>
            <BarcodeInput onChange={onBarcodeChange} />
          </Container>

          {productDetails && (
            <>
              <Container>
                <Select 
                  placeholder='Select option' 
                  backgroundColor='teal.300'
                  color='white'
                >
                  <option value='option1' style={{ color: 'black' }}>Option 1</option>
                  <option value='option2' style={{ color: 'black' }}>Option 2</option>
                  <option value='option3' style={{ color: 'black' }}>Option 3</option>
                </Select>
              </Container>
              <Container>
                <Card>
                  <CardBody>
                    <VStack spacing='13px'>
                      <HStack
                        width='100%'
                        justify="space-between"
                      >
                        <Text fontSize='xs'>Product code:</Text>
                        <Text fontSize='xs'>123123123213</Text>
                      </HStack>
                      <Text fontSize='xl'>Lucky Me Pancit Canton</Text>
                      <Text fontSize='3xl' fontWeight='bold'>Php 100.00</Text>
                      <Box>
                        <Text fontSize='xl'>[ 3@9.00]</Text>
                        <Text fontSize='xl'>[ 6@9.00]</Text>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </Container>
        
              {/* Admin only view */}
              <Container>
                <HStack justify='space-between'>
                  <Text>Supplier</Text>
                  <HStack borderWidth='1px' border-color='gray.200'>
                    <Text padding='10px 15px'>0064</Text>
                    <Text padding='10px 15px' borderLeft='1px' borderColor='gray.200'>W.I. Food Products</Text>
                  </HStack>
                </HStack>
              </Container>
            </>
          )}
          
        </VStack>
        
        <FooterNav active='price-checker'></FooterNav>
      </VStack>      
    </>
  );
}
