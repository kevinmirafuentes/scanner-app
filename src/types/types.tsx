import { NumberDecrementStepperProps } from "@chakra-ui/react"
import { ISqlTypeFactory } from "mssql"

export interface PriceInfo {
  uom: string,
  barcode: string,
  retail_markup: string,
  retail_unit_price: string,
  retail_qty2: number,
  retail_unit_price2: string,
  retail_qty3: number,
  retail_unit_price3: string,
  retail_qty4: number,
  retail_unit_price4: string,
  supp_name: string,
  supp_id: number,
  qty_on_hand: number, 
  stock_qty_converted_to_order_unit: number,
  name?: string
}

export interface PriceCheck {
  name: string,
  prices: PriceInfo[]
}

export interface QueryInput {
  name: string,
  type: ISqlTypeFactory,
  value: any
}

export interface AuthUser {
  user_id: number,
  full_name: string,
  mobile_login_pwd: string,
}

export interface User {
  user_id: number|null,
  full_name?: string|null,
}

export interface InventoryDetails {
  name: string,
  barcode: string,
  qty_on_hand: number,
  stock_qty_converted_to_order_unit: number,
}

export interface Branch {
  branch_id: number,
  branch_code: string,
  branch_name: string,
  address?: string,
}

export interface StoreRequestItem {
  ref_id?: number|null,
  product_id?: number|null,
  barcode_id: number,
  qty: number,
  auto_id?: number|null,
  barcode?: string, 
  name?: string, 
  request_status?: string, 
  inv?: number, 
  uom?: string,
  remarks?: string,
  retail_unit_price?: number, 
  _?: number|null
}

export interface StoreStockRequest {
  ref_no: string, 
  ref_id?: number|null,
  trans_date: Date, 
  remarks: string, 
  request_status?: string, 
  user?: User,  
  date_created?: Date,
  items?: StoreRequestItem[]
}

export interface TagRequest {
  ref_id?: number|null,
  user?: User, 
  date_created?: Date,
  items?: TagRequestItem[]
}

export interface TagRequestItem {
  ref_id?: number|null,
  barcode_id: number,
  barcode?: number,
  name?: string,
  qty: number,
  auto_id?: number|null,
  retail_unit_price?: number,
}

export interface Supplier {
  supp_id: number, 
  supp_name: string|null
}

export interface ComboBoxOption {
  key: number|string,
  text: string,
}

export interface ComboBoxProps {
  options?: ComboBoxOption[],
  onChange?: CallableFunction,
  value?: number|string
};

export interface SelectSupplierProps {
  onChange?: CallableFunction,
  value?: string|number
}


export interface SelectBranchProps {
  onChange?: CallableFunction,
  value?: string|number
}

export interface SelectDistributorProps {
  onChange?: CallableFunction,
  value?: string|number
}

export interface ProductsListProps {
  products: StoreRequestItem[],
  onChange?: CallableFunction,
  supplierId?: string
}

export interface PhysicalCount {
  branch_id? : number,
  ref_no: string,
  trans_date?: Date // transdate
  supp_id?: number|string,
  remarks?: string, 
  total_amt?: number,
  prepared_id?: number,
  approved_id?: number,
  prev_physical_id?: number,
  branch_ref_no?: string,
  user_id?: number,
  posted?: number|null,
  date_uploaded?: Date,
  items?: PhysicalCountItem[]  
}

export interface PhysicalCountItem {
  ref_id?: number|null,
  barcode_id?: number,
  counted_qty?: number,
  unit_id?: number,
}

export interface Barcode {
  barcode_id: number|null,
  barcode: string|null,
  product_id?: number,
  order_whole_gross_cost?: number,
  order_whole_net_cost?: number,
}

export interface StockTransferIn {
  branch_id?: number, 
  ref_no?: string,
  status?: string, 
  trans_date?: Date,
  source_branch_id?: number,
  transfer_out_ref_no?: string,
  remarks?: string,
  total_qty?: number,
  total_freight_amt?: number,
  total_disc_amt?: number,
  total_charges_amt?: number,
  total_gross_amt?: number,
  total_vat_amt?: number,
  total_net_amt?: number,
  amt_paid?: number,
  balance?: number,
  total_vatable_amt?: number,
  total_non_vatable_amt?: number,
  user_id?: number,
  posted?: number,
  branch_ref_no?: string|null,
  transfer_slip_no?: string|null,
  items: StockTransferInItem[]
}

export interface StockTransferInItem {
  ref_id?: number,
  barcode_id?: number,
  qty?: number,
  unit_id?: number,
  unit_price?: number,
  gross_amt?: number,
  base_qty?: number,
  disc_id1?: number,
  disc_id2?: number,
  disc_id3?: number,
  disc_id4?: number,
  disc_id5?: number,
  disc_id6?: number,
  disc_id7?: number,
  disc_id8?: number,
  disc_amt?: number,
  freight_id?: number,
  freight_amt?: number,
  charges_id?: number,
  charges_amt?: number,
  net_amt?: number,
  total_cost?: number,
}

