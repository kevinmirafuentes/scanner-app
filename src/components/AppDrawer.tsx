import { signOut } from "@/auth"
import { HamburgerIcon } from "@chakra-ui/icons"
import { Box, Button, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, FlexProps, HStack, LinkBox, LinkOverlay, Stack, Text, useDisclosure } from "@chakra-ui/react"
import Link from "next/link"
import React, { ReactText } from "react"

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
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

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
          <DrawerHeader>

          </DrawerHeader>

          <DrawerBody>
            <Stack>

              <NavItem href="/">Home</NavItem>
              <NavItem href="/">Price Checker</NavItem>
              <NavItem href="/">Inventory Checker</NavItem>
              <NavItem href="/">Stock Request</NavItem>
              <NavItem href="/">Tag Request</NavItem>
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Stack width='100%'>
              <Divider orientation='horizontal' />
              <NavItem href="/">Logout</NavItem>
            </Stack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}