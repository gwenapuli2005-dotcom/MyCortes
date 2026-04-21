/**
 * Smart Rice Price Prediction Engine
 * 
 * This module implements dynamic pricing based on:
 * - Rice quality (from AI grading)
 * - Season (harvest vs. lean)
 * - Supply & demand factors
 * - Regional location
 * 
 * Formula: Final Price = Base Price × Seasonal Factor × Supply Factor × Location Factor
 */

import type { QualityGrade } from "./ai-grading-engine";

export interface PriceEstimate {
  suggestedPrice: number;
  minPrice: number;
  maxPrice: number;
  basePrice: number;
  seasonalFactor: number;
  supplyFactor: number;
  locationFactor: number;
  marketAverage: number;
  priceRange: string;
  explanation: string;
  marketComparison: string;
}

export interface SeasonalData {
  season: "harvest" | "lean";
  factor: number;
  description: string;
}

export interface RegionalData {
  region: string;
  factor: number;
  description: string;
}

/**
 * Base prices per kg in PHP by quality category
 * These are typical market prices in the Philippines
 */
const BASE_PRICES: Record<QualityGrade, { min: number; max: number; avg: number }> = {
  REGULAR: { min: 38, max: 45, avg: 42 },
  "WELL-MILLED": { min: 45, max: 52, avg: 48 },
  PREMIUM: { min: 52, max: 65, avg: 58 },
};

/**
 * Seasonal adjustment factors
 * Harvest season: prices are lower (abundant supply)
 * Lean season: prices are higher (scarce supply)
 */
const SEASONAL_FACTORS: Record<string, SeasonalData> = {
  harvest: {
    season: "harvest",
    factor: 0.85, // 15% discount during harvest
    description: "Harvest season - abundant supply",
  },
  lean: {
    season: "lean",
    factor: 1.15, // 15% premium during lean season
    description: "Lean season - scarce supply",
  },
};

/**
 * Regional location factors
 * Different regions have different market conditions
 */
const REGIONAL_FACTORS: Record<string, RegionalData> = {
  "Surigao del Sur": { region: "Surigao del Sur", factor: 1.0, description: "Baseline region" },
  "Agusan del Sur": { region: "Agusan del Sur", factor: 1.02, description: "Slightly higher demand" },
  "Davao": { region: "Davao", factor: 1.05, description: "Urban market premium" },
  "Nueva Ecija": { region: "Nueva Ecija", factor: 0.98, description: "Major production area" },
  "Pangasinan": { region: "Pangasinan", factor: 0.97, description: "High supply region" },
};

/**
 * Supply & demand factors based on current market conditions
 * These would be updated from real-time market data in production
 */
function getSupplyFactor(currentDate: Date = new Date()): number {
  // Simulate supply variations based on season
  const month = currentDate.getMonth();
  
  // Harvest months (June-September): lower prices
  if (month >= 5 && month <= 8) {
    return 0.9 + Math.random() * 0.1; // 0.9-1.0
  }
  
  // Lean months (March-May, October-November): higher prices
  if ((month >= 2 && month <= 4) || (month >= 9 && month <= 10)) {
    return 1.05 + Math.random() * 0.1; // 1.05-1.15
  }
  
  // Normal months: baseline
  return 0.95 + Math.random() * 0.1; // 0.95-1.05
}

/**
 * Determine current season based on date
 */
export function getCurrentSeason(date: Date = new Date()): "harvest" | "lean" {
  const month = date.getMonth();
  
  // Harvest season: June-September (months 5-8)
  if (month >= 5 && month <= 8) {
    return "harvest";
  }
  
  // Lean season: other months
  return "lean";
}

/**
 * Calculate dynamic price estimate for rice
 * 
 * @param grade - Quality grade from AI analysis (REGULAR, WELL-MILLED, PREMIUM)
 * @param location - Regional location (default: Surigao del Sur)
 * @param date - Reference date for seasonal calculation
 * @returns Price estimate with breakdown
 */
