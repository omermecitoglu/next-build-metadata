import { readFile } from "node:fs/promises";
import path from "node:path";
import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import getBuildId from "./getBuildId";

type MockedReadFile = jest.MockedFunction<typeof readFile>;

jest.mock("node:fs/promises", () => ({
  readFile: jest.fn() as MockedReadFile,
}));

describe("getBuildId", () => {
  const buildIdPath = path.resolve(process.cwd(), ".next", "BUILD_ID");

  beforeAll(() => {
    jest.clearAllMocks();
  });

  it("should return the build ID when the file exists", async () => {
    const mockBuildId = "123456";
    (readFile as MockedReadFile).mockResolvedValue(mockBuildId);

    const buildId = await getBuildId();

    expect(buildId).toBe(mockBuildId);
    expect(readFile).toHaveBeenCalledWith(buildIdPath, "utf-8");
  });

  it("should throw an error if the file does not exist", async () => {
    (readFile as MockedReadFile).mockRejectedValue({ code: "ENOENT" });

    await expect(getBuildId()).rejects.toThrow("Application has not been built yet!");
  });

  it("should throw an error if there is another error", async () => {
    const errorMessage = "Some other error";
    (readFile as MockedReadFile).mockRejectedValue(new Error(errorMessage));

    await expect(getBuildId()).rejects.toThrow(errorMessage);
  });
});
