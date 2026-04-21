/**
 * Smart Rice Quality Dataset Structure
 * 
 * This module defines the data structures for rice quality grading dataset.
 * In production, this would be populated from actual rice grain images
 * and their corresponding quality labels.
 */

export interface RiceGrainImage {
  id: string;
  filename: string;
  timestamp: Date;
  imageUri: string;
  metadata: ImageMetadata;
}

export interface ImageMetadata {
  width: number;
  height: number;
  dpi: number;
  lightingConditions: "natural" | "artificial" | "mixed";
  backgroundColor: "white" | "black" | "other";
  imageQuality: "high" | "medium" | "low";
}

export interface RiceQualityLabel {
  imageId: string;
  grade: "REGULAR" | "WELL-MILLED" | "PREMIUM";
  millingDegree: "Regular" | "Well-milled" | "Premium";
  brokenRicePercentage: number;
  defects: DefectLabel[];
  foreignMaterials: boolean;
  labeledBy: string;
  labelDate: Date;
  confidence: number;
}

export interface DefectLabel {
  type: "chalky" | "discolored" | "damaged" | "immature";
  severity: "minor" | "moderate" | "severe";
  location: { x: number; y: number; width: number; height: number };
  description: string;
}

export interface DatasetSplit {
  training: RiceGrainImage[];
  validation: RiceGrainImage[];
  testing: RiceGrainImage[];
}

export interface DatasetStatistics {
  totalImages: number;
  trainingSize: number;
  validationSize: number;
  testingSize: number;
  gradeDistribution: Record<string, number>;
  defectFrequency: Record<string, number>;
  averageBrokenRiceRate: number;
}

/**
 * Sample dataset structure for rice quality grading
 * 
 * Sources:
 * - Local dataset: Surigao del Sur rice farms
 * - Public datasets: Kaggle rice quality datasets
 * - Synthetic data: Generated for testing
 */
export const SAMPLE_DATASET_STATISTICS: DatasetStatistics = {
  totalImages: 5000,
  trainingSize: 3500, // 70%
  validationSize: 750, // 15%
  testingSize: 750, // 15%
  gradeDistribution: {
    REGULAR: 1750, // 35%
    "WELL-MILLED": 2000, // 40%
    PREMIUM: 1250, // 25%
  },
  defectFrequency: {
    chalky: 1200,
    discolored: 800,
    damaged: 600,
    immature: 400,
    "foreign_material": 300,
  },
  averageBrokenRiceRate: 5.2,
};

/**
 * Data preprocessing pipeline steps
 */
export const PREPROCESSING_PIPELINE = [
  {
    step: 1,
    name: "Image Normalization",
    description: "Resize all images to 224×224 pixels (MobileNetV2 input size)",
    parameters: {
      targetWidth: 224,
      targetHeight: 224,
      interpolation: "bilinear",
    },
  },
  {
    step: 2,
    name: "Color Space Conversion",
    description: "Convert RGB to standardized color space",
    parameters: {
      colorSpace: "RGB",
      normalization: "0-1 range",
    },
  },
  {
    step: 3,
    name: "Background Removal",
    description: "Remove background using white background detection",
    parameters: {
      method: "threshold-based",
      threshold: 240,
    },
  },
  {
    step: 4,
    name: "Contrast Enhancement",
    description: "Enhance grain visibility using CLAHE",
    parameters: {
      clipLimit: 2.0,
      tileGridSize: 8,
    },
  },
  {
    step: 5,
    name: "Noise Reduction",
    description: "Apply bilateral filter to reduce noise while preserving edges",
    parameters: {
      diameter: 9,
      sigmaColor: 75,
      sigmaSpace: 75,
    },
  },
];

/**
 * Data augmentation strategies
 */
export const DATA_AUGMENTATION_STRATEGIES = [
  {
    name: "Rotation",
    description: "Rotate images by ±15 degrees",
    parameters: { minAngle: -15, maxAngle: 15 },
    probability: 0.5,
  },
  {
    name: "Brightness Adjustment",
    description: "Adjust brightness by ±20%",
    parameters: { minBrightness: 0.8, maxBrightness: 1.2 },
    probability: 0.5,
  },
  {
    name: "Horizontal Flip",
    description: "Flip images horizontally",
    parameters: {},
    probability: 0.5,
  },
  {
    name: "Zoom",
    description: "Random zoom between 0.9x and 1.1x",
    parameters: { minZoom: 0.9, maxZoom: 1.1 },
    probability: 0.3,
  },
  {
    name: "Gaussian Blur",
    description: "Apply slight blur to simulate focus variations",
    parameters: { kernelSize: 3, sigma: 0.5 },
    probability: 0.2,
  },
];

