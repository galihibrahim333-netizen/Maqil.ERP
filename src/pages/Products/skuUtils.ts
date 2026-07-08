export function matchVariantName(source: string, target: string) {
  const normalize = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[-_/]+/g, " ")
      .replace(/\s+/g, " ");

  return normalize(source) === normalize(target);
}
