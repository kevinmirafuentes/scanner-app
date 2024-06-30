import { StoreRequestItem } from "@/types/types";
import { Button, Card, CardBody, Grid, GridItem, Input, InputGroup, InputLeftAddon, InputRightAddon, Text } from "@chakra-ui/react";
import { faMinus, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function ProductQuantityCard({ 
  product, 
  index, 
  onQuantityChange,
  onClose
}: { 
  product: StoreRequestItem, 
  index: number,
  onQuantityChange?: Function, 
  onClose?: Function
}) {

  const [quantity, setQuantity] = useState<number>(product.qty || 1);
  
  useEffect(() => {
    onQuantityChange && onQuantityChange(quantity);
  }, [onQuantityChange, quantity])

  const increment = () => {
    let newQuantity = quantity + 1;
    setQuantity(newQuantity);
  } 

  const decrement = () => {
    if (quantity == 1) {
      return;
    }
    let newQuantity = quantity - 1;
    setQuantity(newQuantity);
  }

  return (
    <Card width='100%'>
      <CardBody>
        <Grid 
          width='100%' 
          templateRows='24px 1fr 1fr' 
          templateColumns='50px 1fr 50px'
        >
          <GridItem rowSpan={3} width='50px'>
            <Text fontSize="xs">#{ index + 1}</Text>
          </GridItem>
          <GridItem>
            <Text fontSize="xs">{product.barcode}</Text>
          </GridItem>
          <GridItem textAlign='right'>
            <Button type='button' onClick={e => onClose && onClose(e)}>
              <FontAwesomeIcon size="xs" icon={faTimes}></FontAwesomeIcon>
            </Button>
          </GridItem>
          <GridItem paddingY='5px' colSpan={2}>{product.name}</GridItem>
          <GridItem>
            <InputGroup width='200px'>
              <InputLeftAddon padding='0'>
                <Button size='sm' onClick={decrement}>
                  <FontAwesomeIcon icon={faMinus} />
                </Button>
              </InputLeftAddon>
              <Input 
                type='number' 
                textAlign='center' 
                width='70px'
                value={quantity} 
                onChange={e => { setQuantity(parseInt(e.target.value))}} 
              />
              <InputRightAddon padding='0'>
                <Button size='sm' onClick={increment}>
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </InputRightAddon>
            </InputGroup>
          </GridItem>
        </Grid>
      </CardBody>
    </Card>
  )
}