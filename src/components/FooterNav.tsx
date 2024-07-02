import { HStack, Link } from "@chakra-ui/react";
import { IconDefinition, faBarcode, faBoxOpen, faBoxesPacking, faHome, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const iconSize = '25px'

type FooterNavProps = {
  active: string
}

type FooterNavLinkProps = {
  href: string, 
  icon: IconDefinition,
  isActive: boolean
}

function FooterNavLink({ href, icon, isActive}: FooterNavLinkProps ) {
  let color = isActive ? 'teal' : 'white';
  return (
    <Link href={href} padding='5px'>
      <FontAwesomeIcon 
        icon={icon} 
        fontSize='25px'
        color={color}
      />
    </Link>
  )
}

export default function FooterNav({ active }: FooterNavProps) {
  return (
    <HStack backgroundColor='teal.300' width='100vw' padding='10px' justify='space-between'>
      <FooterNavLink isActive={active == 'home'} href="/" icon={faHome}></FooterNavLink>
      <FooterNavLink isActive={active == 'price-checker'} href="/price-checker" icon={faBarcode}></FooterNavLink>
      <FooterNavLink isActive={active == 'inventory-checker'} href="/inventory-checker" icon={faBoxOpen}></FooterNavLink>
      <FooterNavLink isActive={active == 'stock-request'} href="/stock-request" icon={faBoxesPacking}></FooterNavLink>
      <FooterNavLink isActive={active == 'tag-request'} href="/tag-request" icon={faTag}></FooterNavLink>
    </HStack>
  )
}