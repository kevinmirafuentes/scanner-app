"use client";
import { Box, Container, HStack } from "@chakra-ui/react"
import { AppDrawer } from "./AppDrawer";

export default function Navbar({ title }: { title: string }) {
  return (
    <Container
      boxShadow='sm'
      maxWidth='100vw'
      padding='0'
      paddingRight='10px'
      height='50px'
      paddingY='10px'
      borderBottomColor='gray.200'
      borderBottomWidth={1}
    >
      <HStack>
        <AppDrawer />
        <Box
          marginLeft='10px'
        >
          { title }
        </Box>
      </HStack>
    </Container>
  );
}