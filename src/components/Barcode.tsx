import { Image } from '@chakra-ui/react';
import { useBarcode } from 'next-barcode';

export default function Barcode({ value, ...rest }: { value?: string, width?: number}) {
  const { inputRef } = useBarcode({
    value: value || '',
    options: {
      format: 'EAN13',
      flat: true,
      margin: 0,
      height: 50
    }
  });
  
  return (
    <Image alt={value} {...rest} ref={inputRef} />
  );
}