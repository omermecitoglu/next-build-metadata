import path from "node:path";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import getFilesRecursively from "~/utils/getFilesRecursively";
import getStaticPages from "./getStaticPages";

jest.mock("~/utils/getFilesRecursively");

describe("getStaticPages", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should return static pages with correct paths", async () => {
    // Mock the output of getFilesRecursively
    (getFilesRecursively as jest.MockedFunction<typeof getFilesRecursively>).mockResolvedValueOnce([
      "index.html",
      "about.html",
      "_not-found.html",
      "contact.html",
      "folder/index.html",
      "folder/about.html",
    ]);

    const result = await getStaticPages();

    expect(result).toEqual([
      "/",
      "/about",
      "/contact",
      "/folder",
      "/folder/about",
    ]);
    expect(getFilesRecursively).toHaveBeenCalledWith(path.resolve(process.cwd(), ".next", "server", "app"));
  });

  it("should handle an empty directory", async () => {
    (getFilesRecursively as jest.MockedFunction<typeof getFilesRecursively>).mockResolvedValueOnce([]);

    const result = await getStaticPages();

    expect(result).toEqual([]);
    expect(getFilesRecursively).toHaveBeenCalledWith(path.resolve(process.cwd(), ".next", "server", "app"));
  });

  it("should ignore _not-found.html and only include valid HTML files", async () => {
    (getFilesRecursively as jest.MockedFunction<typeof getFilesRecursively>).mockResolvedValueOnce([
      "_not-found.html",
      "home.html",
      "products/index.html",
      "services.html",
      "folder/_not-found.html",
      "folder/folder-service.html",
    ]);

    const result = await getStaticPages();

    expect(result).toEqual([
      "/home",
      "/products",
      "/services",
      "/folder/folder-service",
    ]);
    expect(getFilesRecursively).toHaveBeenCalledWith(path.resolve(process.cwd(), ".next", "server", "app"));
  });

  it("should return correct paths for multiple nested folders", async () => {
    (getFilesRecursively as jest.MockedFunction<typeof getFilesRecursively>).mockResolvedValueOnce([
      "index.html",
      "folder1/index.html",
      "folder1/folder2/index.html",
      "folder1/folder2/about.html",
      "folder1/about.html",
      "_not-found.html",
    ]);

    const result = await getStaticPages();

    expect(result).toEqual([
      "/",
      "/folder1",
      "/folder1/folder2",
      "/folder1/folder2/about",
      "/folder1/about",
    ]);
    expect(getFilesRecursively).toHaveBeenCalledWith(path.resolve(process.cwd(), ".next", "server", "app"));
  });
});
