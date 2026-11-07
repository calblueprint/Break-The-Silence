export type HeadingSize = 'normal' | 'large';

export interface Guide {
  id: string;
  slug: string;
  title: string;
  description?: string;
  sections: GuideSection[];
}

export interface GuideSection {
  id: string;
  title: string;
  description?: string;
  headingSize?: HeadingSize;
  blocks: GuideBlock[];
}

export type GuideBlock =
  | TextBlock
  | HeadingBlock
  | ListBlock
  | CalloutBlock
  | ResourceBlock
  | ImageBlock;

interface BaseBlock {
  id: string;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  text: string;
  level: 2 | 3;
  headingSize?: HeadingSize;
}

export interface ListBlock extends BaseBlock {
  type: 'list';
  style: 'bullet' | 'number' | 'emoji' | 'check' | 'none';
  title?: string;
  start?: number;
  items: ListItem[];
}

export interface ListItem {
  id: string;
  text: string;
  emoji?: string;
}

export interface CalloutBlock extends BaseBlock {
  type: 'callout';
  title?: string;
  content: string;
  variant: 'info' | 'warning' | 'success' | 'neutral';
}

export interface ResourceBlock extends BaseBlock {
  type: 'resource';
  title: string;
  description?: string;
  url?: string;
  phone?: string;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
}
