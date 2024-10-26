import { ComboBoxOption, ComboBoxProps } from "@/types/types";
import { Box, Card, FormControl, HStack, Input, useDisclosure, VStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

export default function ComboBox({
  options,
  onChange
}: ComboBoxProps) {
  
  const [search, setSearch] = useState<string>('');
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [selectedText, setSelectedText] = useState<string>('');
  
  const handleSelect = (key: string|number) => {
    let sel = options?.find((i: ComboBoxOption) => i.key == key);
    setSelectedText(sel ? sel.text : '');
    onChange && onChange(sel);
    onClose();
  }

  let dropdownRef = useRef(null);

  const handleClickOutside = (e: any) => {
    // @ts-ignore
    if (dropdownRef && !dropdownRef?.current?.contains(e.target)) {
      onClose();
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
  }, 
  []);

  return (
    <Box>
      <FormControl>
        <Input 
          readOnly={true} 
          value={selectedText} 
          onChange={e => setSelectedText(e.target.value)} 
          onClick={onToggle}></Input>
      </FormControl>
      <Card 
        ref={dropdownRef}
        position={'absolute'}
        background={'white'}
        zIndex={999}
        w={'100%'}
        p={1}
        display={isOpen ? 'block' : 'none'}
      >
        <FormControl>
          <Input onChange={e => setSearch(e.target.value)}></Input>
        </FormControl>
        <VStack mt={3} maxH={210} spacing={'10px'} overflow={'auto'} align='start'>
          {options?.filter(i => search == '' || i.text.toLowerCase().includes(search)).map((i: ComboBoxOption, k) => (
            <Box 
              w={'100%'} 
              key={k} 
              px={3} 
              onClick={e => handleSelect(i.key)}>
              {i.text}
            </Box>
          ))}
        </VStack>
      </Card>
    </Box>
  )
}