import { Card, CardBody, Skeleton, Stack } from "@chakra-ui/react";
import { useState } from "react";

export default function ProductsListLoader() {
  return (
    <Card width='100%'>
      <CardBody>
        <Stack spacing='13px'>
          <Skeleton height='20px' />
          <Skeleton height='20px' />
          <Skeleton height='20px' />
        </Stack>
      </CardBody>
    </Card>
  );
} 