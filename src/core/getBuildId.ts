import { readFile } from "node:fs/promises";
import path from "node:path";

export default async function getBuildId() {
  try {
    return await readFile(path.resolve(process.cwd(), ".next", "BUILD_ID"), "utf-8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error("Application has not been built yet!");
    }
    throw error;
  }
}
