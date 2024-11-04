import { Branch, ComboBoxOption, Distributor, SelectDistributorProps } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import ComboBox from "./ComboBox";

export default function SelectDistributor({ onChange, value }: SelectDistributorProps) {
  const [branches, setBranches] = useState<Distributor[]>([]);
  
  const initDistributorsDropdown = async () => {
    let res = await fetch('/api/distributors');
    setBranches(await res.json())
  }

  const ref = useRef();

  useEffect(() => {
    initDistributorsDropdown();
  }, []);

  return (
    <ComboBox 
      value={value}
      options={branches.map(s => ({key: s.distributor_id, text: s.distributor_code + ' - '+ s.distributor_name}))}
      onChange={(s: ComboBoxOption) => onChange && onChange(s.key)}>  
    </ComboBox>
  )
}