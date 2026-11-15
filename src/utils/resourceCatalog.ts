import type { ResourceWithDetails } from '~/api/supabase/queries/resources';

export interface ResourceCategory {
  id: string;
  name: string;
  resources: ResourceWithDetails[];
}

export function formatResourceAddress(parts: {
  street_address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
}) {
  const cityState = [parts.city, parts.state].filter(Boolean).join(', ');
  const cityStateZip = [cityState, parts.zip_code].filter(Boolean).join(' ');
  return [parts.street_address, cityStateZip].filter(Boolean).join(', ');
}

export function matchesResource(resource: ResourceWithDetails, search: string) {
  const query = search.trim().toLocaleLowerCase();
  if (!query) return true;

  return [
    resource.name,
    resource.description,
    resource.website,
    formatResourceAddress(resource),
    ...resource.resource_category_map.map(item => item.category),
    ...resource.resource_service_area.map(formatResourceAddress),
    ...resource.resource_contact.flatMap(contact => [
      contact.name,
      contact.phone_number,
      contact.email_address,
      contact.street_address,
    ]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase()
    .includes(query);
}

// Derive types from the catalog so newly added categories appear automatically.
export function getResourceCategories(resources: ResourceWithDetails[]) {
  const categories = new Map<string, ResourceCategory>();

  for (const resource of resources) {
    const names = resource.resource_category_map
      .map(item => item.category.trim())
      .filter(Boolean);
    const resourceCategories = names.length ? names : ['Other resources'];
    const seen = new Set<string>();

    for (const name of resourceCategories) {
      const id = names.length
        ? `category:${name.toLocaleLowerCase()}`
        : 'uncategorized';
      if (seen.has(id)) continue;
      seen.add(id);
      const category = categories.get(id) ?? { id, name, resources: [] };
      category.resources.push(resource);
      categories.set(id, category);
    }
  }

  return [...categories.values()].sort((a, b) => {
    if (a.id === 'uncategorized') return 1;
    if (b.id === 'uncategorized') return -1;
    return a.name.localeCompare(b.name);
  });
}

export function filterCategoryResources(
  category: ResourceCategory,
  search: string,
) {
  const query = search.trim().toLocaleLowerCase();
  return category.name.toLocaleLowerCase().includes(query)
    ? category.resources
    : category.resources.filter(resource => matchesResource(resource, query));
}

export function getCategoryPresentation(name: string) {
  if (/legal|law|protect|rights/i.test(name)) {
    return {
      icon: 'shield' as const,
      description: 'Explore legal help and advocacy services.',
      background: '#F1EAF7',
      color: '#5B2A8C',
    };
  }
  if (/hous|shelter|accommodat/i.test(name)) {
    return {
      icon: 'home' as const,
      description: 'Explore housing and shelter services.',
      background: '#EAF2F9',
      color: '#365E83',
    };
  }
  if (/counsel|therap|mental|healing|emotional/i.test(name)) {
    return {
      icon: 'heart' as const,
      description: 'Find care for your emotional well-being.',
      background: '#F9EBF1',
      color: '#94496B',
    };
  }
  if (/health|medical|hospital/i.test(name)) {
    return {
      icon: 'plus-circle' as const,
      description: 'Explore health and medical care services.',
      background: '#E8F3EE',
      color: '#386F57',
    };
  }
  if (/financ|money|benefit|economic/i.test(name)) {
    return {
      icon: 'dollar-sign' as const,
      description: 'Find financial assistance and practical support.',
      background: '#F8F0DF',
      color: '#87652A',
    };
  }
  if (/food|meal|nutrition/i.test(name)) {
    return {
      icon: 'shopping-bag' as const,
      description: 'Explore food and everyday essentials.',
      background: '#F8F0DF',
      color: '#87652A',
    };
  }
  if (/work|employ|career|job/i.test(name)) {
    return {
      icon: 'briefcase' as const,
      description: 'Explore employment and workplace support.',
      background: '#EAF2F9',
      color: '#365E83',
    };
  }
  if (/school|educat|student/i.test(name)) {
    return {
      icon: 'book-open' as const,
      description: 'Find education and student support services.',
      background: '#F1EAF7',
      color: '#5B2A8C',
    };
  }
  if (/child|family|parent|youth/i.test(name)) {
    return {
      icon: 'users' as const,
      description: 'Explore support for children and families.',
      background: '#F9EBF1',
      color: '#94496B',
    };
  }
  if (/crisis|hotline|helpline/i.test(name)) {
    return {
      icon: 'phone' as const,
      description: 'Find services you can reach out to directly.',
      background: '#F1EAF7',
      color: '#5B2A8C',
    };
  }
  return {
    icon: 'compass' as const,
    description: 'Explore services and find support that fits.',
    background: '#F1EAF7',
    color: '#5B2A8C',
  };
}
