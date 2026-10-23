import supabase from '../client';

// ---- Types ------------------------------------------------------------------

export interface Resource {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  verified_at: string | null;
  updated_at: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  street_address: string | null;
}

export interface ResourceContact {
  id: string;
  resource_id: string;
  name: string | null;
  email_address: string | null;
  phone_number: string | null;
  street_address: string | null;
}

export interface ResourceCategoryMap {
  id: string;
  resource_id: string;
  category: string;
}

export interface ResourceServiceArea {
  id: string;
  resource_id: string;
  city: string | null;
  state: string | null;
  zip_code: string | null;
}

/** A Resource with its contacts, categories and service areas attached. */
export interface ResourceWithDetails extends Resource {
  resource_contact: ResourceContact[];
  resource_category_map: ResourceCategoryMap[];
  resource_service_area: ResourceServiceArea[];
}

/** Fields to provide when creating a Resource (id and timestamps are set by the DB/queries). */
export type NewResource = Omit<
  Resource,
  'id' | 'updated_at' | 'verified_at'
> & {
  verified_at?: string | null;
};

export interface ResourceFilters {
  /** Case-insensitive match on the Resource name. */
  search?: string;
  /** Exact category, e.g. "Legal". */
  category?: string;
  /** A Resource matches if ONE service-area row matches every area field given. */
  state?: string;
  city?: string;
  zipCode?: string;
}

const RESOURCE_WITH_DETAILS =
  '*, resource_contact(*), resource_category_map(*), resource_service_area(*)';

// ---- Reads --------------------------------------------------------------------

/** Get all Resources (with contacts, categories and service areas), ordered by name. */
export async function getResources(): Promise<ResourceWithDetails[]> {
  const { data, error } = await supabase
    .from('resource')
    .select(RESOURCE_WITH_DETAILS)
    .order('name', { ascending: true });
  if (error) throw new Error(`Error fetching resources: ${error.message}`);
  return (data ?? []) as ResourceWithDetails[];
}

/** Get a single Resource by id, or null if it doesn't exist. */
export async function getResourceById(
  id: string,
): Promise<ResourceWithDetails | null> {
  const { data, error } = await supabase
    .from('resource')
    .select(RESOURCE_WITH_DETAILS)
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(`Error fetching resource: ${error.message}`);
  return (data as ResourceWithDetails | null) ?? null;
}

/**
 * Filter Resources by name, category and/or service area.
 *
 * Category and service area live in child tables, so we first find the matching
 * resource ids there, then fetch those Resources with all their details. (A
 * single inner-join query would hide non-matching categories from each result.)
 */
export async function filterResources(
  filters: ResourceFilters,
): Promise<ResourceWithDetails[]> {
  let allowedIds: Set<string> | null = null;

  /** Narrow the allowed ids to those also in `ids` (or start the set if none yet). */
  const intersect = (
    current: Set<string> | null,
    ids: string[],
  ): Set<string> => {
    const next = new Set(ids);
    return current ? new Set([...current].filter(id => next.has(id))) : next;
  };

  if (filters.category) {
    const { data, error } = await supabase
      .from('resource_category_map')
      .select('resource_id')
      .eq('category', filters.category);
    if (error)
      throw new Error(
        `Error filtering resources by category: ${error.message}`,
      );
    allowedIds = intersect(
      allowedIds,
      (data ?? []).map(r => r.resource_id as string),
    );
  }

  if (filters.state || filters.city || filters.zipCode) {
    let areaQuery = supabase
      .from('resource_service_area')
      .select('resource_id');
    if (filters.state) areaQuery = areaQuery.eq('state', filters.state);
    if (filters.city) areaQuery = areaQuery.ilike('city', filters.city);
    if (filters.zipCode) areaQuery = areaQuery.eq('zip_code', filters.zipCode);
    const { data, error } = await areaQuery;
    if (error)
      throw new Error(
        `Error filtering resources by service area: ${error.message}`,
      );
    allowedIds = intersect(
      allowedIds,
      (data ?? []).map(r => r.resource_id as string),
    );
  }

  // A child-table filter matched nothing, so no Resource can match.
  if (allowedIds && allowedIds.size === 0) return [];

  let query = supabase
    .from('resource')
    .select(RESOURCE_WITH_DETAILS)
    .order('name', { ascending: true });
  if (allowedIds) query = query.in('id', [...allowedIds]);
  if (filters.search?.trim())
    query = query.ilike('name', `%${filters.search.trim()}%`);

  const { data, error } = await query;
  if (error) throw new Error(`Error filtering resources: ${error.message}`);
  return (data ?? []) as ResourceWithDetails[];
}

// ---- Writes ---------------------------------------------------------------------
/**
 * Create a Resource, optionally with contacts, categories and service areas.
 * Not atomic: if a child insert fails, the new Resource is removed again.
 * (For true atomicity, wrap this in a Postgres function and call it with rpc().)
 */
export async function createResource(
  resource: NewResource,
  children: {
    contacts?: Omit<ResourceContact, 'id' | 'resource_id'>[];
    categories?: string[];
    serviceAreas?: Omit<ResourceServiceArea, 'id' | 'resource_id'>[];
  } = {},
): Promise<ResourceWithDetails> {
  const { data: created, error } = await supabase
    .from('resource')
    .insert({ ...resource, updated_at: new Date().toISOString() })
    .select('id')
    .single();
  if (error) throw new Error(`Error creating resource: ${error.message}`);
  const resourceId = created.id as string;

  try {
    const { contacts = [], categories = [], serviceAreas = [] } = children;
    const inserts = [
      contacts.length
        ? supabase
            .from('resource_contact')
            .insert(contacts.map(c => ({ ...c, resource_id: resourceId })))
        : null,
      categories.length
        ? supabase.from('resource_category_map').insert(
            categories.map(category => ({
              category,
              resource_id: resourceId,
            })),
          )
        : null,
      serviceAreas.length
        ? supabase
            .from('resource_service_area')
            .insert(serviceAreas.map(a => ({ ...a, resource_id: resourceId })))
        : null,
    ];
    for (const result of await Promise.all(inserts)) {
      if (result?.error)
        throw new Error(
          `Error creating resource details: ${result.error.message}`,
        );
    }
  } catch (e) {
    await supabase.from('resource').delete().eq('id', resourceId); // best-effort rollback
    throw e;
  }

  const full = await getResourceById(resourceId);
  if (!full)
    throw new Error(
      `Resource ${resourceId} was created but could not be read back`,
    );
  return full;
}

/** Update a Resource's own fields. Always refreshes updated_at. */
export async function updateResource(
  id: string,
  updates: Partial<Omit<Resource, 'id' | 'updated_at'>>,
): Promise<Resource> {
  const { data, error } = await supabase
    .from('resource')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(`Error updating resource: ${error.message}`);
  return data as Resource;
}

/** Delete a Resource.*/
export async function deleteResource(id: string): Promise<void> {
  const { error } = await supabase.from('resource').delete().eq('id', id);
  if (error) throw new Error(`Error deleting resource: ${error.message}`);
}