/**
 * Feature extraction specifications
 */
export const FEATURE_EXTRACTION_SPECS = [
  {
    category: "Shape Features",
    features: [
      "grain_length",
      "grain_width",
      "aspect_ratio",
      "circularity",
      "solidity",
    ],
  },
  {
    category: "Color Features",
    features: [
      "mean_brightness",
      "color_variance",
      "white_area_percentage",
      "chalky_area_percentage",
    ],
  },
  {
    category: "Texture Features",
    features: [
      "contrast",
      "correlation",
      "energy",
      "homogeneity",
      "entropy",
    ],
  },
  {
    category: "Defect Features",
    features: [
      "crack_presence",
      "discoloration_area",
      "foreign_material_count",
      "damage_severity",
    ],
  },
];

/**
 * Model architecture specifications
 */
export const MODEL_ARCHITECTURE_SPECS = {
  baseModel: "MobileNetV2",
  inputShape: [224, 224, 3],
  outputClasses: 3,
  classLabels: ["REGULAR", "WELL-MILLED", "PREMIUM"],
  layers: [
    {
      name: "Input",
      type: "Input",
      outputShape: [224, 224, 3],
    },
    {
      name: "MobileNetV2",
      type: "PretrainedCNN",
      outputShape: [7, 7, 1280],
      trainable: false,
    },
    {
      name: "GlobalAveragePooling",
      type: "Pooling",
      outputShape: [1280],
    },
    {
      name: "Dense_1",
      type: "Dense",
      units: 512,
      activation: "relu",
      outputShape: [512],
    },
    {
      name: "Dropout_1",
      type: "Dropout",
      rate: 0.5,
      outputShape: [512],
    },
    {
      name: "Dense_2",
      type: "Dense",
      units: 256,
      activation: "relu",
      outputShape: [256],
    },
    {
      name: "Dropout_2",
      type: "Dropout",
      rate: 0.3,
      outputShape: [256],
    },
    {
      name: "Output",
      type: "Dense",
      units: 3,
      activation: "softmax",
      outputShape: [3],
    },
  ],
};

/**
 * Training configuration
 */
export const TRAINING_CONFIG = {
  optimizer: "Adam",
  learningRate: 0.001,
  loss: "categorical_crossentropy",
  metrics: ["accuracy", "precision", "recall", "f1_score"],
  batchSize: 32,
  epochs: 50,
  earlyStoppingPatience: 10,
  validationSplit: 0.2,
};

/**
 * Expected model performance
 */
export const EXPECTED_PERFORMANCE = {
  overallAccuracy: 0.92,
  classAccuracy: {
    REGULAR: 0.89,
    "WELL-MILLED": 0.94,
    PREMIUM: 0.93,
  },
  precision: {
    REGULAR: 0.88,
    "WELL-MILLED": 0.93,
    PREMIUM: 0.95,
  },
  recall: {
    REGULAR: 0.90,
    "WELL-MILLED": 0.94,
    PREMIUM: 0.91,
  },
  f1Score: {
    REGULAR: 0.89,
    "WELL-MILLED": 0.935,
    PREMIUM: 0.93,
  },
};

/**
 * Data sources and collection information
 */
export const DATA_SOURCES = [
  {
    name: "Surigao del Sur Local Farms",
    region: "Caraga Region, Philippines",
    samples: 2000,
    collectionMethod: "Direct farm collection",
    dateRange: "2023-2024",
  },
  {
    name: "Kaggle Rice Quality Dataset",
    url: "https://www.kaggle.com/datasets/",
    samples: 2000,
    collectionMethod: "Public dataset",
    dateRange: "Various",
  },
  {
    name: "Synthetic Data Generation",
    description: "Generated using image augmentation",
    samples: 1000,
    collectionMethod: "Augmentation pipeline",
    dateRange: "2024",
  },
];
