import useFocus from "@/lib/useFocus";
import { ComboBoxOption, ComboBoxProps } from "@/types/types";
import { Box, Card, FormControl, HStack, Input, useDisclosure, VStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

export default function ComboBox({
  options,
  onChange,
  value
}: ComboBoxProps) {
  
  const [search, setSearch] = useState<string>('');
  const { isOpen, onOpen, onToggle, onClose } = useDisclosure();
  const [selectedText, setSelectedText] = useState<string>('');
  const [inputRef, setFocus] = useFocus<HTMLInputElement>();
  
  const handleSelect = (key: string|number) => {
    let sel = options?.find((i: ComboBoxOption) => i.key == key);
    setSelectedText(sel ? sel.text : '');
    setSearch('');
    onChange && onChange(sel);
    onClose();
  }

  let dropdownRef = useRef(null);
  let parentInputRef = useRef(null);

  const handleClickOutside = (e: any) => {
    // @ts-ignore
    if (dropdownRef && !dropdownRef?.current?.contains(e.target) && !parentInputRef?.current?.contains(e.target)) {
      onClose();
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      let sel = options?.find((i: ComboBoxOption) => i.key == value);
      setSelectedText(sel ? sel.text : ''); 
    } else {
      setSelectedText(''); 
    }
  }, [options, value]);
  

  return (
    <Box>
      <FormControl>
        <Input 
          ref={parentInputRef}
          readOnly={true} 
          value={selectedText} 
          onChange={e => setSelectedText(e.target.value)} 
          onFocus={e => { onOpen(); setTimeout(e => setFocus(), 100 ) }}></Input>
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
          <Input ref={inputRef} value={search} onChange={e => setSearch(e.target.value)}></Input>
        </FormControl>
        <VStack mt={3} maxH={210} spacing={'10px'} overflow={'auto'} align='start'>
          {options?.filter(i => search == '' || i.text.toLowerCase().includes(search.toLowerCase())).map((i: ComboBoxOption, k) => (
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