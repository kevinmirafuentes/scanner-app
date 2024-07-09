import { Image } from '@chakra-ui/react';
import { useBarcode } from 'next-barcode';

export default function Barcode({ value, ...rest }: { value?: string, width?: number}) {
  const { inputRef } = useBarcode({
    value: value || '',
    options: {
      width: 3,
      flat: true,
      fontSize: 40, 
    }
  });
  
  return (
    <Image alt={value} {...rest} ref={inputRef} />
  );
}