// Mock data for development
export type Category = {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  description: string;
  imageUrl: string;
  categoryId: number;
  isNew: boolean;
  isOnSale: boolean;
};

export const CATEGORIES: Category[] = [
  { id: 1, name: "Pants", slug: "pants", imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500" },
  { id: 2, name: "Shirts", slug: "shirts", imageUrl: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500" },
  { id: 3, name: "Jackets", slug: "jackets", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500" },
  { id: 4, name: "Suits", slug: "suits", imageUrl: "https://images.unsplash.com/photo-1594938291220-94ff73e49e26?w=500" },
  { id: 5, name: "Accessories", slug: "accessories", imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500" },
  { id: 6, name: "Shoes", slug: "shoes", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500" },
];

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Classic Denim Jeans",
    price: 120,
    oldPrice: 150,
    discountPercent: 20,
    description: "Premium quality denim jeans",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
    categoryId: 1,
    isNew: true,
    isOnSale: true,
  },
  {
    id: "2",
    name: "Linen Shirt Beige",
    price: 90,
    description: "Comfortable linen shirt",
    imageUrl: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500",
    categoryId: 2,
    isNew: true,
    isOnSale: false,
  },
  {
    id: "3",
    name: "Black Leather Jacket",
    price: 350,
    oldPrice: 500,
    discountPercent: 30,
    description: "Premium leather jacket",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    categoryId: 3,
    isNew: false,
    isOnSale: true,
  },
  {
    id: "4",
    name: "Formal Pants",
    price: 150,
    description: "Elegant formal pants",
    imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500",
    categoryId: 1,
    isNew: true,
    isOnSale: false,
  },
  {
    id: "5",
    name: "White Sneakers",
    price: 200,
    oldPrice: 280,
    discountPercent: 29,
    description: "Classic white sneakers",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
    categoryId: 6,
    isNew: false,
    isOnSale: true,
  },
  {
    id: "6",
    name: "Cotton T-Shirt",
    price: 60,
    description: "Comfortable cotton t-shirt",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    categoryId: 2,
    isNew: true,
    isOnSale: false,
  },
  {
    id: "7",
    name: "Full Suit",
    price: 600,
    oldPrice: 900,
    discountPercent: 33,
    description: "Complete formal suit",
    imageUrl: "https://images.unsplash.com/photo-1594938291220-94ff73e49e26?w=500",
    categoryId: 4,
    isNew: false,
    isOnSale: true,
  },
  {
    id: "8",
    name: "Checkered Shirt",
    price: 110,
    description: "Stylish checkered shirt",
    imageUrl: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500",
    categoryId: 2,
    isNew: true,
    isOnSale: false,
  },
];
