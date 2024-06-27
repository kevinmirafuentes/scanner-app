import { ISqlTypeFactory } from "mssql"

export interface PriceInfo {
  oum: string,
  barcode: string,
  retail_markup: number,
  retail_unit_price: number,
  retail_qty2: number,
  retail_markup2: number,
  retail_qty3: number,
  retail_markup3: number,
  retail_qty4: number,
  retail_markup4: number,
  supp_name: string,
  supp_id: number
}

export interface PriceCheck {
  name: string,
  prices: PriceInfo[]
}

export interface QueryInput {
  name: string,
  type: ISqlTypeFactory,
  value: string|number|null
}

export interface AuthUser {
  user_id: number,
  branch_id: string,
  branch_name: string,
  full_name: string,
  mobile_login_pwd: string,
}

export interface InventoryDetails {
  name: string,
  barcode: string,
  inventory: number,
  order_unit: number,
}

export interface StockRequestProduct {
  barcode: string,
  name: string,
  quantity: number,
}