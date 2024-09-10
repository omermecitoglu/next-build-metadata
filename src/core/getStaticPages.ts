import path from "node:path";
import getFilesRecursively from "~/utils/getFilesRecursively";

export default async function getStaticPages() {
  const buildPath = path.resolve(process.cwd(), ".next");
  const baseDir = path.resolve(buildPath, "server", "app");
  const files = await getFilesRecursively(baseDir);
  const items = files.filter(fileName => {
    return !fileName.includes("_not-found.html") && fileName.endsWith(".html");
  });
  return items.map(item => {
    return "/" + item
      .slice(0, -5)
      .split("/")
      .filter(i => i !== "index")
      .join("/");
  });
}
