import { stat } from "fs/promises";
import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import isDirectory from "./isDirectory";
import type { Stats } from "fs";

type MockedStat = jest.MockedFunction<typeof stat>;

jest.mock("fs/promises", () => ({
  stat: jest.fn() as MockedStat,
}));

describe("isDirectory", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  it("should return true if the path is a directory", async () => {
    const mockStats = { isDirectory: jest.fn().mockReturnValue(true) } as Partial<Stats>;
    (stat as MockedStat).mockResolvedValue(mockStats as Stats);

    const result = await isDirectory("/some/path");

    expect(result).toBe(true);
    expect(stat).toHaveBeenCalledWith("/some/path");
  });

  it("should return false if the path is not a directory", async () => {
    const mockStats = { isDirectory: jest.fn().mockReturnValue(false) } as Partial<Stats>;
    (stat as MockedStat).mockResolvedValue(mockStats as Stats);

    const result = await isDirectory("/some/path");

    expect(result).toBe(false);
    expect(stat).toHaveBeenCalledWith("/some/path");
  });

  it("should return false if there is an error", async () => {
    (stat as MockedStat).mockRejectedValue(new Error("Some error"));

    const result = await isDirectory("/invalid/path");

    expect(result).toBe(false);
  });
});
