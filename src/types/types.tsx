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
