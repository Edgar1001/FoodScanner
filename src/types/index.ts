// Open Food Facts API types

export interface NutrientLevels {
  fat: 'low' | 'moderate' | 'high';
  salt: 'low' | 'moderate' | 'high';
  saturated_fat: 'low' | 'moderate' | 'high';
  sugars: 'low' | 'moderate' | 'high';
}

export interface Nutriments {
  energy_kcal?: number;
  energy_kcal_100g?: number;
  fat?: number;
  fat_100g?: number;
  saturated_fat?: number;
  'saturated-fat_100g'?: number;
  carbohydrates?: number;
  carbohydrates_100g?: number;
  sugars?: number;
  sugars_100g?: number;
  fiber?: number;
  fiber_100g?: number;
  proteins?: number;
  proteins_100g?: number;
  salt?: number;
  salt_100g?: number;
  sodium?: number;
  sodium_100g?: number;
}

export interface Product {
  _id: string;
  code: string;
  product_name?: string;
  brands?: string;
  image_url?: string;
  image_front_url?: string;
  image_front_small_url?: string;
  quantity?: string;
  categories?: string;
  ingredients_text?: string;
  allergens?: string;
  allergens_tags?: string[];
  additives_tags?: string[];
  nutriments?: Nutriments;
  nutriscore_grade?: string;
  nova_group?: number;
  nutrition_grades?: string;
  nutrient_levels?: NutrientLevels;
  serving_size?: string;
  ecoscore_grade?: string;
}

export interface OpenFoodFactsResponse {
  status: number;
  status_verbose: string;
  code: string;
  product?: Product;
}
