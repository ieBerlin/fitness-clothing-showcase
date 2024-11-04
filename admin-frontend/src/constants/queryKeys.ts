export const QUERY_KEYS = {
  sections: "sections",
  products: "products",
  admins: "admins",
  activities: "activities",
  statistics: "statistics",
  notifications: "notifications",
  basicInformations: "basic-informations",
} as const;

export type QueryKeyType = keyof typeof QUERY_KEYS;

export const getQueryKey = (
  key: QueryKeyType,
  params: (string | number)[] = []
): [string, ...Array<string | number>] => {
  if (!QUERY_KEYS[key]) throw new Error(`Invalid query key: ${key}`);
  return [QUERY_KEYS[key], ...params];
};
