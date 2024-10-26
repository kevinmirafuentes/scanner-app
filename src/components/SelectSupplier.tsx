import { ComboBoxOption, SelectSupplierProps, Supplier } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import ComboBox from "./ComboBox";

export default function SelectSupplier({ onChange }: SelectSupplierProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  
  const initSuppliersDropdown = async () => {
    let res = await fetch('/api/suppliers');
    setSuppliers(await res.json())
  }

  const ref = useRef();

  useEffect(() => {
    initSuppliersDropdown();
  }, []);
  
  return (
    <ComboBox 
      options={suppliers.map(s => ({key: s.supp_id, text: s.supp_id + ' - '+ s.supp_name}))}
      onChange={(s: ComboBoxOption) => onChange && onChange(s.key)}>  
    </ComboBox>
  )
}