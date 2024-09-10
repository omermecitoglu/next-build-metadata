import path from "node:path";
import getDirectoryItems from "./getDirectoryItems";

export default async function getFilesRecursively(currentDir: string, depth: number = 0): Promise<string[]> {
  const baseDir = path.resolve(currentDir, ...Array(depth).fill(null).map(() => ".."));
  const items = await getDirectoryItems(currentDir);
  const files = items.filter(item => !item.isDirectory);
  const subDirs = items.filter(item => item.isDirectory);
  const content = await Promise.all(subDirs.map(subDir => {
    return getFilesRecursively(path.resolve(currentDir, subDir.relativePath), depth + 1);
  }));
  return [
    ...content.flat(),
    ...files.map(file => path.relative(baseDir, file.fullPath)),
  ];
}
