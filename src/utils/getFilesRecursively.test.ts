import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import getDirectoryItems from "./getDirectoryItems";
import getFilesRecursively from "./getFilesRecursively";

jest.mock("./getDirectoryItems");

describe("getFilesRecursively", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return files in the current directory at depth 0", async () => {
    (getDirectoryItems as jest.MockedFunction<typeof getDirectoryItems>).mockResolvedValueOnce([
      { fullPath: "/some/path/file1.txt", relativePath: "file1.txt", isDirectory: false },
      { fullPath: "/some/path/folder1", relativePath: "folder1", isDirectory: true },
    ]);
    (getDirectoryItems as jest.MockedFunction<typeof getDirectoryItems>).mockResolvedValue([]);

    const result = await getFilesRecursively("/some/path");

    expect(result).toEqual(["file1.txt"]);
    expect(getDirectoryItems).toHaveBeenCalledTimes(2);
    expect(getDirectoryItems).toHaveBeenCalledWith("/some/path");
    expect(getDirectoryItems).toHaveBeenCalledWith("/some/path/folder1");
  });

  it("should return files in subdirectories", async () => {
    (getDirectoryItems as jest.MockedFunction<typeof getDirectoryItems>).mockResolvedValueOnce([
      { fullPath: "/some/path/folder1", relativePath: "folder1", isDirectory: true },
      { fullPath: "/some/path/file1.txt", relativePath: "file1.txt", isDirectory: false },
    ]);
    (getDirectoryItems as jest.MockedFunction<typeof getDirectoryItems>).mockResolvedValueOnce([
      { fullPath: "/some/path/folder1/file2.txt", relativePath: "file2.txt", isDirectory: false },
    ]);

    const result = await getFilesRecursively("/some/path");

    expect(result).toEqual(["folder1/file2.txt", "file1.txt"]);
    expect(getDirectoryItems).toHaveBeenCalledTimes(2);
    expect(getDirectoryItems).toHaveBeenCalledWith("/some/path");
    expect(getDirectoryItems).toHaveBeenCalledWith("/some/path/folder1");
  });

  it("should handle multiple levels of directories", async () => {
    (getDirectoryItems as jest.MockedFunction<typeof getDirectoryItems>).mockResolvedValueOnce([
      { fullPath: "/some/path/folder1", relativePath: "folder1", isDirectory: true },
      { fullPath: "/some/path/file1.txt", relativePath: "file1.txt", isDirectory: false },
    ]);
    (getDirectoryItems as jest.MockedFunction<typeof getDirectoryItems>).mockResolvedValueOnce([
      { fullPath: "/some/path/folder1/folder2", relativePath: "folder2", isDirectory: true },
    ]);
    (getDirectoryItems as jest.MockedFunction<typeof getDirectoryItems>).mockResolvedValueOnce([
      { fullPath: "/some/path/folder1/folder2/file3.txt", relativePath: "file3.txt", isDirectory: false },
    ]);

    const result = await getFilesRecursively("/some/path");

    expect(result).toEqual(["folder1/folder2/file3.txt", "file1.txt"]);
    expect(getDirectoryItems).toHaveBeenCalledTimes(3);
    expect(getDirectoryItems).toHaveBeenCalledWith("/some/path");
    expect(getDirectoryItems).toHaveBeenCalledWith("/some/path/folder1");
    expect(getDirectoryItems).toHaveBeenCalledWith("/some/path/folder1/folder2");
  });

  it("should handle empty directories", async () => {
    (getDirectoryItems as jest.MockedFunction<typeof getDirectoryItems>).mockResolvedValue([]);

    const result = await getFilesRecursively("/empty/directory");

    expect(result).toEqual([]);
    expect(getDirectoryItems).toHaveBeenCalledWith("/empty/directory");
  });
});
