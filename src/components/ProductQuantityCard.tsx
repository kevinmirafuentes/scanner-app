import { StoreRequestItem } from "@/types/types";
import { Button, Card, CardBody, Grid, GridItem, Input, InputGroup, InputLeftAddon, InputRightAddon, Text } from "@chakra-ui/react";
import { faMinus, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function ProductQuantityCard({ 
  product, 
  index, 
  onQuantityChange,
  onClose,
  hideQty
}: { 
  product: StoreRequestItem, 
  index: number,
  onQuantityChange?: Function, 
  onClose?: Function
  hideQty?: boolean
}) {

  const [quantity, setQuantity] = useState<number>(product.qty || 1);
  
  const increment = () => {
    let newQuantity = product.qty + 1;
    setQuantity(newQuantity);
    onQuantityChange && onQuantityChange(newQuantity);
  } 

  const decrement = () => {
    if (product.qty == 1) {
      return;
    }
    let newQuantity = product.qty - 1;
    onQuantityChange && onQuantityChange(newQuantity);
  }

  const handleQuantityInput = (qty: number) => {
    onQuantityChange && onQuantityChange(qty);
  }

  return (
    <Card width='100%'>
      <CardBody>
        <Grid 
          width='100%' 
          templateRows={ hideQty ? '24px 1fr' : '24px 1fr 1fr'} 
          templateColumns='50px 1fr 50px'
        >
          <GridItem rowSpan={3} width='50px'>
            <Text fontSize="xs">#{ index + 1}</Text>
          </GridItem>
          <GridItem>
            <Text fontSize="xs">{product.barcode}</Text>
          </GridItem>
          <GridItem textAlign='right'>
            <Button 
              type='button' 
              size='xs' 
              marginTop='-20px'
              marginRight='-15px' 
              onClick={e => onClose && onClose(e)}>
              <FontAwesomeIcon size="xs" icon={faTimes}></FontAwesomeIcon>
            </Button>
          </GridItem>
          <GridItem paddingY='5px' colSpan={2}>{product.name}</GridItem>
          {!hideQty && (
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
                  value={product.qty} 
                  onChange={e => {handleQuantityInput(parseInt(e.target.value))}} 
                />
                <InputRightAddon padding='0'>
                  <Button size='sm' onClick={increment}>
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </InputRightAddon>
              </InputGroup>
            </GridItem>
           )}
        </Grid>
      </CardBody>
    </Card>
  )
}