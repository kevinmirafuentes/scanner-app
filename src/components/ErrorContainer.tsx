import { WarningIcon } from "@chakra-ui/icons";
import { Box, HStack, Text } from "@chakra-ui/react";
import { ReactText } from "react";

export default function ErrorContainer({ children }: { children: ReactText }) {
  return (
    <Box 
      backgroundColor='red.100' 
      paddingX='15px'
      paddingY='10px'
      color='red.500'
      borderRadius='3px'
      mb='15px'
    >
      <HStack spacing='5px'>
        <WarningIcon />
        <Text fontSize='sm'>{children}</Text>
      </HStack>
    </Box>
  );
}