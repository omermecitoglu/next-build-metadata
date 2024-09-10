import { readdir } from "node:fs/promises";
import isDirectory from "./isDirectory";

type DirectoryItem = {
  fullPath: string,
  relativePath: string,
  isDirectory: boolean,
};

export default async function getDirectoryItems(dirPath: string) {
  const items = await readdir(dirPath);
  const isItemDirectory = await Promise.all(items.map(item => isDirectory(`${dirPath}/${item}`)));
  return items.map<DirectoryItem>((item, index) => ({
    fullPath: `${dirPath}/${item}`,
    relativePath: item,
    isDirectory: isItemDirectory[index],
  }));
}
