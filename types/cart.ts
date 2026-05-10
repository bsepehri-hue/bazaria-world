export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sellerAddress?: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}
