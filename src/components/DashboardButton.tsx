import { Center, LinkBox, LinkOverlay, Text, VStack } from "@chakra-ui/react"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type DashboardButtonProps = {
  icon: IconDefinition,
  href: string,
  label: string
} 

export default function DashboardButton({
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