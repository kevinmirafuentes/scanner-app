import { Box, Container, HStack, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import React, { ForwardedRef, forwardRef }  from "react";
import Barcode from "./Barcode";
import { StoreRequestItem } from "@/types/types";

export const RequestTag = ({ data }: { data: StoreRequestItem}) => {
  return (
    <WrapItem justifyContent='center' height='100px' maxWidth='240px' padding='10px' border='1px dotted #ccc'>
      <HStack height='100%'>
        <Text lineHeight='14px' width='100%'>
          { data.name }
        </Text>
        <Box width='100%'>
          <Text fontSize='2xl' marginBottom='-7px' textAlign='center' fontWeight='bold'>25.00</Text>
          <Barcode value={ data.barcode }  />
        </Box>
      </HStack>
    </WrapItem>
  )
}

interface Props {
  items?: StoreRequestItem[]
}

const RequestTagPrint = forwardRef<any, Props>((props: Props, ref: ForwardedRef<HTMLButtonElement>) => {
  return (
    <Wrap ref={ref} padding='25px'>

      { props.items.map((i, k) => (
        <RequestTag key={k} data={i} />
      ))}

    </Wrap>
  )
});

export default RequestTagPrint;