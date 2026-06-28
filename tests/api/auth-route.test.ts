import "../setup";
import { describe, expect, test } from "bun:test";
import { GET } from "@/app/api/auth/[...all]/route";

describe("auth route handler", () => {
  test("GET /api/auth/ok returns healthy status", async () => {
    const request = new Request("http://localhost/api/auth/ok");
    const response = await GET(request);

    expect(response.status).toBe(200);

    const data = (await response.json()) as { ok: boolean };
    expect(data.ok).toBe(true);
  });

  test("GET unknown auth path returns 404", async () => {
    const request = new Request("http://localhost/api/auth/does-not-exist");
    const response = await GET(request);

    expect(response.status).toBe(404);
  });
});
