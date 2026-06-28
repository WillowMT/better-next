import "./setup";
import { describe, expect, test } from "bun:test";
import { NextRequest } from "next/server";
import { config, proxy } from "@/proxy";
import { createSessionCookie } from "./helpers/auth";

describe("proxy route protection", () => {
  test("redirects unauthenticated users to sign-in with next param", async () => {
    const request = new NextRequest("http://localhost/dashboard");

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost/sign-in?next=%2Fdashboard",
    );
  });

  test("preserves private path in next redirect param", async () => {
    const request = new NextRequest("http://localhost/private");

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost/sign-in?next=%2Fprivate",
    );
  });

  test("preserves protected subpath and query in next redirect param", async () => {
    const request = new NextRequest("http://localhost/dashboard/settings?tab=profile");

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost/sign-in?next=%2Fdashboard%2Fsettings%3Ftab%3Dprofile",
    );
  });

  test("allows authenticated users through", async () => {
    const session = await createSessionCookie({ name: "Proxy User" });
    const request = new NextRequest("http://localhost/dashboard", {
      headers: { cookie: session.cookie },
    });

    const response = await proxy(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  test("uses a static matcher for protected routes", () => {
    expect(config.matcher).toEqual(["/dashboard/:path*", "/private/:path*"]);
  });
});
