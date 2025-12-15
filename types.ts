export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type ViewState = 'SHOP' | 'CART' | 'ADMIN_LIST' | 'ADMIN_FORM';

export interface ProductFormData {
  name: string;
  price: string;
  category: string;
  description: string;
  imageUrl: string;
}
