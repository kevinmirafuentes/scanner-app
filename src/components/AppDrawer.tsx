import { signOut } from "@/auth"
import { HamburgerIcon } from "@chakra-ui/icons"
import { Box, Button, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, FlexProps, HStack, LinkBox, LinkOverlay, Stack, Text, useDisclosure } from "@chakra-ui/react"
import Link from "next/link"
import { redirect, useRouter } from "next/navigation"
import React, { FormEvent, ReactText } from "react"

interface NavItemProps extends FlexProps {
  href: string,
  children: ReactText
}

const NavItem = ({ href, children, ...rest }: NavItemProps) => {
  return (
    <Box
      as="a"
      href={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      paddingY='10px'
      {...rest}>
      {children}
    </Box>
  )
}

export function AppDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const router = useRouter();

  async function handleLogout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) {
      let data = await response.json();
      alert('Something went wrong');
      return;
    } 

    router.push('/login');
  }

  const navItems = [
    {
      title: 'Home',
      link: '/'
    },
    {
      title: 'Price Checker',
      link: '/price-checker'
    },
    {
      title: 'Inventory Checker',
      link: '/inventory-checker'
    },
    {
      title: 'Stock Request',
      link: '/stock-request'
    },
    {
      title: 'Manage Stock Requests',
      link: '/stock-request/manage'
    },
    {
      title: 'Tag Request',
      link: '/tag-request'
    },
    {
      title: 'Manage Tag Requests',
      link: '/tag-request/manage'
    },
    {
      title: 'Physical Count',
      link: '/physical-count'
    },
    {
      title: 'Purchase Returns',
      link: '/purchase-returns'
    },
    {
      title: 'Stock Transfer - IN',
      link: '/stock-transfer-in'
    },
    {
      title: 'Stock Transfer - OUT',
      link: '/stock-transfer-out'
    },
    {
      title: 'Stock Adjustment - IN',
      link: '/stock-adjustment-in'
    },
    {
      title: 'Stock Adjustment - OUT',
      link: '/stock-adjustment-out'
    },
  ];

  return (
    <>
      {/* @ts-ignore */}
      <Button ref={btnRef} size='sm' onClick={onOpen} backgroundColor='white'>
        <HamburgerIcon />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        // @ts-ignore
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          
          <DrawerHeader></DrawerHeader>

          <DrawerBody>
            <Stack>
              {
                navItems.map((i, key) => (
                  <NavItem key={key} href={i.link}>{i.title}</NavItem>
                ))
              }
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Stack width='100%'>
              <Divider orientation='horizontal' />
              <form onSubmit={handleLogout}>
              <Button type='submit' width='100%'>Logout</Button>
              </form>
            </Stack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}