export interface PurchaseReturn {
  ref_id?: number,
  branch_id?: number,
  ref_no?: string,
  status?: string,
  trans_date?: Date,
  supp_id?: number,
  return_slip_no?: number,
  remarks?: string,
  total_qty?: number,
  total_gross_amt?: number,
  total_disc_amt?: number,
  total_freight_amt?: number,
  total_charges_amt?: number,
  total_vat_amt?: number,
  total_net_amt?: number,
  amt_paid?: number,
  balance?: number,
  total_vatable_amt?: number,
  total_non_vatable_amt?: number,
  disc_id1?: number|null,
  disc_id2?: number|null,
  disc_id3?: number|null,
  disc_id4?: number|null,
  disc_id5?: number|null,
  user_id?: number,
  posted?: number,
  vat_price_indicator?: number|null,
  branch_ref_no?: string|null,
  distributor_id?: number|null,
  date_created?: Date,
  items?: PurchaseReturnItem[],
  supplier?: Supplier,
  branch?: Branch
}

export interface PurchaseReturnItem {
  ref_id?: number,
  barcode_id?: number,
  product_name?: string,
  qty?: number,
  unit_id?: number,
  unit_code?: string,
  unit_price?: number,
  gross_amt?: number,
  base_qty?: number,
  disc_id1?: number,
  disc_id2?: number,
  disc_id3?: number,
  disc_id4?: number,
  disc_id5?: number,
  disc_amt?: number,
  prorated_disc_amt?: number|null,
  freight_id?: number,
  freight_amt?: number,
  charges_id?: number,
  charges_amt?: number,
  net_amt?: number,
  total_cost?: number,
}

export interface Distributor {
  distributor_code: string,
  distributor_id: number,
  distributor_name: string,
}

export interface StockTransferOut {
  source_branch_id?: number, 
  ref_no?: string,
  ref_id?: number,
  status?: string,
  trans_date?: Date, 
  dest_branch_id?: number,
  remarks?: string, 
  total_qty?: number,
  total_gross_amt?: number,
  total_disc_amt?: number,
  total_freight_amt?: number,
  total_charges_amt?: number,
  total_vat_amt?: number,
  total_net_amt?: number, 
  amt_paid?: number, 
  balance?: number,
  total_vatable_amt?: number,
  total_non_vatable_amt?: number, 
  user_id?: number,
  posted?: number, 
  transfer_type?: number|null, 
  cashier_id?: number|null, 
  branch_ref_no?: string|null,
  transfer_slip_no?: string|null,
  items: StockTransferOutItem[]
}

export interface StockTransferOutItem {
  ref_id?: number,
  barcode_id?: number, 
  qty?: number,
  unit_id?: number, 
  unit_price?: number,
  gross_amt?: number,
  base_qty?: number,
  disc_id1?: number,
  disc_id2?: number,
  disc_id3?: number,
  disc_id4?: number,
  disc_id5?: number,
  disc_id6?: number,
  disc_id7?: number,
  disc_id8?: number,
  disc_amt?: number,
  freight_id?: number,
  freight_amt?: number,
  charges_id?: number,
  charges_amt?: number,
  net_amt?: number, 
  total_cost?: number, 
}

export interface StockAdjustmentIn {
  branch_id?: number, 
  adj_no?: string, 
  status?: string, 
  trans_date?: Date, 
  remarks?: string, 
  total_qty?: number, 
  total_net_amt?: number, 
  user_id?: number, 
  posted?: number, 
  branch_ref_no?: string,
  items?: StockAdjustmentInItem[]
}

export interface StockAdjustmentInItem {
  adj_id?: number, 
  barcode_id?: number, 
  qty?: number, 
  unit_id?: number, 
  unit_price?: number, 
  base_qty?: number, 
  net_amt?: number, 
  expiry_date?: Date|null, 
  stocks_already_sold?: number|null,
}

export interface StockAdjustmentOut {
  branch_id?: number, 
  adj_no?: string, 
  status?: string, 
  trans_date?: Date, 
  remarks?: string, 
  total_qty?: number, 
  total_net_amt?: number, 
  user_id?: number, 
  posted?: number|null, 
  branch_ref_no?: string, 
  items: StockAdjustmentOutItem[],
}

export interface StockAdjustmentOutItem {
  adj_id?: number, 
  barcode_id?: number, 
  qty?: number, 
  unit_id?: number, 
  unit_price?: number,
  base_qty?: number, 
  net_amt?: number, 
}

export interface Unit {
  unit_id?: number,
  unit_code?: string,
  content_qty?: number,
}