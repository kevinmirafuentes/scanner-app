import { Container, Input, InputGroup, InputRightElement, Text, VStack, Select, HStack, Box, Card, CardBody, Checkbox, Flex } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/components/Navbar"
import FooterNav from "@/components/FooterNav";
import Viewport from "@/components/Viewport";

export default function InventoryChecker() {
  return (
    <VStack>
      <Navbar>
        Price Checker
      </Navbar>
      <Viewport>
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
        <Container >
          <HStack justify='end'>
            <Text>Convert to Order Unit</Text>
            <Checkbox defaultChecked></Checkbox>
          </HStack>
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
                <VStack spacing='0'>
                  <Text fontSize='3xl' fontWeight='bold'>100</Text>
                  <Text fontSize='md' fontWeight='bold'>Total Inventory</Text>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </Container>
      </Viewport>
      
      <FooterNav active='inventory-checker'></FooterNav>
    </VStack>
  );
}
