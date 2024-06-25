import { Box, Container, HStack } from "@chakra-ui/react"
import { AppDrawer } from "./AppDrawer";

export default function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Container
        boxShadow='sm'
        maxWidth='100vw'
        padding='0'
        paddingRight='10px'
        height='50px'
        paddingY='10px'
      >
        <HStack>
          <AppDrawer />
          <Box
            marginLeft='10px'
          >
            { children }
          </Box>
        </HStack>
      </Container>
    </>
  );
}