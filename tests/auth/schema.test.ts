import { describe, expect, test } from "bun:test";
import { getTableColumns } from "drizzle-orm";
import { account, session, user, verification } from "@/db/schema";

describe("auth schema column mapping", () => {
  test("user table uses camelCase database column names", () => {
    const columns = getTableColumns(user);

    expect(columns.emailVerified.name).toBe("emailVerified");
    expect(columns.createdAt.name).toBe("createdAt");
    expect(columns.updatedAt.name).toBe("updatedAt");
  });

  test("session table uses camelCase database column names", () => {
    const columns = getTableColumns(session);

    expect(columns.expiresAt.name).toBe("expiresAt");
    expect(columns.userId.name).toBe("userId");
    expect(columns.ipAddress.name).toBe("ipAddress");
    expect(columns.userAgent.name).toBe("userAgent");
  });

  test("account table uses camelCase database column names", () => {
    const columns = getTableColumns(account);

    expect(columns.accountId.name).toBe("accountId");
    expect(columns.providerId.name).toBe("providerId");
    expect(columns.userId.name).toBe("userId");
    expect(columns.accessTokenExpiresAt.name).toBe("accessTokenExpiresAt");
  });

  test("verification table uses camelCase database column names", () => {
    const columns = getTableColumns(verification);

    expect(columns.expiresAt.name).toBe("expiresAt");
    expect(columns.createdAt.name).toBe("createdAt");
    expect(columns.updatedAt.name).toBe("updatedAt");
  });
});
