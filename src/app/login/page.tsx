'use client';
import { Image, VStack, Container, Text, Input, Button, Center, Box, AlertIcon, Stack, HStack } from "@chakra-ui/react";
import { FormEvent, ReactText, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import ErrorContainer from "@/components/ErrorContainer";

export default function Login() {

  const [loginError, setLoginError] = useState<string|null>(null);
  const router = useRouter()

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoginError(null);

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')
 
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      let data = await response.json();
      setLoginError(data.message);
      return;
    } 
    
    router.push('/')
  }

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
          <form onSubmit={handleLogin}>
            {loginError && <ErrorContainer>{loginError}</ErrorContainer>}
            <VStack spacing="20px"> 
              <Input placeholder='Username' name='username' borderColor='gray.300' />
              <Input placeholder='Password' name='password' borderColor='gray.300' type='password' />
              <Button type='submit' backgroundColor='teal.300' color="#ffffff" width="100%" fontWeight="normal">Login</Button>
            </VStack>
          </form>
        </Container>
      </VStack>
    </Center>
  );
}
