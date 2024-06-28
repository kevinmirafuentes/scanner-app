import { Box, Center, Container, Grid, GridItem, Icon, Image, LinkBox, LinkOverlay, Text, VStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faBarcode, faBoxOpen, faBoxesPacking, faTag } from "@fortawesome/free-solid-svg-icons";
import { getCurrentBranch, getSession } from "@/auth";
import Navbar from "@/components/Navbar";

type DashboardButtonProps = {
  icon: IconDefinition,
  href: string,
  label: string
}

export function DashboardButton({
  icon,
  href,
  label
}: DashboardButtonProps) {
  return (
    <LinkBox>
      <Center
        rounded='md'
        boxShadow='md'
        borderWidth={1}
        borderColor='gray.100'
        height='131px'
      >
        <VStack>
          <FontAwesomeIcon
            icon={icon}
            fontSize='50px'
            color='#4FD1C5'
          ></FontAwesomeIcon>
          <LinkOverlay href={href} color='teal.300'>
            <Text fontSize='sm'>{label}</Text>
          </LinkOverlay>
        </VStack>
      </Center>
    </LinkBox>
  )
}

export default async function Home() {

  const branch = await getCurrentBranch();

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
      <Container>
        <Grid
          w='100%'
          templateRows='repeat(2, 1fr)'
          templateColumns='repeat(2, 1fr)'
          gap='15px'
        >
          <GridItem>
            <DashboardButton icon={faBarcode} href='/price-checker' label='Price Checker'></DashboardButton>
          </GridItem>
          <GridItem>
            <DashboardButton icon={faBoxOpen} href='/check-inventory' label='Check Inventory'></DashboardButton>
          </GridItem>
          <GridItem>
            <DashboardButton icon={faBoxesPacking} href='/stock-request' label='Stock Request'></DashboardButton>
          </GridItem>
          <GridItem>
            <DashboardButton icon={faTag} href='/request-tag' label='Request Tag'></DashboardButton>
          </GridItem>
        </Grid>
      </Container>
    </VStack>
  );
}
