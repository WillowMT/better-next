import { describe, expect, test } from "bun:test";
import { getTableColumns, getTableName } from "drizzle-orm";
import { account, session, user, verification } from "@/db/schema";

describe("auth schema column mapping", () => {
  test("user table uses expected table name and core columns", () => {
    expect(getTableName(user)).toBe("user");

    const columns = getTableColumns(user);

    expect(columns.id.name).toBe("id");
    expect(columns.name.name).toBe("name");
    expect(columns.email.name).toBe("email");
    expect(columns.image.name).toBe("image");
    expect(columns.emailVerified.name).toBe("emailVerified");
    expect(columns.createdAt.name).toBe("createdAt");
    expect(columns.updatedAt.name).toBe("updatedAt");
    expect(columns.email.isUnique).toBe(true);
  });

  test("session table uses camelCase database column names", () => {
    expect(getTableName(session)).toBe("session");

    const columns = getTableColumns(session);

    expect(columns.expiresAt.name).toBe("expiresAt");
    expect(columns.userId.name).toBe("userId");
    expect(columns.ipAddress.name).toBe("ipAddress");
    expect(columns.userAgent.name).toBe("userAgent");
    expect(columns.token.isUnique).toBe(true);
  });

  test("account table uses camelCase database column names", () => {
    expect(getTableName(account)).toBe("account");

    const columns = getTableColumns(account);

    expect(columns.accountId.name).toBe("accountId");
    expect(columns.providerId.name).toBe("providerId");
    expect(columns.userId.name).toBe("userId");
    expect(columns.accessTokenExpiresAt.name).toBe("accessTokenExpiresAt");
    expect(columns.password.name).toBe("password");
  });

  test("verification table uses camelCase database column names", () => {
    expect(getTableName(verification)).toBe("verification");

    const columns = getTableColumns(verification);

    expect(columns.identifier.name).toBe("identifier");
    expect(columns.value.name).toBe("value");
    expect(columns.expiresAt.name).toBe("expiresAt");
    expect(columns.createdAt.name).toBe("createdAt");
    expect(columns.updatedAt.name).toBe("updatedAt");
  });
});
