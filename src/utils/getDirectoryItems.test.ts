import { readdir } from "node:fs/promises";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import getDirectoryItems from "./getDirectoryItems";
import isDirectory from "./isDirectory"; // Import isDirectory for mocking
import type { PathLike } from "node:fs";

type MockedReadDir = jest.MockedFunction<(path: PathLike) => Promise<string[]>>;
type MockedIsDirectory = jest.MockedFunction<typeof isDirectory>;

jest.mock("node:fs/promises", () => ({
  readdir: jest.fn() as MockedReadDir,
}));

jest.mock("./isDirectory", () => jest.fn());

describe("getDirectoryItems", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return directory items with their full and relative paths and directory status", async () => {
    const mockReaddirItems: string[] = ["file1.txt", "folder1"];
    (readdir as unknown as MockedReadDir).mockResolvedValue(mockReaddirItems);

    (isDirectory as MockedIsDirectory).mockImplementation(path => {
      return Promise.resolve(path.endsWith("folder1"));
    });

    const dirPath = "/some/path";
    const result = await getDirectoryItems(dirPath);

    expect(result).toEqual([
      {
        fullPath: "/some/path/file1.txt",
        relativePath: "file1.txt",
        isDirectory: false,
      },
      {
        fullPath: "/some/path/folder1",
        relativePath: "folder1",
        isDirectory: true,
      },
    ]);

    expect(readdir).toHaveBeenCalledWith(dirPath);
    expect(isDirectory).toHaveBeenCalledTimes(2);
  });

  it("should handle empty directories", async () => {
    (readdir as unknown as MockedReadDir).mockResolvedValue([]);

    const dirPath = "/empty/directory";
    const result = await getDirectoryItems(dirPath);

    expect(result).toEqual([]);
    expect(readdir).toHaveBeenCalledWith(dirPath);
  });
});
