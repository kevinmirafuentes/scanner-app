import { Image, VStack, Container, Text, Input, Button, Center } from "@chakra-ui/react";
import { signIn, signOut } from "@/auth"

export default function Login() {

  return (
    <Center h="calc(100vh)">
      <VStack spacing="32px" w="100%" maxW="390px">
        <Container>
          <Center>
            <Image src="/assets/cart.png" width="170px" alt="Logo"></Image>
          </Center>
        </Container>
        <Container>
          <Text fontSize="xl">Login</Text>
          <Text fontSize="sm">Please login to continue</Text>
        </Container>
        <Container>
          <form action={async (formData) => {
            "use server";
            await signIn(formData);
          }}
          >
            <VStack spacing="20px">
              <Input placeholder='Username' name='username' borderColor='gray.300' />
              <Input placeholder='Password' name='password' borderColor='gray.300' type='password' />
              <Button type='submit' backgroundColor='teal.300' color="#ffffff" width="100%" fontWeight="normal">Login</Button>
            </VStack>
          </form>

          <form action={async (formData) => {
            "use server";
            await signOut()
          }}>
          <Button type='submit'>Sign out</Button>
          </form>
        </Container>
      </VStack>
    </Center>
  );
}
