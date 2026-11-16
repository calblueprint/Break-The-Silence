export interface SearchResultItem {
  title: string;
  keywords: string[];
  route: string;
}

export const searchableItemsList: SearchResultItem[] = [
  {
    title: 'Support Line',
    keywords: ['support', 'talk', 'help', 'someone', 'message', 'text'],
    route: '/support/support-line',
  },
  {
    title: 'Resources',
    keywords: ['resources', 'help', 'services', 'legal', 'shelter', 'text'],
    route: '/tools/resources',
  },
  {
    title: 'Guides',
    keywords: ['guides', 'toolkit', 'information', 'learn', 'support', 'text'],
    route: '/tools/guides',
  },
  {
    title: 'Diary',
    keywords: ['diary', 'journal', 'write', 'entry', 'text'],
    route: '/journal',
  },
  {
    title: 'Documents',
    keywords: ['documents', 'files', 'upload', 'text'],
    route: '/profile/documents',
  },
  {
    title: 'Profile',
    keywords: ['profile', 'account', 'settings'],
    route: '/profile',
  },
];
