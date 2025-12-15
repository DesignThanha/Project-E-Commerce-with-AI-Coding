import { Product } from '../types';

const STORAGE_KEY = 'luxemart_products';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Minimalist Leather Watch',
    price: 129.99,
    category: 'Accessories',
    description: 'A sleek, genuine leather watch featuring a minimalist dial and water resistance. Perfect for both casual and formal occasions.',
    imageUrl: 'https://picsum.photos/400/400?random=1'
  },
  {
    id: '2',
    name: 'Wireless Noise-Canceling Headphones',
    price: 249.50,
    category: 'Electronics',
    description: 'Immerse yourself in music with active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions.',
    imageUrl: 'https://picsum.photos/400/400?random=2'
  },
  {
    id: '3',
    name: 'Ceramic Pour-Over Coffee Set',
    price: 45.00,
    category: 'Home',
    description: 'Handcrafted ceramic pour-over set for the perfect morning brew. Includes dripper and serving carafe with a matte finish.',
    imageUrl: 'https://picsum.photos/400/400?random=3'
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    price: 350.00,
    category: 'Furniture',
    description: 'Designed for all-day comfort with breathable mesh, adjustable lumbar support, and 4D armrests.',
    imageUrl: 'https://picsum.photos/400/400?random=4'
  }
];

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  return JSON.parse(stored);
};

export const saveProducts = (products: Product[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};
