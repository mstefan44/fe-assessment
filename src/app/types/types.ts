export interface Category {
  _id: string;
  slug: string;
  title: string;
  Image: {
    path: string;
  };
  products: any[]; // Keeping as any[] for now; can refine later if needed
}

export interface Product {
  _id: string;
  category: Category;
  description: string;
  image: {
    path: string;
  };
  name: string;
  price: number;
  slug: string;
}
