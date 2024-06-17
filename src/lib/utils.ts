export function formatS3Key(id: number, filename: string, path: string = '') {
  return `${path}${id}-${filename}`;
}
