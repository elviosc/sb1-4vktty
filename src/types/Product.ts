export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  shareableLink?: string;
  createdAt: number;
}