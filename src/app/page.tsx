import { Box, Center, Container, Grid, GridItem, Image, Text, VStack } from "@chakra-ui/react";
import { faBarcode, faBoxOpen, faBoxesPacking, faBoxesStacked, faMinusCircle, faPlusCircle, faRightFromBracket, faRightToBracket, faRotateLeft, faTag } from "@fortawesome/free-solid-svg-icons";
import { getCurrentBranch } from "@/auth";
import Navbar from "@/components/Navbar";
import React from "react";
import DashboardButton from "@/components/DashboardButton";

export default async function Home() {

  const branch = await getCurrentBranch();

  const gridItems = [
    { 
      icon: faBarcode, 
      title: 'Price Checker',  
      link: '/price-checker'
    },
    {
      icon: faBoxOpen, 
      title: 'Check Inventory',  
      link: '/inventory-checker'
    },
    {
      icon: faBoxesPacking, 
      title: 'Stock Request',  
      link: '/stock-request'
    },
    {
      icon: faTag, 
      title: 'Request Tag',  
      link: '/tag-request'
    },
    {
      icon: faBoxesStacked, 
      title: 'Physical Count',  
      link: '/physical-count'
    },
    {
      icon: faRotateLeft, 
      title: 'Purchase Returns',  
      link: '/purchase-returns'
    },
    {
      icon: faRightToBracket, 
      title: 'Stock Transfer - IN',  
      link: '/stock-transfer-in'
    },
    {
      icon: faRightFromBracket, 
      title: 'Stock Transfer - OUT',  
      link: '/stock-transfer-out'
    },
    {
      icon: faPlusCircle, 
      title: 'Stock Adjustment - IN',  
      link: '/stock-adjustment-in'
    },
    {
      icon: faMinusCircle, 
      title: 'Stock Adjustment - OUT',  
      link: '/stock-adjustment-out'
    },
  ];

  return (
    <VStack>
      <Navbar title='Home' />
      <Container
        marginTop='60px'
        marginBottom='20px;'
      >
        <Center>
          <Image src="/assets/cart.png" width="150px" alt="Logo"></Image>
        </Center>
      </Container>
      <Container
        marginBottom="20px"
      >
        {branch && branch.branch_code && (
          <Box fontSize='sm'>
            You are connected to <Text display='inline' color='teal.300'>{branch.branch_name}</Text>.
          </Box>
        )}
      </Container>
      <Container paddingBottom={'20px'}>
        <Grid
          w='100%'
          templateRows='repeat(2, 1fr)'
          templateColumns='repeat(2, 1fr)'
          gap='15px'
        >
          {
            gridItems.map((i, key) => (
              <GridItem key={key}>
                <DashboardButton icon={i.icon} href={i.link} label={i.title}></DashboardButton>
              </GridItem>
            ))
          }
        </Grid>
      </Container>
    </VStack>
  );
}
