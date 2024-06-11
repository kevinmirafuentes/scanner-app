import { Heading, Image, VStack, Container, Text, Input, Button, Center } from "@chakra-ui/react";

export default function Login() {
  return (
    <Center h="calc(100vh)">
      <VStack spacing="32px" w="100%" maxW="390px">
        <Container>
          <Center>
            <Image src="/cart.png" width="170px" alt="Logo"></Image>
          </Center>
        </Container>
        <Container>
          <Text fontSize="xl">Login</Text>
          <Text fontSize="sm">Please login to continue</Text>
        </Container>
        <Container>
          <VStack spacing="20px">
            <Input placeholder='Username' />
            <Input placeholder='Password' />
            <Button backgroundColor='teal.300' color="#ffffff" width="100%" fontWeight="normal">Login</Button>
          </VStack>
        </Container>
      </VStack>
    </Center>
  );
}
