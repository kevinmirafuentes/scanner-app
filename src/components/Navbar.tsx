import { Container } from "@chakra-ui/react"

export default function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <Container 
      boxShadow='sm' 
      maxWidth='100vw' 
      paddingY='10px'
      paddingX='15px'
    >
      { children }
    </Container>
  );
}