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

  return (
    <>
      <Button ref={btnRef} size='sm' onClick={onOpen} backgroundColor='white'>
        <HamburgerIcon />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          
          <DrawerHeader></DrawerHeader>

          <DrawerBody>
            <Stack>
              <NavItem href="/">Home</NavItem>
              <NavItem href="/price-checker">Price Checker</NavItem>
              <NavItem href="/inventory-checker">Inventory Checker</NavItem>
              <NavItem href="/stock-request">Stock Request</NavItem>
              <NavItem href="/tag-request">Tag Request</NavItem>
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