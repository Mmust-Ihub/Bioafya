export type LocationObject = {
  coordinates: [string, string]; // [longitude, latitude]
};

export type CropInfo = {
  crop: string;
  disease: string;
  other_crops_infested: string[];
  cause: string[];
  life_cycle: string[];
  remedy: string[];
  preventive_measures: string[];
  environment_conditions: string[];
  nutrient_deficiency: string[];
  companion_planting: string[];
  post_harvest_handling: string[];
  image_url: string[];
};
export type PestInfo = {
  pest_name: string;
  affected_crops: string[];
  life_cycle: string[];
  treatment: string[];
  preventive_measures: string[];
  environment_conditions: string[];
  companion_planting: string[];
  nutrient_deficiencies: string[];
  post_harvest_handling: string[];
  image_url: string;
};
export type Image = {
  assetId: string | null;
  base64: string | null;
  duration: number | null;
  exif: Record<string, unknown> | null;
  fileName: string;
  fileSize: number;
  height: number;
  mimeType: string;
  rotation: number | null;
  type: "image";
  uri: string;
  width: number;
};

export type ImagePickerResult = {
  assets: Image[];
  canceled: boolean;
};

export type Vet = {
  email: string;
  phone_number: string;
  username: string;
  _id: string;
};

export type AnimalDiseaseInfo = {
  animal: string;
  biosecurity_measures: string[]; // Array of biosecurity measures
  cause: string[]; // List of causes (e.g., viruses)
  disease: string; // Disease name
  environmental_conditions: string[]; // List of environmental conditions
  image_url: string; // URL to the image
  nearbyVets: Vet[]; // Array of nearby vets
  nutritional_deficiency: string[]; // Any nutritional deficiencies observed
  other_animals_affected: string[]; // List of other animals affected
  post_infection_management: string[]; // Post-infection management measures
  preventive_measures: string[]; // List of preventive measures
  remedy: string[]; // Remedies or treatments
  symptoms: string[]; // List of symptoms
  transmission: string[]; // Transmission modes
  user_id: string; // User ID who reported the case
};
