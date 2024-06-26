import { Box, Card, CardBody, Container, Text } from "@chakra-ui/react";

export default function NoResultsFound() {
  return (
    <Container>
      <Card width='100%'>
        <CardBody>
          <Text fontSize='md' textAlign='center'>No results found.</Text>
        </CardBody>
      </Card>
    </Container>
  )
}