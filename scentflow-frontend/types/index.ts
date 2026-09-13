export interface Product {
  id: string;
  name: string;
  description: string;
  stock: number;
  price: number;
  image_url?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
