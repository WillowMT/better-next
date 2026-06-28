import { describe, expect, test } from "bun:test";
import { appMetadata } from "@/lib/metadata";

describe("app metadata", () => {
  test("defines a reusable title template and social metadata", () => {
    expect(appMetadata.title).toEqual({
      default: "better-next",
      template: "%s | better-next",
    });
    expect(appMetadata.description).toContain("Next.js 16");
    expect(appMetadata.openGraph).toMatchObject({
      title: "better-next",
      type: "website",
    });
    expect(appMetadata.twitter).toMatchObject({
      card: "summary",
      title: "better-next",
    });
  });
});
