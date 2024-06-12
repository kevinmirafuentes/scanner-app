import { Container, Input, Grid, GridItem, Icon, Image, InputGroup, InputLeftElement, InputRightElement, LinkBox, LinkOverlay, Text, VStack, Menu, MenuButton, MenuList, MenuItem, Button, Select, HStack, Box, Card, CardBody, IconButton, Link } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faBarcode, faBoxOpen, faBoxesPacking, faChevronRight, faHome, faTag } from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/components/Navbar"
import { ChevronDownIcon } from "@chakra-ui/icons";
import FooterNav from "@/components/FooterNav";

export default function PriceChecker() {
  return (
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
          <InputGroup>
            <Input type='text' placeholder='Enter barcode' />
            <InputRightElement pointerEvents='none'>
              <FontAwesomeIcon 
                icon={faBarcode}
              ></FontAwesomeIcon>
            </InputRightElement>
          </InputGroup>
        </Container>
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
      </VStack>
      
      <FooterNav active='price-checker'></FooterNav>
    </VStack>
  );
}
