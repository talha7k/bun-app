export interface MenuItemImage {
  id: number;
  filename: string;
  original_name: string;
  file_size: number;
  created_at: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  category_id: number;
  popular: boolean;
  tags?: string[];
  images?: MenuItemImage[];
  created_at?: string;
  updated_at?: string;
}

export interface MenuItemWithCategory extends MenuItem {
  category: Category;
}

export interface Category {
  id: number;
  name: string;
  icon?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LocationImage {
  id: number;
  filename: string;
  original_name: string;
  file_size: number;
  is_primary: boolean;
  created_at: string;
}

export interface Location {
  id: number;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  hours?: string;
  description?: string;
  features?: string;
  coordinates_lat?: number;
  coordinates_lng?: number;
  created_at?: string;
  updated_at?: string;
}

export interface LocationWithImages extends Location {
  images?: LocationImage[];
}