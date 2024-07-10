import { Box, Container, HStack, Stack, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import React, { ForwardedRef, forwardRef }  from "react";
import Barcode from "./Barcode";
import { StoreRequestItem } from "@/types/types";

export const RequestTag = ({ data }: { data: StoreRequestItem}) => {
  return (
    <WrapItem w={'100%'}>
      <VStack justifyContent='center' w='100%' gap='10px' paddingY={3}>
        <Text textAlign='center' lineHeight='14px' width='100%'>
          { data.name }
        </Text>
        <Box>
          <Barcode value={ data.barcode?.trim() } />
        </Box>
      </VStack>
    </WrapItem>
  )
}

interface Props {
  items?: StoreRequestItem[]
}

const RequestTagPrint = forwardRef<any, Props>((props: Props, ref: ForwardedRef<HTMLButtonElement>) => {
  return (
    <Wrap spacing={5} ref={ref}>

      { props.items.map((i, k) => (
        <RequestTag key={k} data={i} />
      ))}

    </Wrap>
  )
});

export default RequestTagPrint;