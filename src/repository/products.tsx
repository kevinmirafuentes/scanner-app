interface Product {
  id: number;
  name: string;
}

export function getProducts(): Product[] {
  return [
    { id:1, name: 'product 1' },
    { id:2, name: 'product 2' },
  ];
}