import FooterNav from "@/components/FooterNav";
import Navbar from "@/components/Navbar";
import { Box, Button, Card, CardBody, Container, FormControl, FormLabel, Grid, GridItem, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightAddon, InputRightElement, Text, VStack } from "@chakra-ui/react";
import { faBarcode, faMinus, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ProductCard() {
  return (
    <Card width='100%'>
      <CardBody>
      <Grid 
          width='100%' 
          templateRows='24px 1fr 1fr' 
          templateColumns='50px 1fr 50px'
        >
          <GridItem rowSpan={3} width='50px'>
            <Text fontSize="xs">#1</Text>
          </GridItem>
          <GridItem>
            <Text fontSize="xs">123123123123213</Text>
          </GridItem>
          <GridItem textAlign='right'>
            <FontAwesomeIcon size="xs" icon={faTimes}></FontAwesomeIcon>
          </GridItem>
          <GridItem paddingY='5px' colSpan={2}>Lucky Me Pancit Canton</GridItem>
          <GridItem>
            <InputGroup width='150px'>
              <InputLeftAddon pointerEvents='none'>
                <FontAwesomeIcon 
                  icon={faMinus}
                ></FontAwesomeIcon>
              </InputLeftAddon>
              <Input type='text' textAlign='center' value='1' />
              <InputRightAddon pointerEvents='none'>
                <FontAwesomeIcon 
                  icon={faPlus}
                ></FontAwesomeIcon>
              </InputRightAddon>
            </InputGroup>
          </GridItem>
        </Grid>
      </CardBody>
    </Card>
  )
}

export default function StockRequest() {
  return (
    <>
      <VStack>
        <Navbar>Stock Request</Navbar>
        <Container 
          height='calc(100vh - 114px)' 
          paddingY='30px'
          overflow='scroll'
        >
          <VStack 
            spacing='20px'  
          >
            <FormControl>
              <FormLabel>Reference No.</FormLabel>
              <Input type='text' />
            </FormControl>
            <FormControl>
              <FormLabel>Remarks</FormLabel>
              <Input type='text' />
            </FormControl>
            <FormControl>
              <FormLabel>Date</FormLabel>
              <Input type='date' />
            </FormControl>
            <FormControl>
              <FormLabel>Type of Scan Barcode</FormLabel>
              <InputGroup>
                <Input type='text' placeholder='Enter barcode' />
                <InputRightElement pointerEvents='none'>
                  <FontAwesomeIcon 
                    icon={faBarcode}
                  ></FontAwesomeIcon>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            
            <ProductCard></ProductCard>
            <ProductCard></ProductCard>
            <ProductCard></ProductCard>
            
          </VStack>
        </Container>
        <FooterNav active='stock-request'></FooterNav>
      </VStack>   
    </>
  )
}