export const guideCategories = [
  'After the Abuse',
  'Am I at Risk?',
  'Addiction & Rehab',
  'Protections',
  'Workplace & School',
  'Support & Healing',
] as const;

export type GuideCategory = (typeof guideCategories)[number];

export interface GuideCatalogEntry {
  id: string;
  legacySlug?: string;
  title: string;
  category: GuideCategory;
  imageUrl: string;
  orderInCategory: number;
  categoryGuideCount: number;
  readTimeMinutes: number;
  isBookmarked: boolean;
  summary: string;
  body: string;
  tags: string[];
}

export interface ContinueReadingGuide {
  id: string;
  title: string;
  category: string;
  progress: number;
}
