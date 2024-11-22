import path from "node:path";
import getFilesRecursively from "~/utils/getFilesRecursively";

export default async function getStaticAssets() {
  const buildPath = path.resolve(process.cwd(), ".next");
  const baseDir = path.resolve(buildPath, "static");
  const files = await getFilesRecursively(baseDir);
  return files.map(item => `/_next/static/${item}`);
}
