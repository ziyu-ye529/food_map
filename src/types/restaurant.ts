export type NoiseLevel = "Quiet" | "Moderate" | "Loud";
export type PowerOutlets = "None" | "Few" | "Many";

export type StudyFriendly = {
  hasWifi: boolean;
  powerOutlets: PowerOutlets;
  noiseLevel: NoiseLevel;
};

export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  contact: string;
  rating: number;
  review: string;
  pricePerPerson: number;
  waitTime: number;
  distance: number;
  hasStudentDiscount: boolean;
  studyFriendly: StudyFriendly;
  tags: string[];
  dietaryOptions: string[];
  operatingHours: string;
  isOpenNow: boolean;
  images: string[];
  isSaved: boolean;
  // Assigned at runtime
  lng?: number;
  lat?: number;
};
