/**
 * Smart Rice Quality Grading Engine
 * 
 * This module simulates a CNN-based rice quality grading system.
 * In production, this would use TensorFlow Lite with a trained model.
 * 
 * For now, we use heuristic rules based on image analysis simulations.
 */

export type MillingDegree = "Regular" | "Well-milled" | "Premium";
export type QualityGrade = "REGULAR" | "WELL-MILLED" | "PREMIUM";
export type DefectType = "chalky" | "discolored" | "damaged" | "foreign_material";

export interface GradingResult {
  grade: QualityGrade;
  gradeColor: string;
  confidence: number;
  millingDegree: MillingDegree;
  brokenRiceRate: number;
  defects: DefectType[];
  defectSeverity: "none" | "minor" | "moderate" | "severe";
  explanation: string;
  recommendations: string[];
}

/**
 * Simulates CNN-based rice grain analysis
 * In production, this would process actual image data through a TensorFlow Lite model
 */
export function analyzeRiceImage(imageUri: string): GradingResult {
  // Simulate image analysis by generating pseudo-random but deterministic results
  // based on image characteristics (in real implementation, would use ML model)
  
  const seed = generateSeed(imageUri);
  const randomValue = pseudoRandom(seed);
  
  // Determine quality grade based on simulated analysis
  let grade: QualityGrade;
  let millingDegree: MillingDegree;
  let brokenRiceRate: number;
  let defects: DefectType[] = [];
  let confidence: number;
  
  if (randomValue < 0.3) {
    // Premium grade (30% probability)
    grade = "PREMIUM";
    millingDegree = "Well-milled";
    brokenRiceRate = 1.5 + Math.random() * 2;
    confidence = 0.92 + Math.random() * 0.07;
    defects = [];
  } else if (randomValue < 0.65) {
    // Well-milled grade (35% probability)
    grade = "WELL-MILLED";
    millingDegree = "Well-milled";
    brokenRiceRate = 4 + Math.random() * 3;
    confidence = 0.88 + Math.random() * 0.10;
    defects = Math.random() > 0.6 ? ["chalky"] : [];
  } else {
    // Regular grade (35% probability)
    grade = "REGULAR";
    millingDegree = "Regular";
    brokenRiceRate = 7 + Math.random() * 4;
    confidence = 0.85 + Math.random() * 0.12;
    defects = generateDefects();
  }
  
  // Determine defect severity
  const defectSeverity = getDefectSeverity(defects, brokenRiceRate);
  
  // Generate explanation
  const explanation = generateExplanation(grade, millingDegree, brokenRiceRate, defects);
  
  // Generate recommendations
  const recommendations = generateRecommendations(grade, defects, brokenRiceRate);
  
  return {
    grade,
    gradeColor: getGradeColor(grade),
    confidence: Math.round(confidence * 100) / 100,
    millingDegree,
    brokenRiceRate: Math.round(brokenRiceRate * 10) / 10,
    defects,
    defectSeverity,
    explanation,
    recommendations,
  };
}

/**
 * Generate a seed from image URI for deterministic pseudo-randomness
 */
function generateSeed(imageUri: string): number {
  let hash = 0;
  for (let i = 0; i < imageUri.length; i++) {
    const char = imageUri.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Pseudo-random number generator (0-1)
 */
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Generate random defects based on probability
 */
function generateDefects(): DefectType[] {
  const defects: DefectType[] = [];
  
  if (Math.random() > 0.4) defects.push("chalky");
  if (Math.random() > 0.5) defects.push("discolored");
  if (Math.random() > 0.7) defects.push("damaged");
  if (Math.random() > 0.85) defects.push("foreign_material");
  
  return defects;
}

/**
 * Determine defect severity level
 */
function getDefectSeverity(
  defects: DefectType[],
  brokenRiceRate: number
): "none" | "minor" | "moderate" | "severe" {
  if (defects.length === 0 && brokenRiceRate < 3) return "none";
  if (defects.length <= 1 && brokenRiceRate < 5) return "minor";
  if (defects.length <= 2 && brokenRiceRate < 8) return "moderate";
  return "severe";
}

/**
 * Get color code for quality grade
 */
function getGradeColor(grade: QualityGrade): string {
  switch (grade) {
    case "PREMIUM":
      return "#22C55E";
    case "WELL-MILLED":
      return "#3B82F6";
    case "REGULAR":
      return "#F59E0B";
    default:
      return "#687076";
  }
}

/**
 * Generate human-readable explanation of grading result
 */
function generateExplanation(
  grade: QualityGrade,
  millingDegree: MillingDegree,
  brokenRiceRate: number,
  defects: DefectType[]
): string {
  let explanation = `This rice sample is graded as ${grade}. `;
  
  explanation += `The milling degree is ${millingDegree}, with ${brokenRiceRate.toFixed(1)}% broken rice. `;
  
  if (defects.length === 0) {
    explanation += "No significant defects were detected.";
  } else {
    const defectNames = defects.map((d) => d.replace(/_/g, " ")).join(", ");
    explanation += `Detected defects: ${defectNames}.`;
  }
  
  return explanation;
}

/**
 * Generate recommendations based on grading result
 */
function generateRecommendations(
  grade: QualityGrade,
  defects: DefectType[],
  brokenRiceRate: number
): string[] {
  const recommendations: string[] = [];
  
  if (grade === "PREMIUM") {
    recommendations.push("Excellent quality - suitable for premium market");
    recommendations.push("Store in cool, dry conditions to maintain quality");
  } else if (grade === "WELL-MILLED") {
    recommendations.push("Good quality - suitable for standard market");
    if (brokenRiceRate > 6) {
      recommendations.push("Consider additional milling to reduce broken rice");
    }
  } else {
    recommendations.push("Fair quality - suitable for bulk market");
    if (defects.includes("chalky") || defects.includes("discolored")) {
      recommendations.push("Consider additional cleaning and sorting");
    }
  }
  
  if (defects.includes("foreign_material")) {
    recommendations.push("Remove foreign materials before selling");
  }
  
  if (brokenRiceRate > 8) {
    recommendations.push("High broken rice rate - review harvesting and milling process");
  }
  
  return recommendations;
}

/**
 * Calculate confidence score based on image quality indicators
 * In production, this would come from the ML model's output
 */
export function calculateConfidenceScore(imageUri: string): number {
  // Simulate confidence based on image characteristics
  const seed = generateSeed(imageUri);
  const baseConfidence = 0.85 + pseudoRandom(seed) * 0.14;
  return Math.round(baseConfidence * 100) / 100;
}

/**
 * Highlight defect regions using Grad-CAM-like visualization
 * Returns coordinates of regions with highest defect probability
 */
export function getDefectHighlights(
  imageUri: string,
  defects: DefectType[]
): Array<{ x: number; y: number; radius: number; type: DefectType }> {
  const highlights: Array<{ x: number; y: number; radius: number; type: DefectType }> = [];
  
  // Simulate defect region detection
  const seed = generateSeed(imageUri);
  
  defects.forEach((defect, idx) => {
    const offsetSeed = seed + idx * 1000;
    highlights.push({
      x: 0.3 + pseudoRandom(offsetSeed) * 0.4,
      y: 0.3 + pseudoRandom(offsetSeed + 1) * 0.4,
      radius: 0.08 + pseudoRandom(offsetSeed + 2) * 0.04,
      type: defect,
    });
  });
  
  return highlights;
}

/**
 * Batch process multiple images (for future bulk scanning feature)
 */
export function batchAnalyzeImages(imageUris: string[]): GradingResult[] {
  return imageUris.map((uri) => analyzeRiceImage(uri));
}
