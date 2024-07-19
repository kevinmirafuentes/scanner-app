import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function StockRequestPrintMenu({ refId }: { refId: number }) {
  let handleSelect = (type: number) => {
    let url = `/stock-request/${refId}/print`;
    if (type == 2) {
      url = `/stock-request/${refId}/print-pos`;
    }
    let win = window.open('', '_blank');
    if (win) {
      win.location = url;
    }
  }
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        <FontAwesomeIcon
          icon={faPrint}
          color='gray'
        ></FontAwesomeIcon>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => handleSelect(1)}>Print Doc</MenuItem>
        <MenuItem onClick={() => handleSelect(2)}>Print POS</MenuItem>
      </MenuList>
    </Menu>
  )  
}