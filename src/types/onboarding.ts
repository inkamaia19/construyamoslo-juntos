export type MaterialState = "functional" | "semi_functional" | "not_functional";

export interface Material {
  id: string;
  name: string;
  emoji: string;
  state?: MaterialState;
}

export type Environment = "garden" | "living_room" | "table" | "floor" | "other";

export type Interest = "art_coloring" | "water_bubbles" | "discover" | "sounds_rhythm" | "building";

export interface OnboardingData {
  materials: Material[];
  environment?: Environment;
  interest?: Interest;
}
