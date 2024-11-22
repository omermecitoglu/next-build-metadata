import path from "node:path";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import getFilesRecursively from "~/utils/getFilesRecursively";
import getStaticAssets from "./getStaticAssets";

jest.mock("~/utils/getFilesRecursively");

describe("getStaticAssets", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return static assets with correct paths", async () => {
    (getFilesRecursively as jest.MockedFunction<typeof getFilesRecursively>).mockResolvedValueOnce([
      "chunks/chunk-1.js",
      "chunks/chunk-2.js",
      "chunks/chunk-3.js",
      "css/styles.css",
    ]);

    const result = await getStaticAssets();

    expect(result).toEqual([
      "/_next/static/chunks/chunk-1.js",
      "/_next/static/chunks/chunk-2.js",
      "/_next/static/chunks/chunk-3.js",
      "/_next/static/css/styles.css",
    ]);
    expect(getFilesRecursively).toHaveBeenCalledWith(path.resolve(process.cwd(), ".next", "static"));
  });

  it("should handle an empty directory", async () => {
    (getFilesRecursively as jest.MockedFunction<typeof getFilesRecursively>).mockResolvedValueOnce([]);

    const result = await getStaticAssets();

    expect(result).toEqual([]);
    expect(getFilesRecursively).toHaveBeenCalledWith(path.resolve(process.cwd(), ".next", "static"));
  });

  it("should handle deeply nested files", async () => {
    (getFilesRecursively as jest.MockedFunction<typeof getFilesRecursively>).mockResolvedValueOnce([
      "chunks/pages/chunk-1.js",
      "chunks/pages/chunk-2.js",
    ]);

    const result = await getStaticAssets();

    expect(result).toEqual([
      "/_next/static/chunks/pages/chunk-1.js",
      "/_next/static/chunks/pages/chunk-2.js",
    ]);
  });

  it("should throw an error if getFilesRecursively fails", async () => {
    (getFilesRecursively as jest.MockedFunction<typeof getFilesRecursively>)
      .mockRejectedValueOnce(new Error("Filesystem error"));

    await expect(getStaticAssets()).rejects.toThrow("Filesystem error");
  });
});
