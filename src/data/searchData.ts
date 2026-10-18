interface SearchItem {
  title: string;
  keywords: string[];
  route: string;
}

export const searchableItemsList: SearchItem[] = [
  {
    title: 'Support Line',
    keywords: ['support', 'talk', 'help', 'someone', 'message', 'text'],
    route: '/support/support-line',
  },
  {
    title: 'Resources',
    keywords: ['resources', 'help', 'services', 'legal', 'shelter', 'text'],
    route: '/support/resources',
  },
  {
    title: 'Guides',
    keywords: ['guides', 'toolkit', 'information', 'learn', 'support', 'text'],
    route: '/support/guides',
  },
  {
    title: 'Diary',
    keywords: ['diary', 'journal', 'write', 'entry', 'text'],
    route: '/journal',
  },
  {
    title: 'Documents',
    keywords: ['documents', 'files', 'upload', 'text'],
    route: '/documents',
  },
  {
    title: 'Profile',
    keywords: ['profile', 'account', 'settings'],
    route: '/profile',
  },
];
