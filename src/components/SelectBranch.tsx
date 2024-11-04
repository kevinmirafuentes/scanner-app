import { Branch, ComboBoxOption, SelectBranchProps, Supplier } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import ComboBox from "./ComboBox";

export default function SelectBranch({ onChange, value }: SelectBranchProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  
  const initBranchDropdown = async () => {
    let res = await fetch('/api/branches');
    setBranches(await res.json())
  }

  const ref = useRef();

  useEffect(() => {
    initBranchDropdown();
  }, []);

  return (
    <ComboBox 
      value={value}
      options={branches.map(s => ({key: s.branch_id, text: s.branch_code + ' - '+ s.branch_name}))}
      onChange={(s: ComboBoxOption) => onChange && onChange(s.key)}>  
    </ComboBox>
  )
}