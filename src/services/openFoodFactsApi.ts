import { OpenFoodFactsResponse, Product } from '../types';

const BASE_URL = 'https://world.openfoodfacts.org/api/v2';

/**
 * Fetch product information from Open Food Facts API using barcode
 */
export async function getProductByBarcode(barcode: string): Promise<Product | null> {
  try {
    const response = await fetch(`${BASE_URL}/product/${barcode}.json`, {
      headers: {
        'User-Agent': 'FoodScanner/1.0 (Expo React Native App)',
      },
    });

    if (!response.ok) {
      console.error('API error:', response.status);
      return null;
    }

    const data: OpenFoodFactsResponse = await response.json();

    if (data.status === 1 && data.product) {
      return data.product;
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

/**
 * Get Nutri-Score color based on grade
 */
export function getNutriScoreColor(grade: string | undefined): string {
  switch (grade?.toLowerCase()) {
    case 'a':
      return '#038141';
    case 'b':
      return '#85bb2f';
    case 'c':
      return '#fecb02';
    case 'd':
      return '#ee8100';
    case 'e':
      return '#dc2626';
    default:
      return '#888888';
  }
}

/**
 * Get Nutri-Score description based on grade
 */
export function getNutriScoreDescription(grade: string | undefined): string {
  switch (grade?.toLowerCase()) {
    case 'a':
      return 'Best nutritional quality';
    case 'b':
      return 'Good quality';
    case 'c':
      return 'Moderate quality';
    case 'd':
      return 'Poor quality';
    case 'e':
      return 'Worst nutritional quality';
    default:
      return 'Unknown quality';
  }
}

/**
 * Format nutrient value with unit
 */
export function formatNutrient(value: number | undefined, unit: string = 'g'): string {
  if (value === undefined || value === null) return '-';
  return `${value.toFixed(1)} ${unit}`;
}

/**
 * Get NOVA group description
 */
export function getNovaDescription(group: number | undefined): string {
  switch (group) {
    case 1:
      return 'Unprocessed or minimally processed foods';
    case 2:
      return 'Processed culinary ingredients';
    case 3:
      return 'Processed foods';
    case 4:
      return 'Ultra-processed food and drink products';
    default:
      return 'Unknown processing level';
  }
}

/**
 * Get NOVA group color based on processing level
 */
export function getNovaGroupColor(group: number | undefined): string {
  switch (group) {
    case 1:
      return '#038141';
    case 2:
      return '#85BB2F';
    case 3:
      return '#FECB02';
    case 4:
      return '#dc2626';
    default:
      return '#888888';
  }
}
