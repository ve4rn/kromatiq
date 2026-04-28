export function stableEntries<T>(record: Record<string, T>): Array<[string, T]> {
  return Object.keys(record).map((key) => [key, record[key]] as [string, T]);
}
