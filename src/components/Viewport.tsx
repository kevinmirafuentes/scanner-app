import { VStack } from "@chakra-ui/react";

export default function Viewport({ children }: { children: React.ReactNode }) {
  return (
    <VStack 
      width='100%' 
      height='calc(100dvh - 118px)' 
      spacing='30px'
      paddingY='30px'
      overflowY='scroll'
    >
    {children}
    </VStack>
  )
}