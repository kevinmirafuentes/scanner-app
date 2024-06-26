"use client"

import { VStack } from "@chakra-ui/react";
import Navbar from "./Navbar";
import Viewport from "./Viewport";
import FooterNav from "./FooterNav";

export function NavFooterLayout({ 
  children, 
  title, 
  activeFooter 
}: { 
  children: React.ReactNode, 
  title: string,
  activeFooter: string
}) {
  return (
    <>
      <VStack>
        <Navbar title={title} />
        <Viewport>
          {children}
        </Viewport>
        <FooterNav active={activeFooter} />
      </VStack>
    </>
  );
}