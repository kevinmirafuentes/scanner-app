import FooterNav from "@/components/FooterNav";
import Navbar from "@/components/Navbar";
import Viewport from "@/components/Viewport";
import { Container, FormControl, FormLabel, Input, Switch, Table, TableContainer, Tbody, Td, Th, Thead, Tr, VStack } from "@chakra-ui/react";

export default function StockRequestList() {
  return (
    <VStack>
      <Navbar>Stock Request List</Navbar>
      <Viewport>
        <Container>
          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input type='date' />
          </FormControl>
        </Container>
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Reference Number</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>1</Td>
                <Td>ABC123</Td>
                <Td><Switch /></Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Viewport>
      <FooterNav active='n/a'></FooterNav>
    </VStack>
  );
}