export function estimatePrice(
  grade: QualityGrade,
  location: string = "Surigao del Sur",
  date: Date = new Date()
): PriceEstimate {
  // Get base price for quality grade
  const basePriceData = BASE_PRICES[grade];
  const basePrice = basePriceData.avg;
  
  // Get seasonal factor
  const season = getCurrentSeason(date);
  const seasonalFactor = SEASONAL_FACTORS[season].factor;
  
  // Get supply & demand factor
  const supplyFactor = getSupplyFactor(date);
  
  // Get regional factor
  const regionalData = REGIONAL_FACTORS[location] || REGIONAL_FACTORS["Surigao del Sur"];
  const locationFactor = regionalData.factor;
  
  // Calculate final price
  const suggestedPrice = basePrice * seasonalFactor * supplyFactor * locationFactor;
  
  // Calculate price range (±10% from suggested)
  const minPrice = Math.round(suggestedPrice * 0.9 * 100) / 100;
  const maxPrice = Math.round(suggestedPrice * 1.1 * 100) / 100;
  const roundedPrice = Math.round(suggestedPrice * 100) / 100;
  
  // Get market average (base price adjusted by seasonal factor)
  const marketAverage = Math.round(basePrice * seasonalFactor * 100) / 100;
  
  // Generate explanation
  const explanation = generatePriceExplanation(
    grade,
    basePrice,
    seasonalFactor,
    supplyFactor,
    locationFactor,
    season
  );
  
  // Market comparison
  const marketComparison = generateMarketComparison(roundedPrice, marketAverage, grade);
  
  return {
    suggestedPrice: roundedPrice,
    minPrice,
    maxPrice,
    basePrice,
    seasonalFactor: Math.round(seasonalFactor * 100) / 100,
    supplyFactor: Math.round(supplyFactor * 100) / 100,
    locationFactor: Math.round(locationFactor * 100) / 100,
    marketAverage,
    priceRange: `₱${minPrice} - ₱${maxPrice}`,
    explanation,
    marketComparison,
  };
}

/**
 * Generate human-readable price explanation
 */
function generatePriceExplanation(
  grade: QualityGrade,
  basePrice: number,
  seasonalFactor: number,
  supplyFactor: number,
  locationFactor: number,
  season: "harvest" | "lean"
): string {
  let explanation = `Base price for ${grade} rice: ₱${basePrice}/kg. `;
  
  explanation += `Current ${season} season (${(seasonalFactor * 100).toFixed(0)}% adjustment). `;
  
  if (supplyFactor > 1) {
    explanation += `Supply is tight, increasing price by ${((supplyFactor - 1) * 100).toFixed(0)}%. `;
  } else {
    explanation += `Supply is abundant, reducing price by ${((1 - supplyFactor) * 100).toFixed(0)}%. `;
  }
  
  if (locationFactor !== 1) {
    const adjustment = locationFactor > 1 ? "higher" : "lower";
    explanation += `Regional market conditions suggest ${adjustment} prices.`;
  }
  
  return explanation;
}

/**
 * Generate market comparison statement
 */
function generateMarketComparison(
  suggestedPrice: number,
  marketAverage: number,
  grade: QualityGrade
): string {
  const difference = suggestedPrice - marketAverage;
  const percentDifference = Math.round((difference / marketAverage) * 100);
  
  if (Math.abs(percentDifference) < 2) {
    return `Your price (₱${suggestedPrice}) is in line with market average (₱${marketAverage}) for ${grade} rice.`;
  } else if (percentDifference > 0) {
    return `Your price (₱${suggestedPrice}) is ${percentDifference}% above market average (₱${marketAverage}) - competitive!`;
  } else {
    return `Your price (₱${suggestedPrice}) is ${Math.abs(percentDifference)}% below market average (₱${marketAverage}) - attractive to buyers.`;
  }
}

/**
 * Get price history simulation (7-day trend)
 */
export function getPriceHistory(
  grade: QualityGrade,
  location: string = "Surigao del Sur",
  days: number = 7
): Array<{ date: string; price: number }> {
  const history: Array<{ date: string; price: number }> = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const estimate = estimatePrice(grade, location, date);
    const dateStr = date.toLocaleDateString("en-US", { weekday: "short" });
    
    history.push({
      date: dateStr,
      price: estimate.suggestedPrice,
    });
  }
  
  return history;
}

/**
 * Batch price estimation for multiple grades
 */
export function estimateBatchPrices(
  grades: QualityGrade[],
  location: string = "Surigao del Sur"
): Record<QualityGrade, PriceEstimate> {
  const estimates: Partial<Record<QualityGrade, PriceEstimate>> = {};
  
  grades.forEach((grade) => {
    estimates[grade] = estimatePrice(grade, location);
  });
  
  return estimates as Record<QualityGrade, PriceEstimate>;
}

/**
 * Get all available regions
 */
export function getAvailableRegions(): string[] {
  return Object.keys(REGIONAL_FACTORS);
}

/**
 * Get seasonal information
 */
export function getSeasonalInfo(date: Date = new Date()): SeasonalData {
  const season = getCurrentSeason(date);
  return SEASONAL_FACTORS[season];
}
