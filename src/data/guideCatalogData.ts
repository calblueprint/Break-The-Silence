import type { DetailedGuide, GuideBlock } from '@/data/guidesTypes';
import type {
  ContinueReadingGuide,
  GuideCatalogEntry,
} from './guideCatalogTypes';
import mockGuides from '@/data/mockGuides';
import { guideCategories } from './guideCatalogTypes';

export const continueReadingGuide: ContinueReadingGuide = {
  id: 'continue-reading-finances',
  title: 'Continue Reading',
  category: 'Protections · Finances',
  progress: 0.38,
};

function getBlockText(block: GuideBlock): string {
  switch (block.type) {
    case 'text':
      return block.content;
    case 'heading':
      return block.text;
    case 'list':
      return [block.title, ...block.items.map(item => item.text)]
        .filter((text): text is string => Boolean(text))
        .join(' ');
    case 'callout':
      return [block.title, block.content].filter(Boolean).join(' ');
    case 'resource':
      return [block.title, block.description, block.url, block.phone]
        .filter((text): text is string => Boolean(text))
        .join(' ');
    case 'image':
      return [block.alt, block.caption, block.src]
        .filter((text): text is string => Boolean(text))
        .join(' ');
  }
}

function getDetailedGuideBody(guide: DetailedGuide): string {
  return guide.sections
    .flatMap(section => [
      section.title,
      section.description ?? '',
      ...section.blocks.map(getBlockText),
    ])
    .filter(Boolean)
    .join(' ');
}

const originalGuides: GuideCatalogEntry[] = mockGuides.map(guide => ({
  id: guide.id,
  legacySlug: guide.slug,
  title: guide.title,
  category: 'After the Abuse',
  imageUrl: guide.imageUrl,
  orderInCategory: 1,
  categoryGuideCount: 1,
  readTimeMinutes: 1,
  isBookmarked: guide.isBookmarked,
  summary: guide.description ?? '',
  body: getDetailedGuideBody(guide),
  tags: [guide.category],
}));

function getReadTimeMinutes(summary: string, body: string) {
  const wordCount = `${summary} ${body}`.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

const originalGuidesWithReadTimes = originalGuides.map(guide => ({
  ...guide,
  readTimeMinutes: getReadTimeMinutes(guide.summary, guide.body),
}));

const exampleGuides: GuideCatalogEntry[] = guideCategories.flatMap(category => {
  const categoryId = category.toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-');
  return [1, 2, 3].map(index => ({
    id: `example-${categoryId}-${index}`,
    title: 'Example Guides',
    category,
    imageUrl: '',
    orderInCategory: 1,
    categoryGuideCount: 1,
    readTimeMinutes: 1,
    isBookmarked: false,
    summary: '',
    body: '',
    tags: [],
  }));
});

const unnumberedGuides: GuideCatalogEntry[] = [
  ...originalGuidesWithReadTimes,
  ...exampleGuides,
];

export const guideCatalogEntries: GuideCatalogEntry[] = unnumberedGuides.map(
  guide => {
    const categoryGuides = unnumberedGuides.filter(
      item => item.category === guide.category,
    );
    const orderInCategory =
      categoryGuides.findIndex(item => item.id === guide.id) + 1;

    return {
      ...guide,
      orderInCategory,
      categoryGuideCount: categoryGuides.length,
    };
  },
);
