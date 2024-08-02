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
  branch_name: string
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